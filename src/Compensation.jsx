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
      openModal: false,
      layerName: null,
      layers: {},
      newProjectData: null,
      projects: [],
      regions: [],
      regionsList: null,
      statusList: null,
    };
  }

  componentDidMount() {
    RestAPI.requestProjectsAndRegionsByCompany(1)
      .then((res) => {
        if (Array.isArray(res)) {
          const { regionsList, statusList, regions } = this.constructDataForSelector(res[1]);
          this.setState({
            projects: res[0] || [],
            currentCompany: 'GEB',
            currentCompanyId: 1,
            regionsList,
            statusList,
            regions,
          });
        }
      })
      .catch(() => {
        this.setState({
          openModal: true,
        });
      });
  }

  constructDataForSelector = (regions) => {
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

  /** ****************************** */
  /** LISTENER FOR NEW PROJECT MODAL */
  /** ****************************** */

  handleCloseModal = () => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal });
  };

  setNewProject = (region, status, name) => {
    const { currentCompanyId } = this.state;
    RestAPI.createProject(currentCompanyId, region, status, name)
      .then((res) => {
        this.setState({
          newProjectData: res,
          currentRegion: res.region,
        });
      });
    this.handleCloseModal();
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
      newState.newProjectData = null;
      return newState;
    });
  }

  /** ****************************** */
  /** LISTENERS FOR SELECTOR CHANGES */
  /** ****************************** */

  firstLevelChange = (name, type) => {
    this.setState({
      currentRegion: name,
    });
    if (type) {
      this.handleCloseModal();
    }
    return null;
  }

  secondLevelChange = (name) => {
    this.setState({
      currentStatus: name,
    });
  }

  innerElementChange = (parent, projectId) => {
    const { currentCompanyId, newProjectData } = this.state;
    if (newProjectData === null) { // Path for saved projects
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
          return newState;
        });
      });
    } else { // Path for new projects
      // TODO: Create instructions in a modal about how to add new biomes
      // this.setState((prevState) => {
      //   const newState = { ...prevState };
      //   newState.openModal = true;
      //   return newState;
      // });
    }
    return null;
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
      layerName, projects,
      colors, layers, regions, regionsList, statusList, openModal, newProjectData,
    } = this.state;
    return (
      <Layout
        moduleName="Compensaciones"
        showFooterLogos={false}
      >
        {openModal && !newProjectData && regionsList && (
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openModal}
            onClose={this.handleCloseModal}
            disableAutoFocus
          >
            <NewProjectForm
              regions={regionsList}
              status={statusList}
              handlers={[
                this.setNewProject,
                this.handleCloseModal,
              ]}
            />
          </Modal>
        )}
        {openModal && (projects.length === 0) && ( // Used to show a connection error message
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openModal}
            onClose={this.handleCloseModal}
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
                onClick={this.handleCloseModal}
                data-tooltip
                title="Cerrar"
              >
                <CloseIcon />
              </button>
            </div>
          </Modal>
        )}
        {newProjectData
          && this.innerElementChange(newProjectData.state, newProjectData.name)}
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            geoServerUrl={GeoServerAPI.getRequestURL()}
          />
          <div className="contentView">
            {
              !currentProject && !newProjectData && (
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
              />
              )
            }
            {
              newProjectData && `${newProjectData}` && (
                <Drawer
                  areaName={`${currentCompany} ${currentRegion}`}
                  back={this.handlerBackButton}
                  basinName={newProjectData.name}
                  colors={colors.map(obj => Object.values(obj)[0])}
                  allBiomes={RestAPI.getAllBiomes()}
                  // allBiomes={[
                  //   {
                  //     id_biome: 1,
                  //     name: 'Halobioma Alta Guajira',
                  //     compensation_factor: '6.00',
                  //   }]
                  // }
                  subAreaName={newProjectData.state}
                  updateActiveBiome={this.updateActiveBiome}
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
