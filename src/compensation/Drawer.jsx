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

import GraphLoader from '../GraphLoader';
import PopMenu from './PopMenu';
import TabContainer from '../TabContainer';
import TableStylized from '../TableStylized';
import NewBiomeForm from './NewBiomeForm';
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
    const biomes = data.map(element => ({
      id: element.id,
      name: element.biome.name,
      affected_percentage: Number(element.area_impacted_pct).toFixed(2),
      fc: element.biome.compensation_factor,
      affected_natural: Math.ceil(element.natural_area_ha) ? Number(element.natural_area_ha).toFixed(2) : '',
      total_compensate: Math.ceil(element.area_to_compensate_ha) ? Number(element.area_to_compensate_ha).toFixed(2) : '',
      affected_secondary: Math.ceil(element.secondary_area_ha) ? Number(element.secondary_area_ha).toFixed(2) : '',
      affected_transformed: Math.ceil(element.transformed_area_ha) ? Number(element.transformed_area_ha).toFixed(2) : '',
    }));
    const totals = biomes.reduce(
      (acc, element) => ({
        affected_natural: acc.affected_natural + Number(element.affected_natural),
        affected_secondary: acc.affected_secondary + Number(element.affected_secondary),
        affected_transformed: acc.affected_transformed + Number(element.affected_transformed),
        affected_percentage: acc.affected_percentage + Number(element.affected_percentage),
        total_compensate: acc.total_compensate + Number(element.total_compensate),
      }),
      { // Initial values
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
      selectedBiomes: [],
      whereData: [],
      totals: {},
      szh: null,
      ea: null,
      strategiesData: [],
      selectedArea: 0,
      tableError: '',
      graphStatus: { DotsWhere: true },
      allAvailableBiomes: null,
      controlAddingBiomes: false,
    };
  }

  componentDidMount() {
    const { biomesImpacted, allBiomes } = this.props;
    if (biomesImpacted.length === 0) {
      console.log('allAvailableBiomes', allBiomes, biomesImpacted.length, biomesImpacted);
      this.setState({
        controlAddingBiomes: true,
      });
    }
    const { biomes, totals } = Drawer.cleanWhatWhereData(biomesImpacted);
    this.setState({
      whereData: biomes,
      totals,
    });
  }

  /**
   * Delete an indicated biome from selectedBiomes
   *
   * @param {String} biome current bioma selected
   * @param {String} szh hydrographical sub zone selected
   * @param {String} ea enviromental autority selected
   */
  deleteSelectedBiome = (biome, ea, szh) => {
    const { selectedBiomes } = this.state;
    this.cleanBiomeFilterList();
    this.setState(prevState => (
      {
        layerName: null,
        szh: null,
        ea: null,
        selectedBiomes: [
          ...prevState.selectedBiomes.filter(
            element => (element.biome !== biome
            && element.ea !== ea && element.szh !== szh),
          ),
        ],
      }
    ));
    // TODO: Fix deleting algorithm to validate biome to delete
    console.log('selectedBiomes', selectedBiomes.length, selectedBiomes.length < 1);
    return (selectedBiomes.length < 1) ? true : this.showDotsGraph(true);
  }

  /**
   * Add an indicated biome to selectedBiomes and update state
   *
   * @param {String} biome current bioma selected
   * @param {String} szh hydrographical sub zone selected
   * @param {String} ea enviromental autority selected
   */
  addSelectedBiome = (layerName, ea, szh, strategiesData) => {
    const loadBiome = {};
    loadBiome.biome = layerName;
    loadBiome.ea = ea;
    loadBiome.szh = szh;
    loadBiome.strategies = strategiesData;
    // TODO: Load valuesSelected from current sesion (memory) or from database
    // loadBiome.valuesSelected = valuesSelected;
    this.setState(prevState => (
      {
        selectedBiomes: [
        // TODO: Just open loadBiome and hide other biome tables
          loadBiome,
          ...prevState.selectedBiomes,
        ],
      }
    ));
    this.showDotsGraph(false);
  }

  /**
   * Create a new Biome to operate in the interface and show selected biomes
   *
   * @param {String} layerName current bioma name showed and selected
   * @param {String} szh hydrographical sub zone selected
   * @param {String} ea enviromental autority selected
   * @param {Array} strategiesData strategies data to list
   */
  renderBiomes = (layerName, szh, ea, strategiesData) => {
    const { selectedBiomes } = this.state;
    if (layerName && szh && ea && strategiesData) {
      const tempBiome = selectedBiomes.filter(
        element => (element.biome === layerName
          && element.ea === ea && element.szh === szh),
      );
      if (tempBiome.length === 0) {
        this.addSelectedBiome(layerName, ea, szh, strategiesData);
      }
    } return true;
  }

  // TODO: Create function saveStrategies(idBiome, idEA, idSZH, idStrategy, areaSelected)

  /**
   * Hold and show Biomes previously added to the plan
   *
   * @param {Array} selectedBiomes biomes selected for this compensation plan
   */
  showBiomes = selectedBiomes => Object.values(selectedBiomes).map((element, i) => (
    <ParentSize key={i} className="nocolor">
      {parent => (
        parent.width && parent.height && (
          <SelectedBiome
            biome={element.biome}
            szh={element.szh}
            ea={element.ea}
            data={element.strategies}
            operateSelectedAreas={this.operateSelectedAreas}
            deleteSelectedBiome={this.deleteSelectedBiome}
            saveStrategies={this.saveStrategies}
          />))}
    </ParentSize>
  ))

  /**
   * Switch between on / off the DotsGraph
   * @param {Boolean} value graph state: true = on / false = off
   *
   */
  showDotsGraph = (value) => {
    this.setState(prevState => (
      {
        ...prevState,
        ea: null,
        szh: null,
        graphStatus: {
          DotsWhere: value,
        },
      }
    ));
  }

  /**
   * Switch between on / off the DotsGraph
   * @param {Boolean} value graph state: true = on / false = off
   *
   */
  downloadPlan = () => {
    // TODO: Implement plan download, with tolerance =0
  }

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} value amount to operate in the selectedArea
   * @param {number} operator indicates the operation to realize with the value
   */
  operateSelectedAreas = (value, operator) => {
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
   * From data loaded in 'biomeData' construct an array with
   * strategies info for the given szh and ea
   *
   * @param {String} szh SZH name
   * @param {String} ea CAR name
   */
  loadStrategies = (szh, ea) => {
    if (!szh || !ea) {
      this.setState(prevState => ({
        szh,
        ea,
        graphStatus: {
          ...prevState.graphStatus,
          DotsWhere: true,
        },
      }));
      return;
    }

    const { biomeData } = this.props;
    const data = this.cleanBiomeFilterList(biomeData);
    if (data) {
      this.setState(prevState => ({
        szh,
        ea,
        strategiesData: data[szh][ea].results.hits.hits,
        graphStatus: {
          ...prevState.graphStatus,
          DotsWhere: false,
        },
      }));
    }
  }

  cleanBiomeFilterList = (data) => {
    if (!data || !data.aggregations) return {};
    const cleanData = {};
    data.aggregations.szh.buckets.forEach((szh) => {
      const cleanEA = {};
      // TODO: Replace name "car" for "ea", when it changes to RestAPI instead of ElasticAPI
      szh.car.buckets.forEach((ea) => {
        cleanEA[ea.key] = ea;
      });
      cleanData[szh.key] = cleanEA;
    });
    return cleanData;
  }

  /**
   * Function to render graphs when necessary
   */
  renderSelector = (data, total) => {
    const { layerName } = this.props;
    const {
      color, selectedArea, graphStatus: { DotsWhere },
    } = this.state;
    if (total !== 0) {
      return (
        <ParentSize className="nocolor">
          {parent => (
            parent.width && parent.height && (
              <PopMenu
                controlValues={[layerName, selectedArea, DotsWhere]}
                color={color}
                loadStrategies={this.loadStrategies}
                showDotsGraph={this.showDotsGraph}
                downloadPlan={this.downloadPlan}
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
    const { graphStatus: { DotsWhere } } = this.state;
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
                  this.setState({ szh: null, ea: null, strategiesData: [] });
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
      subAreaName, biomesImpacted, // allBiomes,
    } = this.props;
    const {
      whereData, totals, selectedArea, totalACompensar, szh, ea, tableError,
      strategiesData, selectedBiomes, allAvailableBiomes, controlAddingBiomes,
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
            { label: 'Dónde · Cómo', icon: (<DondeIcon />), disabled: `${controlAddingBiomes}` },
          ]}
        >
          {[
            (
              <div key="1">
                <div className="total">
                  <h3>
                    TOTAL A COMPENSAR
                  </h3>
                  <h4>
                    {totals.total_compensate}
                  </h4>
                </div>
                {controlAddingBiomes && (
                  <NewBiomeForm />)
                    // biomes={allBiomes.then(res => res.map(element => element.name))}
                  // />)
                }
                <TableStylized
                  headers={['BIOMA IAVH', 'F.C', 'NAT', 'SEC', 'TRANS', 'AFECT', 'TOTAL']}
                  rows={tableRows}
                  footers={[totals.name, totals.fc, totals.affected_natural,
                    totals.affected_secondary, totals.affected_transformed,
                    `${totals.affected_percentage}%`, totals.total_compensate]}
                  addRows={biomesImpacted}
                  newRow={allAvailableBiomes}
                />
              </div>
            ),
            (
              <div key="2">
                <div className="total">
                  <h3>
                    TOTAL A COMPENSAR
                  </h3>
                  <h4>
                    {totals.total_compensate}
                  </h4>
                </div>
                <div className="total carrito">
                  <h3>
                    HAs SELECCIONADAS
                  </h3>
                  <h4 className={(selectedArea >= totals.total_compensate) ? 'areaCompleted' : ''}>
                    {selectedArea}
                  </h4>
                </div>
                {this.renderGraphs(whereData, layerName, '% Area afectada', 'Factor de Compensación', 'Dots', colors)}
                {this.renderSelector(this.cleanBiomeFilterList(biomeData), totalACompensar)}
                {tableError && (
                  <div className="tableError">
                    {tableError}
                  </div>
                )}
                {this.renderBiomes(layerName, szh, ea, strategiesData)}
                {this.showBiomes(selectedBiomes)}
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
  biomesImpacted: PropTypes.array,
  allBiomes: PropTypes.object,
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
  biomesImpacted: [],
  allBiomes: {},
  updateActiveBiome: () => {},
  layerName: '',
  subAreaName: '',
};

export default withStyles(styles)(Drawer);
