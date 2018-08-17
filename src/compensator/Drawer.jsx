/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import QueIcon from '@material-ui/icons/LiveHelp';
import DondeIcon from '@material-ui/icons/Beenhere';
import { ParentSize } from '@vx/responsive';
import BackGraph from '@material-ui/icons/Timeline';

import ElasticAPI from '../api/elastic';
import GraphLoader from '../GraphLoader';
import InputCompensation from './InputCompensation';
import PopMenu from './PopMenu';
import TabContainer from '../TabContainer';
import TableStylized from '../TableStylized';

const styles = () => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});

class Drawer extends React.Component {
  /**
   * Clean up loaded data used for 'Que y Cuanto' and 'Donde'
   *
   * @param {Array} data array of objects with information about compensations
   */
  static cleanQueCuantoDondeData = (data) => {
    const biomas = data.hits.hits.map(({ fields }) => {
      const {
        BIOMA_IAVH, PORCENT_AFECTACION, FACT_COMP, NATURAL_AFECTADA, TOTAL_COMPENSAR,
        SECUNDARIA_AFECTADA, TRANSFORMADA_AFECTADA,
      } = fields;
      return {
        name: BIOMA_IAVH[0],
        porcentaje_affectada: (100 * PORCENT_AFECTACION[0]).toFixed(2),
        fc: FACT_COMP[0],
        natural_afectada: Math.ceil(NATURAL_AFECTADA[0]) ? NATURAL_AFECTADA[0].toFixed(2) : '',
        total_compensar: Math.ceil(TOTAL_COMPENSAR[0]) ? TOTAL_COMPENSAR[0].toFixed(2) : '',
        secundaria_afectada: Math.ceil(SECUNDARIA_AFECTADA[0]) ? SECUNDARIA_AFECTADA[0].toFixed(2) : '',
        transformada_afectada: Math.ceil(TRANSFORMADA_AFECTADA[0]) ? TRANSFORMADA_AFECTADA[0].toFixed(2) : '',
      };
    });
    const totals = data.hits.hits.reduce(
      (acc, bioma) => ({
        natural_afectada: acc.natural_afectada + bioma.fields.NATURAL_AFECTADA[0],
        secundaria_afectada: acc.secundaria_afectada + bioma.fields.SECUNDARIA_AFECTADA[0],
        transformada_afectada: acc.transformada_afectada + bioma.fields.TRANSFORMADA_AFECTADA[0],
        porcentaje_affectada: acc.porcentaje_affectada + bioma.fields.PORCENT_AFECTACION[0],
      }),
      {
        natural_afectada: 0,
        secundaria_afectada: 0,
        transformada_afectada: 0,
        porcentaje_affectada: 0,
      },
    );
    return {
      biomas,
      totals: {
        name: 'TOTALES (CUANTO)',
        natural_afectada: totals.natural_afectada.toFixed(2),
        secundaria_afectada: totals.secundaria_afectada.toFixed(2),
        transformada_afectada: totals.transformada_afectada.toFixed(2),
        total_compensar: data.aggregations.total_area.value.toFixed(2),
        porcentaje_affectada: totals.porcentaje_affectada * 100,
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      datosDonde: [],
      totales: {},
      szh: null,
      car: null,
      strategies: [],
      selectedArea: 0,
      tableError: '',
      showGraphs: { graphDonde: true },
    };
    this.referencesStrategies = [];
  }

  componentDidMount() {
    ElasticAPI.requestQueYCuantoCompensar()
      .then((res) => {
        const { biomas, totals } = Drawer.cleanQueCuantoDondeData(res);
        this.setState({
          datosDonde: biomas,
          totales: totals,
        });
      });
  }

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} index index for referencesStrategies
   * @param {number} maxValue maximum allowed value
   */
  operateArea = (value, operator) => {
    switch (operator) {
      case '+':
        this.setState(prevState => ({
          selectedArea: value + prevState.selectedArea,
          tableError: '',
        }));
        break;
      case '-':
        this.setState(prevState => ({ selectedArea: prevState.selectedArea - value }));
        break;
      default:
        break;
    }
  }

  /**
   * Set an error message above the compensations table
   *
   * @param {String} message message to set
   */
  reportTableError = (message) => {
    this.setState({ tableError: message });
  }

  /**
   * From data loaded in 'datosSogamoso' construct an array with strategies info for the given szh
   * and car
   *
   * @param {String} szh SZH name
   * @param {String} car CAR name
   */
  loadStrategies = (szh, car) => {
    if (!szh || !car) {
      this.setState(prevState => ({
        szh,
        car,
        strategies: [],
        showGraphs: {
          ...prevState.showGraphs,
          graphDonde: true,
        },
      }));
      return;
    }

    const { datosSogamoso } = this.props;
    const data = this.cleanDatosSogamoso(datosSogamoso);
    const strategies = data[szh][car].results.hits.hits.map(({ _source: obj }) => {
      this.referencesStrategies.push(React.createRef());
      return {
        key: obj.GROUPS,
        values: [
          obj.ESTRATEGIA,
          obj.HA_ES_EJ,
          <InputCompensation
            name={obj.GROUPS}
            maxValue={Number(obj.HA_ES_EJ)}
            operateArea={this.operateArea}
            reportError={this.reportTableError}
          />,
        ],
      };
    });
    this.setState(prevState => ({
      szh,
      car,
      strategies,
      showGraphs: {
        ...prevState.showGraphs,
        graphDonde: false,
      },
    }));
  }

