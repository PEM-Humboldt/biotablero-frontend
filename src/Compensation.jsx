/** eslint verified */
import React, { Component } from 'react';
import L from 'leaflet';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import MapViewer from './MapViewer';
import Drawer from './compensation/Drawer';
import NewProjectForm from './compensation/NewProjectForm';
import Selector from './Selector';
import ElasticAPI from './api/elastic';
import GeoServerAPI from './api/geoserver';
import RestAPI from './api/REST';
import Layout from './Layout';
import { description } from './compensation/assets/selectorData';

class Compensation extends Component {
  /**
   * Set the first letter of each word to uppercase
   */
  static firstLetterUpperCase = sentence => (
    sentence
      .toLowerCase()
      .split(/ |-/)
      .map(str => str[0].toUpperCase() + str.slice(1))
      .join(' ')
  );

  static constructDataForSelector = (regions) => {
    const regionsArray = [];
    const regionsList = [];
    const statusList = [];
    Object.keys(regions).forEach((regionKey) => {
      const regionId = (regionKey === 'null') ? '(REGION SIN ASIGNAR)' : regionKey;
      const regionLabel = Compensation.firstLetterUpperCase(regionId);
      regionsList.push({
        value: regionId,
        label: regionLabel,
      });
      const region = {
        id: regionId,
        label: regionLabel,
        detailId: 'region',
        expandIcon: (<ExpandMoreIcon />),
        idLabel: `panel1-${regionLabel.replace(/ /g, '')}`,
        projectsStates: [],
      };
      Object.keys(regions[regionKey]).forEach((statusKey) => {
        const statusId = (statusKey === 'null') ? '(ESTADO SIN ASIGNAR)' : statusKey;
        const statusLabel = (statusId.length > 3)
          ? Compensation.firstLetterUpperCase(statusId) : statusId;
        statusList.push({
          value: statusId,
          label: statusLabel,
        });
        region.projectsStates.push({
          id: statusId,
          label: statusLabel,
          detailId: 'state',
          expandIcon: (<ExpandMoreIcon />),
          idLabel: Compensation.firstLetterUpperCase(statusLabel).replace(/ /g, ''),
          detailClass: 'inlineb',
          projects: regions[regionKey][statusKey].map(project => ({
            id_project: project.gid,
            name: Compensation.firstLetterUpperCase(project.name),
            state: project.prj_status,
            region: project.id_region,
            area: project.area_ha,
            id_company: project.id_company,
            project: project.name,
            type: 'button',
            label: Compensation.firstLetterUpperCase(project.name),
          })),
        });
      });
      regionsArray.push(region);
    });
    const newProject = {
      id: 'addProject',
      idLabel: 'panel1-newProject',
      detailId: 'region',
      expandIcon: (<AddIcon />),
      label: '+ Agregar nuevo proyecto',
      type: 'addProject',
    };
    if (regionsList.length > 0 && statusList.length > 0) regionsArray.push(newProject);

    return { regionsList, statusList, regions: regionsArray };
  }

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
      layerName: null,
      layers: {},
      regions: [],
      regionsList: [],
      statusList: [],
      loadingModal: false,
    };
  }

  componentDidMount() {
    RestAPI.requestProjectsAndRegionsByCompany(1)
      .then((res) => {
        const { regionsList, statusList, regions } = Compensation.constructDataForSelector(res);
        this.setState({
          currentCompany: 'GEB',
          currentCompanyId: 1,
          regionsList,
          statusList,
          regions,
        });
      })
      .catch(() => {
        this.setState({
          connError: true,
        });
      });
  }

  featureStyle = (feature) => {
    const { colors, layerName } = this.state;
    const styleResponse = {
      stroke: false, opacity: 0.6, fillOpacity: 0.6,
    };
    // TODO: Verify if feature.properties.area_impacted_pct is being showed
    console.log('feature', feature);
    if (layerName && (layerName === feature.properties.BIOMA_IAvH)) {
      styleResponse.fillOpacity = 1;
    }
    if (feature.properties.compensation_factor > 6.5
    && feature.properties.area_impacted_pct > 12) {
      styleResponse.fillColor = Object.values(Object.values(colors).find(obj => String(Object.keys(obj)) === 'high'));
    } else if (feature.properties.compensation_factor < 6.5
    && feature.properties.area_impacted_pct < 12) {
      styleResponse.fillColor = Object.values(Object.values(colors).find(obj => String(Object.keys(obj)) === 'low'));
    } else {
      styleResponse.fillColor = Object.values(Object.values(colors).find(obj => String(Object.keys(obj)) === 'medium'));
    }
    return styleResponse;
  }

  /** ************************ */
  /** LISTENERS FOR MAP LAYERS */
  /** ************************ */

  featureActions = (feature, layer, parentLayer) => {
    layer.on(
      {
        mouseover: event => this.highlightFeature(event, parentLayer),
        mouseout: event => this.resetHighlight(event.target, parentLayer),
        click: this.clickFeature,
      },
    );
  }

  highlightFeature = (event, parentLayer) => {
    console.log(this.state);
    const area = event.target;
    area.setStyle({
      fillOpacity: 1,
    });
    switch (parentLayer) {
      case 'project':
        area.bindPopup(
          `<b>Proyecto:</b> ${area.feature.properties.PROYECTO}
          <br><b>Área:</b> ${area.feature.properties.AREA_ha}`,
        );
        break;
      case 'projectBiomes':
        area.bindPopup( // TODO: Replace area.feature.properties.ID_CAR for the right EA name
          `<b>Jurisdicción:</b> ${area.feature.properties.ID_CAR || 'Varias EA'}
          <br><b>Bioma:</b> ${area.feature.properties.name}
          <br><b>Factor de compensación:</b> ${area.feature.properties.compensation_factor}
          <br><b>% de afectación:</b> ${area.feature.properties.area_impacted_pct || 'Sin información'}`,
        );
        break;
      default:
        break;
    }
  }

  resetHighlight = (area, parentLayer) => {
    const { layerName, layers, currentProject } = this.state;
    console.log('currentProject', currentProject);
    if (
      layers[parentLayer] && layerName && (layerName !== area.feature.properties.BIOMA_IAvH)
    ) {
      layers[parentLayer].layer.resetStyle(area);
    } else if (!layerName) layers[parentLayer].layer.resetStyle(area);
    layers.project.layer.bringToFront();
  }

  clickFeature = (event, parentLayer) => {
    const area = event.target;
    this.updateActiveBiome(area.feature.properties.BIOMA_IAvH);
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
      RestAPI.requestProjectByIdAndCompany(currentCompanyId, projectId),
    ]).then(([biomes, project]) => {
      this.setState((prevState) => {
        const newState = { ...prevState, biomesImpacted: [] };
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
      });
    });
  }

  /** ***************************************** */
  /** LISTENER FOR BACK BUTTON ON LATERAL PANEL */
  /** ***************************************** */

  handlerBackButton = () => {
    this.setState((prevState) => {
      const newState = { ...prevState };
      const { layers } = prevState;
      Object.keys(layers).forEach((layerKey) => {
        newState.layers[layerKey].active = false;
      });
      newState.currentBiome = null;
      newState.currentProject = null;
      newState.currentRegion = null;
      newState.biomesImpacted = [];
      return newState;
    });
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
      currentStatus: name,
    });
  }

  innerElementChange = (parent, projectId) => {
    this.loadProject(projectId);
  }

  updateActiveBiome = (biomeName) => {
    const { layers: { projectBiomes }, currentProject } = this.state;
    // TODO: Save biomes and its strategies on the selectedProject
    // TODO: Change ElasticAPI implementation for RestAPI
    // console.log('currentProject, state', this.state, currentProject,
    // currentProject.name, 'bioma', biomeName);
    ElasticAPI.requestProjectStrategiesByBiome(currentProject.name.toUpperCase(), biomeName)
      .then((res) => {
        // console.log('res', res);
        this.setState({
          layerName: biomeName,
          currentBiome: res, // TODO: Change strategies data structure
        });
      }).then(() => {
        const currentLayers = projectBiomes.layer.getLayers();
        const currentClasses = Object.values(currentLayers)
          .filter(obj => obj.feature.properties.BIOMA_IAvH === biomeName);
        currentClasses.forEach(currentClass => currentClass.setStyle({
          fillOpacity: 1,
        }));
        currentLayers.forEach(area => this.resetHighlight(area, 'projectBiomes'));
      });
  }

  render() {
    const {
      biomesImpacted, currentBiome, currentCompany, currentProject, currentRegion,
      layerName, colors, layers, regions, regionsList, statusList, newProjectModal, connError,
      currentCompanyId, currentProjectId, loadingModal,
    } = this.state;
    return (
      <Layout
        moduleName="Compensaciones"
        showFooterLogos={false}
      >
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
          <div className="newProjectTitle">
            <h2>
              Sin conexión al servidor.
              La aplicación estará disponible nuevamente en minutos.
            </h2>
            <button
              type="button"
              className="closebtn"
              onClick={this.handleCloseModal('connError')}
              data-tooltip
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
          <div className="newProjectTitle">
            <h2>
              Cargando información
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
                areaName={`${currentCompany} ${currentRegion}`}
                back={this.handlerBackButton}
                basinName={currentProject.name}
                colors={colors.map(obj => Object.values(obj)[0])}
                layerName={layerName}
                biomeData={currentBiome}
                biomesImpacted={biomesImpacted}
                subAreaName={currentProject.state}
                updateActiveBiome={this.updateActiveBiome}
                companyId={currentCompanyId}
                projectId={currentProjectId}
                reloadProject={this.loadProject}
              />
              )
            }
          </div>
        </div>
      </Layout>
    );
  }
}

export default Compensation;
