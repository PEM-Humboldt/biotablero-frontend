/** eslint verified */
// FEATURE: Create the shopping cart list, saving header as guide element,
// saving values typed for each row by bioma
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
  static cleanWhatWhereData = (data) => {
    const biomas = data.hits.hits.map(({ fields }) => {
      const {
        BIOMA_IAVH, PORCENT_AFECTACION, FACT_COMP, NATURAL_AFECTADA, TOTAL_COMPENSAR,
        SECUNDARIA_AFECTADA, TRANSFORMADA_AFECTADA,
      } = fields;
      return {
        name: BIOMA_IAVH[0],
        affected_percentage: (100 * PORCENT_AFECTACION[0]).toFixed(2),
        fc: FACT_COMP[0],
        affected_natural: Math.ceil(NATURAL_AFECTADA[0]) ? NATURAL_AFECTADA[0].toFixed(2) : '',
        total_compensate: Math.ceil(TOTAL_COMPENSAR[0]) ? TOTAL_COMPENSAR[0].toFixed(2) : '',
        affected_secondary: Math.ceil(SECUNDARIA_AFECTADA[0]) ? SECUNDARIA_AFECTADA[0].toFixed(2) : '',
        affected_transformed: Math.ceil(TRANSFORMADA_AFECTADA[0]) ? TRANSFORMADA_AFECTADA[0].toFixed(2) : '',
      };
    });
    const totals = data.hits.hits.reduce(
      (acc, bioma) => ({
        affected_natural: acc.affected_natural + bioma.fields.NATURAL_AFECTADA[0],
        affected_secondary: acc.affected_secondary + bioma.fields.SECUNDARIA_AFECTADA[0],
        affected_transformed: acc.affected_transformed + bioma.fields.TRANSFORMADA_AFECTADA[0],
        affected_percentage: acc.affected_percentage + bioma.fields.PORCENT_AFECTACION[0],
      }),
      {
        affected_natural: 0,
        affected_secondary: 0,
        affected_transformed: 0,
        affected_percentage: 0,
      },
    );
    return {
      biomas,
      totals: {
        name: 'TOTALES (CUANTO)',
        affected_natural: totals.affected_natural.toFixed(2),
        affected_secondary: totals.affected_secondary.toFixed(2),
        affected_transformed: totals.affected_transformed.toFixed(2),
        total_compensate: data.aggregations.total_area.value.toFixed(2),
        affected_percentage: totals.affected_percentage * 100,
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      whereData: [],
      totals: {},
      szh: null,
      car: null,
      strategies: [],
      selectedArea: 0,
      tableError: '',
      showGraphs: { DotsWhere: true },
    };
    this.referencesStrategies = [];
  }

  componentDidMount() {
    ElasticAPI.requestQueYCuantoCompensar()
      .then((res) => {
        const { biomas, totals } = Drawer.cleanWhatWhereData(res);
        this.setState({
          whereData: biomas,
          totals,
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
   * From data loaded in 'projectData' construct an array with strategies info for the given szh
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
          DotsWhere: true,
        },
      }));
      return;
    }

    const { projectData } = this.props;
    const data = this.cleanSogamosoData(projectData);
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
        DotsWhere: false,
      },
    }));
  }

  cleanSogamosoData = (data) => {
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
    const { showGraphs: { DotsWhere } } = this.state;
    const { updateActiveBioma } = this.props;
    if (graph === 'Dots' && DotsWhere) {
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
    const { classes, projectData, subArea } = this.props;
    const {
      whereData, totals, selectedArea, totalACompensar, szh, car, strategies, tableError,
      showGraphs: { DotsWhere },
    } = this.state;

    const tableRows = whereData.map((bioma, i) => ({
      key: `que-${i}`,
      values: [
        bioma.name,
        bioma.fc,
        bioma.affected_natural,
        bioma.affected_secondary,
        bioma.affected_transformed,
        `${bioma.affected_percentage}%`,
        bioma.total_compensate,
      ],
    }));

    return (
      <TabContainer
        classes={classes}
        tabClasses="tabs2"
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
                  {totals.total_compensate}
                </h4>
              </div>
              <TableStylized
                headers={['BIOMA IAVH', 'F.C', 'NAT', 'SEC', 'TRANS', 'AFECT', 'TOTAL']}
                rows={tableRows}
                footers={[totals.name, totals.fc, totals.affected_natural,
                  totals.affected_secondary, totals.affected_transformed,
                  `${totals.affected_percentage}%`, totals.total_compensate]}
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
                  {totals.total_compensate}
                </h4>
              </div>
              <div className="total carrito">
                <h3>
                  Áreas seleccionadas
                </h3>
                <h4 className={(selectedArea >= totals.total_compensate) ? 'areaCompleted' : ''}>
                  {selectedArea}
                </h4>
              </div>
              {this.renderGraphs(whereData, '% Area afectada', 'Factor de Compensación', 'Dots', ['#51b4c1', '#eabc47', '#ea495f'])}
              {this.renderSelector(this.cleanSogamosoData(projectData), totalACompensar)}
              { !DotsWhere && (
                <button
                  className="backgraph"
                  type="button"
                  onClick={() => this.setState(prevState => (
                    {
                      showGraphs: {
                        ...prevState.showGraphs,
                        DotsWhere: true,
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
  projectData: PropTypes.object,
  // Function to handle onClick event on the graph
  updateActiveBioma: PropTypes.func,
  subArea: PropTypes.string,

};

Drawer.defaultProps = {
  projectData: {},
  updateActiveBioma: () => {},
  subArea: '',
};

export default withStyles(styles)(Drawer);
