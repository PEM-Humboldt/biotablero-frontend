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
// var dataCompensaciones = require('./data/dondeCompensar.json');
var dataCompensaciones = require('./data/que_y_donde_compensar.json');
var dataSogamoso = require('./data/donde_compensar_sogamoso.json');

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
    backgroundColor: theme.palette.background.paper,
  },
});

class Drawer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0,
      datosDonde: [],
      totalACompensar: '5000000000', // TODO: Dato de prueba, agregar desde el JSON
      jurisdiccion: null,
      szh: null,
      biomaColor: "white",
    };
  }

  biomaColor(biomaColor) {
console.log("biomaColor: "+biomaColor);
    this.setState({
      color: biomaColor,
    });
  }

  obtenerDatosDonde = (data) => {
    const transformedData = [];
    data.hits.hits.forEach(item => {
      transformedData.push(
        {
          name:`${item.fields.BIOMA_IAVH}`,
          percentageAffect: `${item.fields.PORCENT_AFECTACION}`,
          fc: `${item.fields.FACT_COMP}`,
          natural_afectada: `${item.fields.NATURAL_AFECTADA}`,
          total_afectada: `${item.fields.TOTAL_AFECTADA}`,
        }
      );
    });
    this.setState ({
      datosDonde: transformedData,
      totalACompensar: data.aggregations.total_area.value,
    });
    return transformedData;
  };

  obtenerDatosQue = (data) => {
    // TODO: Realizar esta función
  };

  actualizarTotalACompensar = (data) => {
    // TODO: Actualizar desde el PopMenu
  }

  obtenerSubzonas = (data) => {
    // TODO: Obtener de dataSogamoso el arreglo correspondiente al biomaActivo
    // const transformedData = [];
    // data.aggregations.car.buckets[0].forEach(item => {
    //   transformedData.push(
    //     {
    //       name:`${item.fields.BIOMA_IAVH}`,
    //       percentageAffect: `${item.fields.PORCENT_AFECTACION}`,
    //       fc: `${item.fields.FACT_COMP}`,
    //       natural_afectada: `${item.fields.NATURAL_AFECTADA}`,
    //       total_afectada: `${item.fields.TOTAL_AFECTADA}`,
    //     }
    //   );
    // });
    // this.setState ({
    //   datosDonde: transformedData,
    //   totalACompensar: data.aggregations.total_area.value,
    // });
    // return transformedData;
  }

  componentWillMount () {
    this.obtenerDatosQue(dataSogamoso);
    this.obtenerDatosDonde(dataCompensaciones);
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
                biomaColor = {this.biomaColor}
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
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            >
              <Tab className="tabs tabs2" label="Qué · Cuánto" icon={<QueIcon />} />
              <Tab className="tabs tabs2" label="Dónde · Cómo" icon={<DondeIcon />} />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer>
            Gráfico ¿Qué y cuánto?
            {/* // tipoG="(Bullet Charts, https://bl.ocks.org/mbostock/4061961)"
            // datosJSON={this.props.datosJSON} */}
          </TabContainer>}
          {value === 1 && <TabContainer>
            <div className="total">
            <h3>Total a compensar</h3>
            <h4>{Number(this.state.totalACompensar).toFixed(2)}</h4>
            </div>
            <div className="total carrito">
            <h3>Áreas seleccionadas</h3>
            <h4>0</h4>
            </div>
            {this.mostrarGraficos(1, this.state.datosDonde, '% Area afectada', 'Factor de Compensación', 'Dots', ['#51b4c1','#eabc47','#ea495f'])}
            {this.showSelector(this.state.datosDonde, this.state.totalACompensar)}
          </TabContainer>}
        </div>
      );
    }
  }

  Drawer.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(Drawer);
