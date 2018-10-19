/** eslint verified */
import React, { Component } from 'react';
import L from 'leaflet';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
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
  constructor(props) {
    super(props);
    this.state = {
      colors: [ // Colors for ecosystems types
        { medium: '#eabc47' },
        { low: '#51b4c1' },
        { high: '#ea495f' },
        { selected: '#2a363b' },
      ],
      biomesData: {},
      currentCompany: null,
      currentCompanyId: null,
      currentRegion: null,
      currentProject: null,
      currentProjectId: null,
      currentBiome: null,
      currentStrategies: null, // TODO: Should this remain here  or in another component?
      projectType: null, // TODO: Remove and use currentProject.
      projectName: null, // TODO: Remove and use currentProject.label
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
    Promise.resolve(RestAPI.requestProjectsAndRegionsByCompany(1))
      .then((res) => {
        this.setState({
          projects: res[0],
          regions: res[1],
          currentCompany: 'GEB',
          currentCompanyId: 1,
        });
        this.setDataForSelector();
      });
  }

  setDataForSelector = () => {
    this.setState((prevState) => {
      const newState = { ...prevState };
      const { regions } = prevState;
      const tempRegionList = [];
      const tempStatusList = [];
      Object.keys(regions).forEach((regionKey) => {
        const regionFound = newState.regions[regionKey];
        regionFound.label = `${this.firstLetterUpperCase(regionFound.id)}`;
        regionFound.detailId = 'region'; // TODO: Fix styles with Cesar
        regionFound.expandIcon = (<ExpandMoreIcon />);
        regionFound.idLabel = `panel1-${regionFound.label.replace(/ /g, '')}`;
        const newRegion = {};
        newRegion.value = regionFound.id;
        newRegion.label = regionFound.label;
        tempRegionList.push(newRegion);
        Object.keys(regionFound
          .projectsStates).forEach((stateKey) => {
          const stateFound = regionFound.projectsStates[stateKey];
          stateFound.label = `${stateFound
            .id.toLowerCase().split(' ').map(str => (
              (!str[2] || str[4]) ? str[0].toUpperCase() + str.slice(1) : str.toUpperCase())).join(' ')}`;
          stateFound.expandIcon = (<ExpandMoreIcon />);
          stateFound.idLabel = this.firstLetterUpperCase(stateFound.label).replace(/ /g, '');
          stateFound.detailId = 'state';
          Object.keys(stateFound.projects).forEach((projectKey) => {
            stateFound.projects[projectKey].type = 'button';
            stateFound.projects[projectKey].label = `${this.firstLetterUpperCase(stateFound.projects[projectKey].name)}`;
          });
        });
        if (tempStatusList.length === 0) {
          Object.values(regionFound.projectsStates).map((element) => {
            const newStatus = {};
            newStatus.value = element.id;
            newStatus.label = element.label;
            tempStatusList.push(newStatus);
            return null;
          });
        }
      });
      const createProject = {
        id: 'addProject',
        idLabel: 'panel1-newProject',
        detailId: 'region',
        expandIcon: (<AddIcon />),
        label: '+ Agregar nuevo proyecto',
        type: 'addProject',
      };
      newState.regionsList = tempRegionList;
      newState.statusList = tempStatusList;
      newState.regions.push(createProject);
      return newState;
    });
  }

  featureStyle = (feature) => {
    const { colors, layerName } = this.state;
    const styleResponse = {
      stroke: false, opacity: 0.6, fillOpacity: 0.6,
    };
    // TODO: Verify if feature.properties.area_impacted_pct is being showed
    //  console.log('feature', feature);
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
        area.bindPopup(
          `<b>Jurisdicción:</b> ${area.feature.properties.ID_CAR}
          <br><b>Bioma:</b> ${area.feature.properties.BIOMA_IAvH}
          <br><b>Factor de compensación:</b> ${area.feature.properties.compensation_factor}
          <br><b>% de afectación:</b> ${area.feature.properties.area_impacted_pct}`,
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
      newState.projectName = null;
      newState.projectName = null;
      newState.currentProject = null;
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
      projectType: name,
    });
  }

  innerElementChange = (parent, nameToOn) => {
    // TODO: Change GeoServerAPI to RestAPI
    // TODO: Remove nameToOnL, to use projectId for layer search
    const {
      currentCompanyId, newProjectData, projects,
    } = this.state;
    const tempProject = projects
      .find(element => element.name === nameToOn);
    if (newProjectData === null) { // Path for projects saved with biomes
      Promise.all([
        // GeoServerAPI.requestBiomasSogamoso(),
        RestAPI.requestImpactedBiomes(currentCompanyId, tempProject.id_project),
        RestAPI.requestProjectsByCompany(currentCompanyId, tempProject.id_project),
      ]).then((res) => {
        this.setState((prevState) => {
          const newState = { ...prevState };
          newState.biomesData = res[0].biomes;
          newState.layers = {
            ...prevState.layers,
            projectBiomes: {
              displayName: 'projectBiomes',
              active: true,
              layer: L.geoJSON(
                res[0].geometry || [],
                {
                  style: this.featureStyle,
                  onEachFeature: (feature, layer) => (
                    this.featureActions(feature, layer, 'projectBiomes')
                  ),
                },
              ),
            },
            project: {
              displayName: 'project',
              active: true,
              layer: L.geoJSON(
                res[1].geomGeoJSON,
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
          newState.projectName = tempProject.name;
          newState.currentProject = tempProject;
          newState.currentProjectId = tempProject.id_project;
          return newState;
        });
      });
    } else { // Path for new projects
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
    // TODO: When the promise is rejected, we need to show a "Data not available" error
    // (in the SZH selector). But the application won't break as it currently is
  }

  firstLetterUpperCase = sentence => sentence.toLowerCase()
    .split(' ').map(str => str[0].toUpperCase() + str.slice(1)).join(' ');

  render() {
    const {
      biomesData, currentBiome, currentCompany, currentProject, currentRegion,
      layerName,
      colors, layers, regions, regionsList, statusList, openModal, newProjectData,
    } = this.state;
    return (
      <Layout
        moduleName="Compensaciones"
        showFooterLogos={false}
      >
        {openModal && (newProjectData === null) && (
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
                  regions.findIndex(region => region.id === currentRegion)
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
                biomesData={biomesData}
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
                  // layerName={layerName}
                  // biomeData={currentBiome}
                  subAreaName={newProjectData.state}
                  updateActiveBiome={this.updateActiveBiome}
                />
              )
            }
            {console.log(this.state)}
          </div>
        </div>
      </Layout>
    );
  }
}

export default Compensation;
