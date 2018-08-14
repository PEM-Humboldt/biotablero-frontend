/* TODO: Habilitar ESTAS lineas en <Tabs /> cuando
se tenga más de tres tipos de gráficos:
scrollable
scrollButtons="on"
*/

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import QueIcon from '@material-ui/icons/LiveHelp';
import DondeIcon from '@material-ui/icons/Beenhere';
import Typography from '@material-ui/core/Typography';
import InfoGraph from './drawer/InfoGraph';
import { ParentSize } from "@vx/responsive";
import PopMenu from './drawer/PopMenu';
import TableStylized from './TableStylized';
import BackGraph from '@material-ui/icons/Timeline';

import ElasticAPI from '../api/elastic';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: "transparent",
  },
});

class Drawer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0,
      datosDonde: [],
      totales: {},
      jurisdiccion: null,
      szh: null,
      strategies: [],
      biomaColor: "white",
      selectedArea: 0,
    };
    this.referencesStrategies = [];
  }

  biomaColor(biomaColor) {
    this.setState({
      color: biomaColor,
    });
  }

  /**
   * Clean up loaded data used for 'Que y Cuanto' and 'Donde'
   *
   * @param {Array} data array of objects with information about compensations
   */
  cleanQueCuantoDondeData(data) {
    const biomas = data.hits.hits.map(({ fields }) => {
      const { BIOMA_IAVH, PORCENT_AFECTACION, FACT_COMP, NATURAL_AFECTADA, TOTAL_COMPENSAR,
        SECUNDARIA_AFECTADA, TRANSFORMADA_AFECTADA } = fields
      return {
        name: BIOMA_IAVH[0],
        porcentaje_affectada: (100 * PORCENT_AFECTACION[0]).toFixed(2),
        fc: FACT_COMP[0],
        natural_afectada: Math.ceil(NATURAL_AFECTADA[0])? NATURAL_AFECTADA[0].toFixed(2) : '',
        total_compensar: Math.ceil(TOTAL_COMPENSAR[0])? TOTAL_COMPENSAR[0].toFixed(2) : '',
        secundaria_afectada: Math.ceil(SECUNDARIA_AFECTADA[0])? SECUNDARIA_AFECTADA[0].toFixed(2) : '',
        transformada_afectada: Math.ceil(TRANSFORMADA_AFECTADA[0])? TRANSFORMADA_AFECTADA[0].toFixed(2) : ''
      }
    });
    const totals = data.hits.hits.reduce(
      (acc, bioma) => ({
        natural_afectada: acc.natural_afectada + bioma.fields.NATURAL_AFECTADA[0],
        secundaria_afectada: acc.secundaria_afectada + bioma.fields.SECUNDARIA_AFECTADA[0],
        transformada_afectada: acc.transformada_afectada + bioma.fields.TRANSFORMADA_AFECTADA[0],
        porcentaje_affectada: acc.porcentaje_affectada + bioma.fields.PORCENT_AFECTACION[0]
      }),
      {
        natural_afectada: 0,
        secundaria_afectada: 0,
        transformada_afectada: 0,
        porcentaje_affectada: 0
      }
    );
    return {
      biomas,
      totals: {
        name: 'TOTALES (CUANTO)',
        natural_afectada: totals.natural_afectada.toFixed(2),
        secundaria_afectada: totals.secundaria_afectada.toFixed(2),
        transformada_afectada: totals.transformada_afectada.toFixed(2),
        total_compensar: data.aggregations.total_area.value.toFixed(2),
        porcentaje_affectada: totals.porcentaje_affectada * 100
      }
    };
  };

  /**
   * Validate if the value in the array is lower or equal to maxValue,
   * and add it to selectedArea
   *
   * @param {number} index index for referencesStrategies
   * @param {number} maxValue maximum allowed value
   */
  addArea(index, maxValue) {
    const value = Number(this.referencesStrategies[index].current.value);
    if(value <= maxValue) {
      this.setState((prevState) => ({selectedArea: value + prevState.selectedArea}))
    }
  }

  cargarEstrategia = (szh, car) => {
    if (!szh || !car) return;
    const data = this.cleanDatosSogamoso(this.props.datosSogamoso);
    const strategies = data[szh][car].results.hits.hits.map(({ _source: obj }, indexRef) => {
      this.referencesStrategies.push(React.createRef());
      return {
        key: obj.GROUPS,
        values: [
          obj.ESTRATEGIA,
          obj.HA_ES_EJ,
          <div>
            <input
              name={obj.GROUPS}
              max={obj.HA_ES_EJ}
              ref= {this.referencesStrategies[indexRef]}
              type="text"
              placeholder='0'/>
            <button className= "addbioma smbtn"
              onClick={() => {
                this.addArea(indexRef,obj.HA_ES_EJ);
              }}>
            </button>
          </div>
        ],
      }
    });
    this.setState({
      szh,
      car,
      strategies
    })
  }

  actualizarTotalACompensar = (data) => {
    // TODO: Actualizar desde el PopMenu
  }

  cleanDatosSogamoso = (data) => {
    if(!data || !data.aggregations) return {};

    const cleanData = {}
    data.aggregations.szh.buckets.forEach(szh => {
      const cleanCar = {}
      szh.car.buckets.forEach(car => {
        cleanCar[car.key] = car
      })
      cleanData[szh.key] = cleanCar
    })
    return cleanData;
  }

  componentDidMount() {
    ElasticAPI.requestQueYCuantoCompensar()
      .then((res) => {
        const { biomas, totals } = this.cleanQueCuantoDondeData(res);
        this.setState ({
          datosDonde: biomas,
          totales: totals,
        });
      })
  }

  mostrarGraficos(param, data, labelX, labelY, graph, colors){
    if(param===1 && graph==="Dots") {
      return (
        <ParentSize className="nocolor">
          {
            parent => (
              parent.width && parent.height
              &&
              <InfoGraph
                width={parent.width}
                height={parent.height}
                colors= {colors}
                graphType={graph}
                data={data}
                labelX={labelX}
                labelY={labelY}
                actualizarBiomaActivo = {this.props.actualizarBiomaActivo}
                biomaActivo={this.props.biomaActivo}
              />
            )
          }
        </ParentSize>
      );
    }
  }

  showSelector = (data, total, color) => {
    // TODO: Finalizar muestra de selector de szh y CAR
    if(total!==0) {
      return (
        <ParentSize className="nocolor">
          {
            parent => (
              parent.width && parent.height
              &&
              <PopMenu
                actualizarBiomaActivo={this.props.actualizarBiomaActivo}
                subArea= {this.props.subArea}
                szh= {this.props.actualizarBiomaActivo}
                color = {this.state.color}
                cargarEstrategia = {this.cargarEstrategia}
                data ={data}
              />
            )
          }
        </ParentSize>
      );
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value, datosDonde, totales } = this.state;

    const tableRows = datosDonde.map((bioma, i) => ({
      key: `que-${i}`,
      values: [
        bioma.name,
        bioma.fc,
        bioma.natural_afectada,
        bioma.secundaria_afectada,
        bioma.transformada_afectada,
        `${bioma.porcentaje_affectada}%`,
        bioma.total_compensar,
      ],
    }));

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            centered
          >
            <Tab className="tabs tabs2" label="Qué · Cuánto" icon={<QueIcon />} />
            <Tab className="tabs tabs2" label="Dónde · Cómo" icon={<DondeIcon />} />
          </Tabs>
          </AppBar>
          {value === 0 &&
            <TabContainer>
              <div className="total">
                <h3>Total a compensar</h3>
                <h4>{totales.total_compensar}</h4>
              </div>
              <TableStylized
                headers={['BIOMA IAVH', 'F.C', 'NAT', 'SEC', 'TRANS', 'AFECT', 'TOTAL']}
                rows={tableRows}
                footers={[totales.name, totales.fc, totales.natural_afectada,
                  totales.secundaria_afectada, totales.transformada_afectada,
                  `${totales.porcentaje_affectada}%`, totales.total_compensar,]}
              />
            </TabContainer>
          }
          {value === 1 &&
            <TabContainer>
              <div className="total">
                <h3>Total a compensar</h3>
                <h4>{totales.total_compensar}</h4>
              </div>
              <div className="total carrito">
                <h3>Áreas seleccionadas</h3>
                <h4 className={(this.state.selectedArea >= totales.total_compensar) ? "areaCompleted" : ""}>
                  {this.state.selectedArea}
                </h4>
              </div>
              {this.mostrarGraficos(1, this.state.datosDonde, '% Area afectada', 'Factor de Compensación', 'Dots', ['#51b4c1','#eabc47','#ea495f'])}
              {this.showSelector(this.cleanDatosSogamoso(this.props.datosSogamoso), this.state.totalACompensar)}
              <br></br>
              <button className="backgraph"
                // onClick={() => this.props.verMenu("Selector")}
              >
                <BackGraph/> Ir al gráfico
              </button>
              { this.props.subArea && this.state.szh && this.state.car && this.state.strategies &&
                <TableStylized
                  description={{
                    Bioma: this.props.subArea,
                    SZH: this.state.szh,
                    Jurisdicción: this.state.car,
                  }}
                  headers={['Estrategia', 'Héctareas', 'Agregar']}
                  rows={this.state.strategies}
                  classTable='special'
                />
              }
            </TabContainer>
          }
        </div>
      );
    }
  }

  Drawer.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(Drawer);
