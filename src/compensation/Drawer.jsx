/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import QueIcon from '@material-ui/icons/LiveHelp';
import DondeIcon from '@material-ui/icons/Beenhere';
import BackIcon from '@material-ui/icons/FirstPage';
import { ParentSize } from '@vx/responsive';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/FileDownload';

import CustomInputNumber from './CustomInputNumber';
import GraphLoader from '../GraphLoader';
import PopMenu from './PopMenu';
import TabContainer from '../TabContainer';
import TableStylized from '../TableStylized';
import NewBiomeForm from './NewBiomeForm';
import SelectedBiome from './SelectedBiome';
import RestAPI from '../api/REST';
import ConfirmationModal from '../ConfirmationModal';

const styles = () => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});

class Drawer extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.biomesImpacted.length > 0) {
      const { biomes, totals } = Drawer.cleanWhatWhereData(nextProps.biomesImpacted);
      return {
        whereData: biomes,
        totals,
      };
    }
    return null;
  }

  /**
   * Clean up loaded data used for 'Que y Cuanto' and 'Donde'
   *
   * @param {Array} data array of objects with information about compensations
   */
  static cleanWhatWhereData = (data) => {
    const biomes = data.map(element => ({
      id: element.id,
      biome_id: element.biome.id_biome,
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
      // 'Que-Cuanto' control states
      whereData: [],
      totals: {
        name: 'TOTALES (CUANTO)',
        affected_natural: 0,
        affected_secondary: 0,
        affected_transformed: 0,
        affected_percentage: 0,
        total_compensate: 0,
      },
      allBiomes: [],
      controlAddingBiomes: false,
      biomesDraft: [],
      addBiomesToProjectModal: false,
      // 'Donde-Como' control states
      selectedArea: 0,
      tableError: '',
      graphStatus: { DotsWhere: true },
      selectedStrategyFields: {},
      allStrategies: [],
      selectedStrategies: [],
    };
  }

  componentDidMount() {
    const { biomesImpacted } = this.props;
    if (biomesImpacted.length <= 0) {
      RestAPI.getAllBiomes()
        .then(biomes => (
          this.setState({
            controlAddingBiomes: true,
            allBiomes: biomes,
          })
        ));
    }
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

  // TODO: Create function saveStrategies(idBiome, idEA, idSZH, idStrategy, areaSelected)

  /**
   * Switch between on / off the DotsGraph
   * @param {Boolean} value graph state: true = on / false = off
   *
   */
  downloadPlan = () => {
    // TODO: Implement plan download, with tolerance =0
  }

  /** ******************************************* */
  /** RELATED WITH PROJECT CREATION AND FIRST TAB */
  /** ******************************************* */

  /**
   * Add a biome to the project
   */
  addBiomeToProject = (biome) => {
    this.setState((prevState) => {
      const newBiomes = prevState.biomesDraft;
      newBiomes.push({
        ...biome,
        natural_area_ha: 0,
        secondary_area_ha: 0,
        transformed_area_ha: 0,
        area_impacted_pct: 0,
        area_impacted_ha: 0,
        area_to_compensate_ha: 0,
      });
      return {
        biomesDraft: newBiomes,
        allBiomes: prevState.allBiomes.filter(element => element.id_biome !== biome.id_biome),
      };
    });
  }

  /**
   * Update a biome property value for a biome in biomesDraft
   */
  updateDraftBiome = (target, object) => {
    const input = target;
    const { name: field } = input;
    const value = Number(input.value) || 0;
    input.value = value;

    this.setState((prevState) => {
      let totalImpacted = 0;
      let totalNatural = 0;
      let totalSecondary = 0;
      let totalTransformed = 0;
      let totalPercentage = 0;
      let totalCompensate = 0;

      const { biomesDraft: drafts } = prevState;
      drafts.forEach((element) => {
        const biome = element;
        if (biome.id_biome === object.id_biome) {
          biome[field] = value;
          const {
            natural_area_ha: natural,
            secondary_area_ha: secondary,
            transformed_area_ha: transformed,
            compensation_factor: fc,
          } = biome;
          biome.area_impacted_ha = natural + secondary + transformed;
          biome.area_to_compensate_ha = (fc * natural) + ((fc / 2) * secondary) + transformed;
        }
        totalImpacted += biome.area_impacted_ha;
      });
      drafts.forEach((element) => {
        const biome = element;
        biome.area_impacted_pct = ((biome.area_impacted_ha / totalImpacted) * 100 || 0).toFixed(2);
        totalNatural += biome.natural_area_ha;
        totalSecondary += biome.secondary_area_ha;
        totalTransformed += biome.transformed_area_ha;
        totalPercentage += Number(biome.area_impacted_pct);
        totalCompensate += biome.area_to_compensate_ha;
      });

      return {
        biomesDraft: drafts,
        totals: {
          name: 'TOTALES (CUANTO)',
          affected_natural: totalNatural,
          affected_secondary: totalSecondary,
          affected_transformed: totalTransformed,
          affected_percentage: totalPercentage.toFixed(2),
          total_compensate: totalCompensate,
        },
      };
    });
  }

  /**
   * Send biomesDraft to persist in the backend
   */
  sendAddBiomesToProject = () => {
    const { companyId, projectId, reloadProject } = this.props;
    const { biomesDraft } = this.state;
    RestAPI.addImpactedBiomesToProject(companyId, projectId, biomesDraft)
      .then(() => {
        this.setState({
          biomesDraft: [],
          addBiomesToProjectModal: false,
          controlAddingBiomes: false,
        });
        reloadProject(projectId);
      });
  }

  /**
   * Depending on the type of project (new or saved) prepare the table rows as inputs or just text
   */
  prepareBiomesTableRows = () => {
    const { whereData, biomesDraft } = this.state;
    let tableRows = [];
    if (whereData.length > 0) {
      tableRows = whereData.map((biome, i) => ({
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
    } else {
      tableRows = biomesDraft.map((biome, i) => ({
        key: `que-${i}`,
        values: [
          biome.name,
          biome.compensation_factor,
          (<input
            name="natural_area_ha"
            type="text"
            placeholder="0"
            defaultValue={biome.natural_area_ha}
            onBlur={(event) => { this.updateDraftBiome(event.target, biome); }}
          />),
          (<input
            name="secondary_area_ha"
            type="text"
            placeholder="0"
            defaultValue={biome.secondary_area_ha}
            onBlur={(event) => { this.updateDraftBiome(event.target, biome); }}
          />),
          (<input
            name="transformed_area_ha"
            type="text"
            placeholder="0"
            defaultValue={biome.transformed_area_ha}
            onBlur={(event) => { this.updateDraftBiome(event.target, biome); }}
          />),
          `${biome.area_impacted_pct}%`,
          biome.area_to_compensate_ha,
        ],
      }));
    }

    return tableRows;
  }

  /** ****************************************** */
  /** HANDLERS TO DISPLAY ELEMENTS ON SECOND TAB */
  /** ****************************************** */

  /**
   * Show or hide the DotsGraph
   * @param {Boolean} value graph state: true = show / false = hide
   *
   */
  showDotsGraph = (value) => {
    this.setState({
      graphStatus: {
        DotsWhere: value,
      },
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
   * Request the available strategies for the given parameters
   *
   * @param {Number} idBiome biome id
   * @param {Number} idSubzone sub-basin id
   * @param {String} idEA environmental authority id
   */
  loadStrategies = ({
    biome: { name: biomeName, id: idBiome },
    subBasin: { name: subBasinName, id: idSubzone },
    ea: { name: eaName, id: idEA },
  }) => {
    RestAPI.requestAvailableStrategies(idBiome, idSubzone, idEA)
      .then(({ strategies, geometry }) => (
        this.setState({
          selectedStrategyFields: {
            biome: { name: biomeName, id: idBiome },
            subBasin: { name: subBasinName, id: idSubzone },
            ea: { name: eaName, id: idEA },
          },
          allStrategies: strategies,
        })
      ));
  }

  /** ********** */
  /** STRATEGIES */
  /** ********** */

  /**
   * Display strategies options for the selected parameters in selectedStrategyFields state
   */
  renderAvailableStrategies = () => {
    const {
      selectedStrategyFields: { biome, subBasin, ea },
      allStrategies,
      tableError,
      selectedArea,
    } = this.state;
    const tableRows = allStrategies.map(strategy => ({
      key: `${strategy.id}-${biome.id}-${subBasin.id}-${ea.id}`,
      values: [
        strategy.strategy_name,
        strategy.area_ha.toFixed(2),
        (<CustomInputNumber
          name={strategy.id}
          maxValue={Number(strategy.area_ha.toFixed(2))}
          operateArea={this.operateArea}
          reportError={this.reportTableError}
        />),
      ],
    }));
    return biome && subBasin && ea && (
      <div className="complist">
        <div
          className="titecositema"
          role="presentation"
        >
          <div className="titeco2">
            <div>
              <b className="addedBioma">{biome.name}</b>
              <br />
              <b>SZH:</b>
              {subBasin.name}
              <br />
              <b>Jurisdicción:</b>
              {ea.name}
            </div>
            <div>
              <button
                className="icongraph rotate-false"
                type="button"
                data-tooltip
              >
                <ExpandMoreIcon />
              </button>
            </div>
          </div>
        </div>
        {tableError && (
          <div className="tableError">
            {tableError}
          </div>
        )}
        <TableStylized
          headers={['Estrategia', 'Héctareas', 'Agregar']}
          rows={tableRows}
          classTable="special"
        />
        {selectedArea > 0 && (
          <button
            className="saveStrategyButton"
            type="button"
          >
            <SaveIcon className="iconsave" />
            Guardar Estrategias de compensación
          </button>
        )}
      </div>
    );
  }

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} value amount to operate in the selectedArea
   * @param {number} operator indicates the operation to realize with the value
   */
  operateArea = (value, operator, name) => {
    this.setState((prevState) => {
      const state = { ...prevState };
      switch (operator) {
        case '+':
          state.selectedArea += value;
          state.selectedStrategies.push({ id: name, value });
          break;
        case '-':
          state.selectedArea -= value;
          state.selectedStrategies = state.selectedStrategies.filter(s => s.id !== name);
          break;
        default:
          break;
      }
      state.tableError = '';
      return state;
    });
  }

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
   * Function to render szh-ea selector when there is a selected biome
   */
  renderSelector = () => {
    const { selectedArea, graphStatus: { DotsWhere } } = this.state;
    const { currentBiome, impactedBiomesDecisionTree } = this.props;

    const data = currentBiome !== null
      ? { [currentBiome]: impactedBiomesDecisionTree[currentBiome] } : {};
    return (
      <ParentSize className="nocolor">
        {parent => (
          parent.width && parent.height && (
            <PopMenu
              total={selectedArea}
              visibleGraph={DotsWhere}
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

  /**
   * Function to render graphs when necessary
   */
  renderGraphs = (data, layerName, labelX, labelY, graph, colors) => {
    const { updateCurrentBiome } = this.props;
    const { graphStatus: { DotsWhere } } = this.state;
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
                  updateCurrentBiome(name);
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
      areaName, back, basinName, colors, classes, subAreaName, biomesImpacted,
    } = this.props;
    const {
      whereData, totals, selectedArea, tableError, addBiomesToProjectModal, currentBiome,
      selectedBiomes, controlAddingBiomes, allBiomes,
    } = this.state;

    const tableRows = this.prepareBiomesTableRows();

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
            { label: 'Dónde · Cómo', icon: (<DondeIcon />), disabled: controlAddingBiomes },
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
                  <NewBiomeForm
                    biomes={allBiomes}
                    addBiomeHandler={this.addBiomeToProject}
                  />
                )}
                <TableStylized
                  headers={['BIOMA IAVH', 'F.C', 'NAT (Ha)', 'SEC (Ha)', 'TRANS (Ha)', 'AFECT (%)', 'TOTAL (Ha)']}
                  rows={tableRows}
                  footers={[totals.name, totals.fc, totals.affected_natural,
                    totals.affected_secondary, totals.affected_transformed,
                    `${totals.affected_percentage}%`, totals.total_compensate]}
                  addRows={biomesImpacted}
                />
                {controlAddingBiomes && tableRows.length > 0 && (
                  <button
                    type="button"
                    className="sendCreateBioemes"
                    onClick={() => { this.setState({ addBiomesToProjectModal: true }); }}
                    data-tooltip
                    title="Guardar biomas en proyecto"
                  >
                    Guardar biomas
                  </button>
                )}
                <ConfirmationModal
                  open={addBiomesToProjectModal}
                  onClose={() => { this.setState({ addBiomesToProjectModal: false }); }}
                  message="Una vez guardados los cambios no podrá editarlos, está seguro de continuar?"
                  onContinue={this.sendAddBiomesToProject}
                  onCancel={() => { this.setState({ addBiomesToProjectModal: false }); }}
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
                {this.renderGraphs(whereData, currentBiome, '% Area afectada', 'Factor de Compensación', 'Dots', colors)}
                {this.renderSelector()}
                {tableError && (
                  <div className="tableError">
                    {tableError}
                  </div>
                )}
                {this.renderAvailableStrategies()}
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
  currentBiome: PropTypes.string,
  biomesImpacted: PropTypes.array,
  subAreaName: PropTypes.string,
  // Function to handle onClick event on the graph
  updateCurrentBiome: PropTypes.func,
  companyId: PropTypes.number.isRequired,
  projectId: PropTypes.number.isRequired,
  reloadProject: PropTypes.func.isRequired,
  impactedBiomesDecisionTree: PropTypes.object,
};

Drawer.defaultProps = {
  areaName: '',
  back: () => {},
  basinName: '',
  colors: ['#eabc47'],
  currentBiome: '',
  biomesImpacted: [],
  updateCurrentBiome: () => {},
  subAreaName: '',
  impactedBiomesDecisionTree: {},
};

export default withStyles(styles)(Drawer);