  cleanDatosSogamoso = (data) => {
    if (!data || !data.aggregations) return {};
    const cleanData = {};
    data.aggregations.szh.buckets.forEach((szh) => {
      const cleanCar = {};
      szh.car.buckets.forEach((car) => {
        cleanCar[car.key] = car;
      });
      cleanData[szh.key] = cleanCar;
    });
    return cleanData;
  }

  /**
   * Function to render graphs when necessary
   */
  renderSelector = (data, total) => {
    const { subArea } = this.props;
    const { color } = this.state;
    if (total !== 0) {
      return (
        <ParentSize className="nocolor">
          {parent => (
            parent.width && parent.height && (
              <PopMenu
                subArea={subArea}
                color={color}
                loadStrategies={this.loadStrategies}
                data={data}
              />
            )
          )}
        </ParentSize>
      );
    }
    return null;
  }

  /**
   * Function to render graphs when necessary
   */
  renderGraphs = (data, labelX, labelY, graph, colors) => {
    const { showGraphs: { graphDonde } } = this.state;
    const { updateActiveBioma } = this.props;
    if (graph === 'Dots' && graphDonde) {
      return (
        <ParentSize className="nocolor">
          {parent => (
            parent.width && parent.height && (
              <GraphLoader
                width={parent.width}
                height={parent.height}
                colors={colors}
                graphType={graph}
                data={data}
                labelX={labelX}
                labelY={labelY}
                elementOnClick={(name) => {
                  this.setState({ szh: null, car: null, strategies: [] });
                  return updateActiveBioma(name);
                }}
              />
            )
          )}
        </ParentSize>
      );
    }
    return null;
  }

  render() {
    const { classes, datosSogamoso, subArea } = this.props;
    const {
      datosDonde, totales, selectedArea, totalACompensar, szh, car, strategies, tableError,
      showGraphs: { graphDonde }
    } = this.state;

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
      <TabContainer
        classes={classes}
        titles={[
          { label: 'Qué · Cuánto', icon: (<QueIcon />) },
          { label: 'Dónde · Cómo', icon: (<DondeIcon />) },
        ]}
      >
        {[
          (
            <div key="1">
              <div className="total">
                <h3>
                  Total a compensar
                </h3>
                <h4>
                  {totales.total_compensar}
                </h4>
              </div>
              <TableStylized
                headers={['BIOMA IAVH', 'F.C', 'NAT', 'SEC', 'TRANS', 'AFECT', 'TOTAL']}
                rows={tableRows}
                footers={[totales.name, totales.fc, totales.natural_afectada,
                  totales.secundaria_afectada, totales.transformada_afectada,
                  `${totales.porcentaje_affectada}%`, totales.total_compensar]}
              />
            </div>
          ),
          (
            <div key="2">
              <div className="total">
                <h3>
                  Total a compensar
                </h3>
                <h4>
                  {totales.total_compensar}
                </h4>
              </div>
              <div className="total carrito">
                <h3>
                  Áreas seleccionadas
                </h3>
                <h4 className={(selectedArea >= totales.total_compensar) ? 'areaCompleted' : ''}>
                  {selectedArea}
                </h4>
              </div>
              {this.renderGraphs(datosDonde, '% Area afectada', 'Factor de Compensación', 'Dots', ['#51b4c1', '#eabc47', '#ea495f'])}
              {this.renderSelector(this.cleanDatosSogamoso(datosSogamoso), totalACompensar)}
              <br />
              { !graphDonde && (
                <button
                  className="backgraph"
                  type="button"
                  onClick={() => this.setState(prevState => (
                    {
                      showGraphs: {
                        ...prevState.showGraphs,
                        graphDonde: true,
                      },
                    }
                  ))}
                >
                  <BackGraph />
                  {' Ir al gráfico'}
                </button>
              )}
              {tableError && (
                <div className="tableError">
                  {tableError}
                </div>
              )}
              { subArea && szh && car && strategies && (
                <TableStylized
                  description={{
                    Bioma: subArea,
                    SZH: szh,
                    Jurisdicción: car,
                  }}
                  headers={['Estrategia', 'Héctareas', 'Agregar']}
                  rows={strategies}
                  classTable="special"
                />
              )}
            </div>
          ),
        ]}
      </TabContainer>
    );
  }
}

Drawer.propTypes = {
  classes: PropTypes.object.isRequired,
  // Data from elastic result for "donde compensar sogamoso"
  datosSogamoso: PropTypes.object,
  // Function to handle onClick event on the graph
  updateActiveBioma: PropTypes.func,
  subArea: PropTypes.string,

};

Drawer.defaultProps = {
  datosSogamoso: {},
  updateActiveBioma: () => {},
  subArea: '',
};

export default withStyles(styles)(Drawer);
