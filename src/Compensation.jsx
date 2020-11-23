import CloseIcon from '@material-ui/icons/Close';
import L from 'leaflet';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ConstructDataForCompensation } from './commons/ConstructDataForSelector';
import MapViewer from './commons/MapViewer';
import Drawer from './compensation/Drawer';
import NewProjectForm from './compensation/NewProjectForm';
import Selector from './commons/Selector';
import GeoServerAPI from './api/GeoServerAPI';
import RestAPI from './api/RestAPI';
import description from './compensation/assets/selectorData';
import AppContext from './AppContext';

class Compensation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [ // Colors for ecosystems types
        { medium: '#eabc47' },
        { low: '#51b4c1' },
        { high: '#ea495f' },
        { selected: '#2a363b' },
      ],
      biomesImpacted: [],
      currentCompany: null,
      currentCompanyId: null,
      currentRegion: null,
      currentProject: null,
      currentProjectId: null,
      currentBiome: null,
      currentStrategies: null,
      currentStatus: null,
      newProjectModal: false,
      connError: false,
      layers: {},
      regions: [],
      regionsList: [],
      statusList: [],
      loadingModal: false,
      clickedStrategy: null,
    };
  }

  componentDidMount() {
    const { user } = this.context;
    if (user && user.company && user.username) {
      this.setState(
        {
          currentCompanyId: user.company.id,
          currentCompany: user.username.toUpperCase(),
        },
        () => this.loadProjectsList(),
      );
    }
  }

  componentWillUnmount() {
    const { setHeaderNames } = this.props;
    setHeaderNames(null, null);
  }

  loadProjectsList = () => {
    const { currentCompanyId } = this.state;
    RestAPI.requestProjectsAndRegionsByCompany(currentCompanyId)
      .then((res) => {
        const { regionsList, statusList, regions } = ConstructDataForCompensation(res);
        this.setState({
          regionsList,
          statusList,
          regions,
        });
      })
      .catch(() => this.reportConnError());
  }

  /**
   * Report a connection error from one of the child components
   */
  reportConnError = () => {
    this.setState({
      connError: true,
    });
  }

  /**
   * Load project related states
   *
   * @param {Number} projectId project id
   */
  loadProject = (projectId) => {
    this.setState({ loadingModal: true });
    const { currentCompanyId } = this.state;
    Promise.all([
      RestAPI.requestImpactedBiomes(currentCompanyId, projectId),
      RestAPI.requestImpactedBiomesDecisionTree(currentCompanyId, projectId),
      RestAPI.requestProjectByIdAndCompany(currentCompanyId, projectId),
    ]).then(([biomes, decisionTree, project]) => {
      this.setState((prevState) => {
        const newState = {
          ...prevState,
          biomesImpacted: [],
          impactedBiomesDecisionTree: decisionTree,
        };
        if (biomes) {
          if (biomes.biomes) newState.biomesImpacted = biomes.biomes;
          if (biomes.geometry) {
            newState.layers = {
              ...newState.layers,
              projectBiomes: {
                displayName: 'projectBiomes',
                active: true,
                layer: L.geoJSON(
                  biomes.geometry,
                  {
                    style: this.featureStyle,
                    onEachFeature: (feature, layer) => (
                      this.featureActions(feature, layer, 'projectBiomes')
                    ),
                  },
                ),
              },
            };
          }
        }

        const { geomGeoJSON, ...currentProject } = project;
        newState.currentProject = currentProject;
        newState.currentProjectId = projectId;
        if (geomGeoJSON) {
          newState.layers = {
            ...newState.layers,
            project: {
              displayName: 'project',
              active: true,
              layer: L.geoJSON(
                project.geomGeoJSON,
                {
                  style: {
                    stroke: true,
                    color: '#7b56a5',
                    fillColor: '#7b56a5',
                    opacity: 0.6,
                    fillOpacity: 0.4,
                  },
                  onEachFeature: (feature, layer) => (
                    this.featureActions(feature, layer, 'project')
                  ),
                },
              ),
            },
          };
        }
        newState.loadingModal = false;
        return newState;
      }, () => {
        const { setHeaderNames } = this.props;
        const {
          currentCompany,
          currentProject: { id_region: idRegion, label, prj_status: prjStatus },
        } = this.state;
        setHeaderNames(`${currentCompany} ${idRegion}`, `${prjStatus} ${label}`);
      });
    });
  }

  featureStyle = (feature) => {
    const { colors } = this.state;
    const styleResponse = {
      stroke: false, opacity: 0.6, fillOpacity: 0.6,
    };
    if (feature.properties.compensation_factor > 6.5
    && feature.properties.area_impacted_pct > 12) {
      styleResponse.fillColor = Object.values(colors.find(obj => 'high' in obj));
    } else if (feature.properties.compensation_factor < 6.5
    && feature.properties.area_impacted_pct < 12) {
      styleResponse.fillColor = Object.values(colors.find(obj => 'low' in obj));
    } else {
      styleResponse.fillColor = Object.values(colors.find(obj => 'medium' in obj));
    }
    return styleResponse;
  }

  /** ************************ */
  /** LISTENERS FOR MAP LAYERS */
  /** ************************ */

  featureActions = (feature, layer, parentLayer) => {
    layer.on(
      {
        mouseover: event => this.highlightFeature(event.target, parentLayer),
        mouseout: event => this.resetHighlight(event.target, parentLayer),
        click: event => this.clickFeature(event.target, parentLayer),
      },
    );
  }

  highlightFeature = (area, parentLayer) => {
    area.setStyle({
      fillOpacity: 1,
    });
    switch (parentLayer) {
      case 'project': {
        const { currentProject } = this.state;
        area.bindPopup(
          `<b>Proyecto:</b> ${currentProject.name}
          <br><b>Área:</b> ${currentProject.area_ha}`,
        ).openPopup();
        break;
      }
      case 'projectBiomes':
        area.bindPopup(
          // TODO: When the backend is ready, connect with ea if exists
          // `<b>Jurisdicción:</b> ${area.feature.properties.ID_CAR || 'Varias EA'}
          `<b>Bioma:</b> ${area.feature.properties.name}
          <br><b>Factor de compensación:</b> ${area.feature.properties.compensation_factor}
          <br><b>% de afectación:</b> ${area.feature.properties.area_impacted_pct || 'Sin información'}`,
        ).openPopup();
        break;
      case 'strategies':
        if (area.feature.properties.area_status) {
          area.bindPopup(
            `<b>Estrategia:</b> ${area.feature.properties.strategy}
            <br><b>Area:</b> ${area.feature.properties.area_ha} ha
            <br><b>Estado:</b> ${area.feature.properties.area_status}`,
          ).openPopup();
        } else {
          area.bindPopup(
            `<b>Estrategia:</b> ${area.feature.properties.strategy}
            <br><b>Area:</b> ${area.feature.properties.area_ha} ha`,
          ).openPopup();
        }
        break;
      default:
        break;
    }
  }

  resetHighlight = (area, parentLayer) => {
    const { layers } = this.state;
    if (layers[parentLayer]) {
      layers[parentLayer].layer.resetStyle(area);
    }
    if (layers.project) {
      layers.project.layer.bringToFront();
    }
  }

  clickFeature = (event, parentLayer) => {
    const { properties } = event.feature;
    if ('id_biome' in properties) {
      this.setState({ currentBiome: properties.name });
    } else if ('id_strategy' in properties) {
      this.setState({ clickedStrategy: properties.id_strategy });
    }
    this.highlightFeature(event, parentLayer);
  }

  /** ************************ */
  /** LISTENER FOR NEW PROJECT */
  /** ************************ */

  /**
   * Close a given modal
   *
   * @param {String} state state value that controls the modal you want to close
   */
  handleCloseModal = state => () => {
    this.setState({ [state]: false });
  };

  /**
   * Send request to create a new project
   *
   * @param {String} region project region
   * @param {String} status project status
   * @param {String} name project name
   */
  setNewProject = (region, status, name) => {
    const { currentCompanyId } = this.state;
    RestAPI.createProject(currentCompanyId, region, status, name)
      .then((res) => {
        this.setState({
          currentProject: res,
          currentProjectId: res.id_project,
          currentRegion: res.region,
          newProjectModal: false,
        });
        // TODO: Show here instructions to add biomes to the project
      });
  }


  /** ***************************************** */
  /** LISTENER FOR BACK BUTTON ON LATERAL PANEL */
  /** ***************************************** */

  handlerBackButton = () => {
    this.setState({
      layers: {},
      currentBiome: null,
      currentProject: null,
      currentRegion: null,
      biomesImpacted: [],
    }, () => {
      const { setHeaderNames } = this.props;
      setHeaderNames(null, null);
    });
    this.loadProjectsList();
  }

  /** ****************************** */
  /** LISTENERS FOR SELECTOR CHANGES */
  /** ****************************** */

  firstLevelChange = (name) => {
    this.setState({
      currentRegion: name,
    });
    if (name === 'addProject') {
      this.setState({ newProjectModal: true });
    }
    return null;
  }

  secondLevelChange = (name) => {
    this.setState({
      // TODO: Implementing back button functionality
      currentStatus: name,
    });
  }

  innerElementChange = (parent, projectId) => {
    this.loadProject(projectId);
  }

  /** ********************************* */
  /** LISTENERS CHANGES THAT AFFECT MAP */
  /** ********************************* */

  updateCurrentBiome = (name) => {
    let prevBiome = null;
    this.setState((prevState) => {
      prevBiome = prevState.currentBiome;
      const newState = {
        ...prevState,
        currentBiome: name,
      };
      if (newState.layers.strategies) newState.layers.strategies.active = false;
      newState.layers.projectBiomes.active = true;
      return newState;
    }, () => {
      const { layers: { projectBiomes: { layer: layers } } } = this.state;
      let newArea = null;
      let oldArea = null;
      layers.eachLayer((layer) => {
        if (layer.feature.properties.name === name) newArea = layer;
        if (layer.feature.properties.name === prevBiome) oldArea = layer;
      });
      if (newArea) this.highlightFeature(newArea, 'projectBiomes');
      else {
        this.resetHighlight(oldArea, 'projectBiomes');
        oldArea.closePopup();
      }
    });
  }

  showStrategiesLayer = (geoJson) => {
    this.setState((prevState) => {
      const newState = { ...prevState };
      // Transform in a boolean the geoJson to validate against this function used in Drawer
      const strategiesState = !!geoJson;
      newState.layers = {
        ...newState.layers,
        projectBiomes: {
          ...newState.layers.projectBiomes,
          active: false,
        },
        strategies: {
          displayName: 'strategies',
          active: strategiesState,
          layer: L.geoJSON(
            geoJson,
            {
              style: this.featureStyle,
              onEachFeature: (feature, layer) => (
                this.featureActions(feature, layer, 'strategies')
              ),
            },
          ),
        },
      };
      return newState;
    });
  }

  updateClickedStrategy = (strategyId) => {
    let prevStrategy = null;
    this.setState((prevState) => {
      prevStrategy = prevState.clickedStrategy;
      return { clickedStrategy: Number(strategyId) };
    }, () => {
      const { layers: { strategies: { layer: layers } } } = this.state;
      const newAreas = [];
      const oldAreas = [];
      layers.eachLayer((layer) => {
        if (layer.feature.properties.id_strategy === Number(strategyId)) {
          newAreas.push(layer);
        }
        if (layer.feature.properties.id_strategy === prevStrategy) {
          oldAreas.push(layer);
        }
      });
      newAreas
        .sort((a, b) => a.feature.properties.area_ha - b.feature.properties.area_ha)
        .forEach(area => this.highlightFeature(area, 'strategies'));
      oldAreas.forEach(area => this.resetHighlight(area, 'strategies'));
    });
  }

  render() {
    const {
      biomesImpacted, currentBiome, currentCompany, currentProject, currentRegion, colors, layers,
      regions, regionsList, statusList, newProjectModal, connError, currentCompanyId,
      currentProjectId, loadingModal, impactedBiomesDecisionTree, clickedStrategy,
    } = this.state;
    return (
      <div>
        {/** Modals section: new project, connection error or loading message */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={newProjectModal}
          onClose={this.handleCloseModal('newProjectModal')}
          disableAutoFocus
        >
          <NewProjectForm
            regions={regionsList}
            status={statusList}
            handlers={[
              this.setNewProject,
              this.handleCloseModal('newProjectModal'),
            ]}
          />
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={connError}
          onClose={this.handleCloseModal('connError')}
          disableAutoFocus
        >
          <div className="generalAlarm">
            <h2>
              <b>Sin conexión al servidor</b>
              <br />
              Intenta de nuevo en unos minutos.
            </h2>
            <button
              type="button"
              className="closebtn"
              onClick={this.handleCloseModal('connError')}
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={loadingModal}
          disableAutoFocus
        >
          <div className="generalAlarm">
            <h2>
              <b>Cargando</b>
              <div className="load-wrapp">
                <div className="load-1">
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                </div>
              </div>
            </h2>
          </div>
        </Modal>
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            geoServerUrl={GeoServerAPI.getRequestURL()}
          />
          <div className="contentView">
            {
              !currentProject && (
              <Selector
                handlers={[
                  this.firstLevelChange,
                  this.secondLevelChange,
                  this.innerElementChange,
                ]}
                description={description(currentCompany)}
                data={regions}
                expandedId={
                  regions.length < 0 ? regions.findIndex(region => region.id === currentRegion) : 0
                }
                iconClass="iconsec2"
              />
              )
            }
            {
              currentProject && (
              <Drawer
                back={this.handlerBackButton}
                colors={colors.map(obj => Object.values(obj)[0])}
                currentBiome={currentBiome}
                updateCurrentBiome={this.updateCurrentBiome}
                biomesImpacted={biomesImpacted}
                impactedBiomesDecisionTree={impactedBiomesDecisionTree}
                companyId={currentCompanyId}
                projectId={currentProjectId}
                reloadProject={this.loadProject}
                reportConnError={this.reportConnError}
                showStrategies={this.showStrategiesLayer}
                clickedStrategy={clickedStrategy}
                updateClickedStrategy={this.updateClickedStrategy}
              />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

Compensation.contextType = AppContext;

Compensation.propTypes = {
  setHeaderNames: PropTypes.func.isRequired,
};

export default Compensation;
