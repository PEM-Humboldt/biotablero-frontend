/** eslint verified */
// FEATURE: Create the shopping cart list, saving header as guide element,
// saving values typed for each row by biome
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import QueIcon from '@material-ui/icons/LiveHelp';
import DondeIcon from '@material-ui/icons/Beenhere';
import BackIcon from '@material-ui/icons/FirstPage';
import { ParentSize } from '@vx/responsive';
import BackGraph from '@material-ui/icons/Timeline';

import ElasticAPI from '../api/elastic';
import GraphLoader from '../GraphLoader';
import PopMenu from './PopMenu';
import TabContainer from '../TabContainer';
import TableStylized from '../TableStylized';
import SelectedBiome from './SelectedBiome';

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
    const biomes = data.hits.hits.map(({ _source: fields }) => {
      const {
        BIOMA_IAVH, PORCENT_AFECTACION, FC, NATURAL, TOTAL_COMPENSAR,
        SECUNDARIA, TRANSFORMADO,
      } = fields;
      return {
        name: BIOMA_IAVH,
        affected_percentage: (100 * PORCENT_AFECTACION).toFixed(2),
        fc: FC,
        affected_natural: Math.ceil(NATURAL) ? Number(NATURAL).toFixed(2) : '',
        total_compensate: Math.ceil(TOTAL_COMPENSAR) ? Number(TOTAL_COMPENSAR).toFixed(2) : '',
        affected_secondary: Math.ceil(SECUNDARIA) ? Number(SECUNDARIA).toFixed(2) : '',
        affected_transformed: Math.ceil(TRANSFORMADO) ? Number(TRANSFORMADO).toFixed(2) : '',
      };
    });
    const totals = data.hits.hits.reduce(
      (acc, { _source: fields }) => ({
        affected_natural: acc.affected_natural + Number(fields.NATURAL),
        affected_secondary: acc.affected_secondary + Number(fields.SECUNDARIA),
        affected_transformed: acc.affected_transformed + Number(fields.TRANSFORMADO),
        affected_percentage: acc.affected_percentage + Number(fields.PORCENT_AFECTACION),
        total_compensate: acc.total_compensate + Number(fields.TOTAL_COMPENSAR),
      }),
      {
        affected_natural: 0,
        affected_secondary: 0,
        affected_transformed: 0,
        affected_percentage: 0,
        total_compensate: 0,
      },
    );
    return {
      biomes,
      totals: {
        name: 'TOTALES (CUANTO)',
        affected_natural: totals.affected_natural.toFixed(2),
        affected_secondary: totals.affected_secondary.toFixed(2),
        affected_transformed: totals.affected_transformed.toFixed(2),
        affected_percentage: totals.affected_percentage.toFixed(2),
        total_compensate: totals.total_compensate.toFixed(2),
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      biomesSelected: [],
      whereData: [],
      totals: {},
      szh: null,
      car: null,
      strategiesData: [],
      selectedArea: 0,
      tableError: '',
      showGraphs: { DotsWhere: true },
      // classTable: 'special',
      // dataSelected: null,
    };
  }

  componentDidMount() {
    ElasticAPI.requestQueYCuantoCompensar('SOGAMOSO')
      .then((res) => {
        const { biomes, totals } = Drawer.cleanWhatWhereData(res);
        this.setState({
          whereData: biomes,
          totals,
        });
      });
    // TODO: When the promise is rejected, we need to show a "Data not available" error
    // (in the table). But the application won't break as it currently is
  }

  newBiome = (layerName, szh, car, strategiesData) => {
    console.log('strategies', strategiesData);
    return (
      <SelectedBiome
        biome={layerName}
        szh={szh}
        car={car}
        strategySuggested="Rehabilitación en áreas SINAP"
        // TODO: Set strategySuggested inside TableStylized from biome data
        data={strategiesData}
        operateArea={this.operateArea}
      />
    );
  }

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} value amount to operate in the selectedArea
   * @param {number} operator indicates the operation to realize with the value
   */
  operateArea = (value, operator) => {
    this.setState((prevState) => {
      let { selectedArea } = prevState;
      switch (operator) {
        case '+':
          selectedArea += value;
          break;
        case '-':
          selectedArea -= value;
          break;
        default:
          break;
      }
      return { selectedArea, tableError: '' };
    });
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
   * From data loaded in 'biomeData' construct an array with strategies info for the given szh
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
        showGraphs: {
          ...prevState.showGraphs,
          DotsWhere: true,
        },
      }));
      return;
    }

    const { biomeData } = this.props;
    console.log('biomeData', biomeData);
    const data = this.cleanBiomeFilterList(biomeData);
    if (data) {
      this.setState(prevState => ({
        szh,
        car,
        strategiesData: data[szh][car].results.hits.hits,
        showGraphs: {
          ...prevState.showGraphs,
          DotsWhere: false,
        },
      }));
    }
  }

  cleanBiomeFilterList = (data) => {
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
    const { layerName } = this.props;
    const { color } = this.state;
    if (total !== 0) {
      return (
        <ParentSize className="nocolor">
          {parent => (
            parent.width && parent.height && (
              <PopMenu
                layerName={layerName}
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
  renderGraphs = (data, layerName, labelX, labelY, graph, colors) => {
    const { showGraphs: { DotsWhere } } = this.state;
    const { updateActiveBiome } = this.props;
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
                layerName={layerName}
                labelX={labelX}
                labelY={labelY}
                elementOnClick={(name) => {
                  this.setState({ szh: null, car: null, strategies: [] });
                  return updateActiveBiome(name);
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
    const {
      areaName, back, basinName, colors, classes, layerName, biomeData,
      subAreaName,
    } = this.props;
    const {
      whereData, totals, selectedArea, totalACompensar, szh, car, tableError,
      showGraphs: { DotsWhere }, biomesSelected,
    } = this.state;

    const tableRows = whereData.map((biome, i) => ({
      key: `que-${i}`,
      values: [
        biome.name,
        biome.fc,
        biome.affected_natural,
        biome.affected_secondary,
        biome.affected_transformed,
        `${biome.affected_percentage}%`,
        biome.total_compensate,
      ],
    }));

    return (
      <div className="informer">
        <button type="button" className="geobtn" onClick={() => back()}>
          <BackIcon />
        </button>
        <h1>
          {`${areaName} / ${subAreaName}`}
          <br />
          <b>
            {basinName}
          </b>
        </h1>
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
                {this.renderGraphs(whereData, layerName, '% Area afectada', 'Factor de Compensación', 'Dots', colors)}
                {this.renderSelector(this.cleanBiomeFilterList(biomeData), totalACompensar)}
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
                { layerName && szh && car && biomeData && (
                  this.newBiome(layerName, szh, car, biomeData)
                )}
                {/* { biomesSelected && (
                  this.showBiomes(biomesSelected) // TODO: Create showBiomes(biomesSelected)
                )} */}
              </div>
            ),
          ]}
        </TabContainer>
      </div>
    );
  }
}

Drawer.propTypes = {
  areaName: PropTypes.string,
  back: PropTypes.func,
  basinName: PropTypes.string,
  colors: PropTypes.array,
  classes: PropTypes.object.isRequired,
  layerName: PropTypes.string,
  // Data from elastic result for "donde compensar sogamoso"
  biomeData: PropTypes.object,
  subAreaName: PropTypes.string,
  // Function to handle onClick event on the graph
  updateActiveBiome: PropTypes.func,
};

Drawer.defaultProps = {
  areaName: '',
  back: () => {},
  basinName: '',
  colors: ['#eabc47'],
  biomeData: {},
  updateActiveBiome: () => {},
  layerName: '',
  subAreaName: '',
};

export default withStyles(styles)(Drawer);
