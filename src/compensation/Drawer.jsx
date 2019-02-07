/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import QueIcon from '@material-ui/icons/LiveHelp';
import DondeIcon from '@material-ui/icons/Beenhere';
import BackIcon from '@material-ui/icons/FirstPage';
import { ParentSize } from '@vx/responsive';
import SaveIcon from '@material-ui/icons/Save';
import DownloadIcon from '@material-ui/icons/FileDownload';

import CustomInputNumber from './CustomInputNumber';
import GraphLoader from '../charts/GraphLoader';
import PopMenu from './PopMenu';
import TabContainer from '../commons/TabContainer';
import TableStylized from '../commons/TableStylized';
import NewBiomeForm from './NewBiomeForm';
import StrategiesBox from './StrategiesBox';
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
      saveStrategies: false,
      savedStrategies: {},
      savedArea: 0,
    };
  }

  componentDidMount() {
    const { biomesImpacted, companyId, projectId } = this.props;
    if (biomesImpacted.length <= 0) {
      RestAPI.getAllBiomes()
        .then(biomes => (
          this.setState({
            controlAddingBiomes: true,
            allBiomes: biomes,
          })
        ))
        .catch(() => {
          const { reportConnError } = this.props;
          reportConnError();
        });
    }
    RestAPI.getSavedStrategies(companyId, projectId)
      .then((strategies) => {
        this.setState((prevState) => {
          let savedArea = 0;
          const { savedStrategies } = prevState;
          strategies.forEach((strategy) => {
            savedArea += Number(strategy.area);
            const key = `${strategy.id_biome}-${strategy.id_subzone}-${strategy.id_ea}`;
            if (!savedStrategies[key]) {
              savedStrategies[key] = {
                biome: { name: strategy.biome.name, id: strategy.id_biome },
                subBasin: { name: strategy.szh.name_subzone, id: strategy.id_subzone },
                ea: { name: strategy.ea.name, id: strategy.ea.id_ea },
                strategies: [],
                area: 0,
              };
            }
            savedStrategies[key].strategies.push({
              id: strategy.id_strategy,
              name: strategy.strategy.strategy,
              value: strategy.area,
            });
            savedStrategies[key].area += Number(strategy.area);
          });

          return { savedStrategies, savedArea };
        });
      })
      .catch(() => {
        const { reportConnError } = this.props;
        reportConnError();
      });
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
          affected_natural: totalNatural.toFixed(2),
          affected_secondary: totalSecondary.toFixed(2),
          affected_transformed: totalTransformed.toFixed(2),
          affected_percentage: totalPercentage.toFixed(2),
          total_compensate: totalCompensate.toFixed(2),
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
            defaultValue={biome.natural_area_ha.toFixed(2)}
            onFocus={(event) => { this.updateDraftBiome(event.target, biome); }}
            onBlur={(event) => { this.updateDraftBiome(event.target, biome); }}
          />),
          (<input
            name="secondary_area_ha"
            type="text"
            placeholder="0"
            defaultValue={biome.secondary_area_ha.toFixed(2)}
            onFocus={(event) => { this.updateDraftBiome(event.target, biome); }}
            onBlur={(event) => { this.updateDraftBiome(event.target, biome); }}
          />),
          (<input
            name="transformed_area_ha"
            type="text"
            placeholder="0"
            defaultValue={biome.transformed_area_ha.toFixed(2)}
            onFocus={(event) => { this.updateDraftBiome(event.target, biome); }}
            onBlur={(event) => { this.updateDraftBiome(event.target, biome); }}
          />),
          `${biome.area_impacted_pct}%`,
          biome.area_to_compensate_ha.toFixed(2),
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
   * Function to reset values when area changes
   */
  resetAreaSelected = (name) => { // TODO: Change search by biome: name for ID
    const { updateCurrentBiome } = this.props;
    this.setState((prevState) => {
      const removeArea = prevState.selectedStrategies.reduce((acc, item) => (
        acc + item.value
      ), 0);
      return {
        biome: {},
        subBasin: {},
        ea: {},
        selectedStrategyFields: {},
        allStrategies: [],
        selectedArea: prevState.selectedArea - removeArea,
        selectedStrategies: [],
      };
    });
    updateCurrentBiome(name);
  }

  /**
   * Request the available strategies for the given parameters
   *
   * @param {Number} idBiome biome id
   * @param {Number} idSubzone sub-basin id
   * @param {String} idEA environmental authority id
   */
  loadStrategies = (options) => {
    if (!options) {
      const { currentBiome } = this.props;
      this.resetAreaSelected(currentBiome);
      return;
    }
    const {
      biome: { name: biomeName, id: idBiome },
      subBasin: { name: subBasinName, id: idSubzone },
      ea: { name: eaName, id: idEA },
    } = options;
    const { showStrategies } = this.props;
    showStrategies(false);
    RestAPI.requestAvailableStrategies(idBiome, idSubzone, idEA)
      .then(({ strategies, geometry }) => {
        this.setState({
          selectedStrategyFields: {
            biome: { name: biomeName, id: idBiome },
            subBasin: { name: subBasinName, id: idSubzone },
            ea: { name: eaName, id: idEA },
          },
          allStrategies: strategies,
        });
        if (geometry !== null && geometry.features !== null) showStrategies(geometry);
      })
      .catch(() => {
        const { reportConnError } = this.props;
        reportConnError();
      });
  }

  /** ********** */
  /** STRATEGIES */
  /** ********** */

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} value amount to operate in the selectedArea
   * @param {number} operator indicates the operation to realize with the value
   * @param {Number} id strategy id that is being added / removed
   * @param {String} name strategy name
   */
  operateArea = (value, operator, id, name) => {
    this.setState((prevState) => {
      const state = { ...prevState };
      switch (operator) {
        case '+':
          state.selectedArea += Number(value);
          state.selectedStrategies.push({ id, value, name });
          break;
        case '-':
          state.selectedArea -= Number(value);
          state.selectedArea = Math.abs(state.selectedArea);
          state.selectedStrategies = state.selectedStrategies.filter(s => s.id !== id);
          break;
        default:
          break;
      }
      state.tableError = '';
      return state;
    });
  }

  /**
   * Save to backend the selected strategies
   */
  saveStrategies = () => {
    const {
      companyId,
      projectId,
      updateCurrentBiome,
      userId,
    } = this.props;
    const { selectedStrategyFields: { biome, subBasin, ea }, selectedStrategies } = this.state;
    const strategiesToSave = selectedStrategies.map(strategy => ({
      id_biome: biome.id,
      id_ea: ea.id,
      id_subzone: subBasin.id,
      id_strategy: strategy.id,
      area: strategy.value,
      id_user: userId,
    }));
    RestAPI.bulkSaveStrategies(companyId, projectId, strategiesToSave)
      .then(() => {
        this.setState((prevState) => {
          const { savedStrategies } = prevState;
          savedStrategies[`${biome.id}-${subBasin.id}-${ea.id}`] = {
            biome,
            subBasin,
            ea,
            strategies: selectedStrategies.map(strategy => ({
              id: strategy.id,
              name: strategy.name,
              value: strategy.value,
            })),
            area: selectedStrategies.reduce((acc, item) => acc + item.value, 0),
          };
          return {
            saveStrategiesModal: false,
            savedStrategies,
            savedArea: prevState.savedArea + prevState.selectedArea,
            biome: {},
            subBasin: {},
            ea: {},
            selectedStrategyFields: {},
            allStrategies: [],
            selectedStrategies: [],
            selectedArea: 0,
            graphStatus: {
              DotsWhere: true,
            },
          };
        }, () => {
          // Call updateCurrentBiome() explicitly after the state has been updated. If called before
          // setState() a maximum deep exceeded occurs.
          updateCurrentBiome('');
        });
      })
      .catch(() => {
        const { reportConnError } = this.props;
        reportConnError();
      });
  }

  /**
   * get the url to download the strategies saved in the current project
   */
  downloadPlanUrl = () => {
    const { companyId, projectId } = this.props;
    return RestAPI.downloadProjectStrategiesUrl(companyId, projectId);
  }

  renderSavedStrategies = () => {
    const { savedStrategies } = this.state;
    return (
      <div>
        {Object.values(savedStrategies).map(({
          biome, ea, subBasin, area, strategies,
        }) => {
          const tableRows = strategies.map(strategy => ({
            key: `${strategy.id}-${biome.id}-${subBasin.id}-${ea.id}`,
            values: [
              strategy.name,
              strategy.value,
              '-',
            ],
          }));
          return (
            <StrategiesBox
              key={`${biome.id}-${subBasin.id}-${ea.id}`}
              biome={biome.name}
              ea={ea.name}
              subBasin={subBasin.name}
              area={area}
              strategies={tableRows}
              showTable={false}
            />
          );
        })}
      </div>
    );
  }

  /**
   * Display strategies options for the selected parameters in selectedStrategyFields state
   */
  renderAvailableStrategies = () => {
    const {
      selectedStrategyFields: { biome, subBasin, ea },
      allStrategies,
      tableError,
      selectedArea,
      saveStrategiesModal,
      savedStrategies,
    } = this.state;
    const { clickedStrategy, updateClickedStrategy } = this.props;
    let tableRows;
    if (allStrategies) {
      tableRows = allStrategies.map((strategy) => {
        const key = `${biome.id}-${subBasin.id}-${ea.id}`;
        let addRow = (
          <CustomInputNumber
            id={strategy.id}
            focus={Number(strategy.id) === clickedStrategy}
            name={strategy.strategy_name}
            maxValue={Number(strategy.area_ha.toFixed(2))}
            operateArea={this.operateArea}
            reportError={this.reportTableError}
            updateClickedStrategy={updateClickedStrategy}
          />
        );
        if (savedStrategies[key]) {
          const found = savedStrategies[key]
            .strategies.find(item => item.id === Number(strategy.id));
          if (found) addRow = found.value;
        }
        return {
          key: `${strategy.id}-${key}`,
          values: [
            strategy.strategy_name,
            strategy.area_ha.toFixed(2),
            addRow,
          ],
        };
      });
    }
    return biome && subBasin && ea && (
      <div className="complist">
        <StrategiesBox
          biome={biome.name}
          ea={ea.name}
          subBasin={subBasin.name}
          area={selectedArea}
          strategies={tableRows}
        />
        {tableError && (
          <div className="tableError">
            {tableError}
          </div>
        )}
        {selectedArea > 0 && (
          <button
            className="saveStrategyButton"
            type="button"
            onClick={() => { this.setState({ saveStrategiesModal: true }); }}
          >
            <SaveIcon className="iconsave" />
            Finalizar
          </button>
        )}
        <ConfirmationModal
          open={saveStrategiesModal}
          onClose={() => { this.setState({ saveStrategiesModal: false }); }}
          message="Al guardar estas estrategias, no podrán editarse. ¿Desea continuar?"
          onContinue={this.saveStrategies}
          onCancel={() => { this.setState({ saveStrategiesModal: false }); }}
        />
      </div>
    );
  }

  /**
   * Function to render szh-ea selector when there is a selected biome
   */
  renderSelector = () => {
    const { graphStatus: { DotsWhere } } = this.state;
    const { currentBiome, impactedBiomesDecisionTree } = this.props;

    const data = currentBiome !== null
      ? { [currentBiome]: impactedBiomesDecisionTree[currentBiome] } : {};
    return (
      <ParentSize className="nocolor">
        {parent => (
          parent.width && parent.height && (
            <PopMenu
              visibleGraph={DotsWhere}
              loadStrategies={this.loadStrategies}
              showDotsGraph={this.showDotsGraph}
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
  renderGraphs = (data, activeBiome, labelX, labelY, graph, colors) => {
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
                activeBiome={activeBiome}
                labelX={labelX}
                labelY={labelY}
                elementOnClick={name => this.resetAreaSelected(name)}
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
      areaName, back, basinName, colors, classes, subAreaName, biomesImpacted, currentBiome,
    } = this.props;
    const {
      whereData, totals, selectedArea, tableError, addBiomesToProjectModal, controlAddingBiomes,
      allBiomes, savedStrategies, savedArea,
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
                    className="sendCreateBiomes"
                    onClick={() => { this.setState({ addBiomesToProjectModal: true }); }}
                    data-tooltip
                    title="Guardar biomas en proyecto"
                  >
                    Guardar
                  </button>
                )}
                <ConfirmationModal
                  open={addBiomesToProjectModal}
                  onClose={() => { this.setState({ addBiomesToProjectModal: false }); }}
                  message="Una vez guardados los cambios no podrá editarlos, ¿está seguro de continuar?"
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
                    AREA SELECCIONADA
                  </h3>
                  <h4 className={((selectedArea + savedArea) >= totals.total_compensate) ? 'areaCompleted' : ''}>
                    {(savedArea + selectedArea).toFixed(2)}
                  </h4>
                </div>
                {this.renderGraphs(whereData, currentBiome, '% Area afectada', 'Factor de Compensación', 'Dots', colors)}
                {this.renderSelector()}
                {Object.keys(savedStrategies).length > 0 && (
                  <Button
                    className="downgraph"
                    id="downloadStrategies"
                    type="button"
                    href={this.downloadPlanUrl()}
                  >
                    <DownloadIcon className="icondown" />
                    {'Descargar plan'}
                  </Button>
                )}
                {tableError && (
                  <div className="tableError">
                    {tableError}
                  </div>
                )}
                {this.renderAvailableStrategies()}
                {this.renderSavedStrategies()}
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
  showStrategies: PropTypes.func.isRequired,
  updateCurrentBiome: PropTypes.func,
  updateClickedStrategy: PropTypes.func.isRequired,
  companyId: PropTypes.number.isRequired,
  projectId: PropTypes.number.isRequired,
  reloadProject: PropTypes.func.isRequired,
  impactedBiomesDecisionTree: PropTypes.object,
  reportConnError: PropTypes.func,
  clickedStrategy: PropTypes.number,
  userId: PropTypes.number,
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
  reportConnError: () => {},
  clickedStrategy: null,
  userId: null,
};

export default withStyles(styles)(Drawer);
