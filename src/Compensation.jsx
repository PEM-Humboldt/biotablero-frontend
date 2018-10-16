/** eslint verified */
import React, { Component } from 'react';
import L from 'leaflet';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
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
      projects: [],
      regions: [],
      regionsList: null,
      statusList: null,
      newProjectData: null,
      colors: [
        { medium: '#eabc47' },
        { low: '#51b4c1' },
        { high: '#ea495f' },
        { selected: '#2a363b' },
      ], // Colors for ecosystems types
    };
  }

  componentDidMount() {
    Promise.all([
      GeoServerAPI.requestProjectLayersByCompany('GEB'),
      GeoServerAPI.requestBiomasSogamoso(),
      GeoServerAPI.requestSogamoso(),
      // GeoServerAPI.requestProjectNamesOrganizedByCompany('GEB'),
      RestAPI.requestProjectsAndRegionsByCompany(1),
    ]).then((res) => {
      this.setState(prevState => ({
        // regions: res[3],
        projects: res[3][0],
        regions: res[3][1],
        currentCompany: 'GEB',
        currentCompanyId: 1,
        layers: {
          ...prevState.layers,
          // the key is the id that communicates with other components and should match selectorData
          projectsGEB: {
            displayName: 'projectsGEB',
            active: false,
            layer: L.geoJSON(
              res[0],
              {
                style: {
                  stroke: true,
                  color: '#7b56a5',
                  fillColor: '#7b56a5',
                  opacity: 0.6,
                  fillOpacity: 0.4,
                },
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'projectsGEB')
                ),
              },
            ),
          },
          // the key is the id that communicates with other components and should match selectorData
          biomasSogamoso: {
            displayName: 'BiomasSogamoso',
            active: false,
            layer: L.geoJSON(
              res[1],
              {
                style: this.featureStyle,
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'biomasSogamoso')
                ),
              },
            ),
          },
          // the key is the id that communicates with other components and should match selectorData
          sogamoso: {
            displayName: 'Sogamoso',
            active: false,
            layer: L.geoJSON(
              res[2],
              {
                style: {
                  stroke: true,
                  color: '#7b56a5',
                  fillColor: '#7b56a5',
                  opacity: 0.6,
                  fillOpacity: 0.4,
                },
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'sogamoso')
                ),
              },
            ),
          },
        },
      }));
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
        tempRegionList.push(regionFound);
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
            tempStatusList.push(element.id);
            return null;
          });
        }
      });
      const createProject = {
        id: 'addProject',
        idLabel: 'panel1-newProject',
        detailId: 'region',
        expandIcon: (<NoteAddIcon />),
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
    if (layerName && (layerName === feature.properties.BIOMA_IAvH)) {
      styleResponse.fillOpacity = 1;
    }
    if (feature.properties.FC_Valor > 6.5 && feature.properties.AFFECTED_P > 12) {
      styleResponse.fillColor = Object.values(Object.values(colors).find(obj => String(Object.keys(obj)) === 'high'));
    } else if (feature.properties.FC_Valor < 6.5 && feature.properties.AFFECTED_P < 12) {
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
    const area = event.target;
    area.setStyle({
      fillOpacity: 1,
    });
    switch (parentLayer) {
      case 'sogamoso':
        area.bindPopup(
          `<b>Proyecto:</b> ${area.feature.properties.PROYECTO} <br><b>Área:</b> ${area.feature.properties.AREA_ha}`,
        );
        break;
      case 'biomasSogamoso':
        area.bindPopup(
          `<b>Jurisdicción:</b> ${area.feature.properties.ID_CAR}<br><b>Bioma:</b> ${area.feature.properties.BIOMA_IAvH}<br><b>Factor de compensación:</b> ${area.feature.properties.FC_Valor}<br><b>% de afectación:</b> ${area.feature.properties.AFFECTED_P}`,
        );
        break;
      default:
        break;
    }
  }

  resetHighlight = (area, parentLayer) => {
    const { layerName, layers } = this.state;
    if (
      layers[parentLayer] && layerName && (layerName !== area.feature.properties.BIOMA_IAvH)
    ) {
      layers[parentLayer].layer.resetStyle(area);
    } else if (!layerName) layers[parentLayer].layer.resetStyle(area);
    layers.sogamoso.layer.bringToFront();
  }

  clickFeature = (event, parentLayer) => {
    const area = event.target;
    this.updateActiveBiome(area.feature.properties.BIOMA_IAvH);
    this.highlightFeature(event, parentLayer);
  }

  /** ****************** */
  /** LISTENER FOR MODAL */
  /** ****************** */

  getModalStyle = () => {
    const top = 50 + Math.round(Math.random() * 20) - 10;
    const left = 50 + Math.round(Math.random() * 20) - 10;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      position: 'absolute',
      width: 500,
      backgroundColor: 'white',
      boxShadow: 5,
      padding: 40,
    };
  }

  handleCloseModal = () => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal });
  };

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
      newState.projectName = null;
      newState.projectName = null;
      newState.currentProject = null;
      return newState;
    });
  }

  /** ****************************** */
  /** LISTENERS FOR NEW PROJECT */
  /** ****************************** */

  setNewProject = (field, value) => {
    const { newProjectData } = this.state;
    const tempProject = newProjectData;
    switch (field) {
      case 'region':
        tempProject.region = value;
        break;
      case 'status':
        tempProject.region = value;
        break;
      case 'biome':
        tempProject.biome = value;
        // tempProject.szh = ;
        // tempProject.ea = ;
        this.handleCloseModal();
        break;
      default:
        return null;
    }
    this.setState({
      newProjectData: tempProject,
    });
    return null;
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

  innerElementChange = (nameToOff, nameToOn) => {
    // TODO: Remove nameToOnL, to use projectId for layer search
    const nameToOnL = nameToOn.toLowerCase();
    // TODO: Change GeoServerAPI to RestAPI
    const { currentCompanyId, layers, projects } = this.state;
    const tempProject = projects
      .find(element => element.name === nameToOn);
    Promise.resolve(
      RestAPI.requestProjectsByCompany(
        currentCompanyId, tempProject.id_project,
      ),
    ).then((res) => {
      this.setState((prevState) => {
        const newState = { ...prevState };
        if (layers[nameToOff]) newState.layers[nameToOff].active = false;
        if (layers[nameToOnL]) {
          newState.layers[nameToOnL].active = true;
          if (nameToOnL === 'sogamoso') newState.layers.biomasSogamoso.active = true;
          newState.projectName = tempProject.name;
          newState.currentProject = res;
          newState.currentProjectId = tempProject.id_project;
        }
        return newState;
      });
    });
  }

  updateActiveBiome = (biomeName) => {
    const { layers: { biomasSogamoso }, currentProject } = this.state;
    // TODO: Save biomes and its strategies on the selectedProject
    // console.log('currentProject, state', this.state, currentProject);
    ElasticAPI.requestProjectStrategiesByBiome(currentProject.name, biomeName)
      .then((res) => {
        this.setState({
          layerName: biomeName,
          currentBiome: res, // TODO: Change strategies data structure
        });
      }).then(() => {
        const currentLayers = biomasSogamoso.layer.getLayers();
        const currentClasses = Object.values(currentLayers)
          .filter(obj => obj.feature.properties.BIOMA_IAvH === biomeName);
        currentClasses.forEach(currentClass => currentClass.setStyle({
          fillOpacity: 1,
        }));
        currentLayers.forEach(area => this.resetHighlight(area, 'biomasSogamoso'));
      });
    // TODO: When the promise is rejected, we need to show a "Data not available" error
    // (in the SZH selector). But the application won't break as it currently is
  }

  firstLetterUpperCase = sentence => sentence.toLowerCase()
    .split(' ').map(str => str[0].toUpperCase() + str.slice(1)).join(' ');

  render() {
    const {
      currentBiome, currentCompany, currentRegion, projectType, projectName, layerName,
      colors, layers, regions, regionsList, statusList, openModal,
    } = this.state;
    return (
      <Layout
        moduleName="Compensaciones"
        showFooterLogos={false}
      >
        {openModal && (
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openModal}
            onClose={this.handleCloseModal}
          >
            <div style={this.getModalStyle()}>
              <h2>Nuevo proyecto</h2>
              <NewProjectForm
                className="newProjectModal"
                regions={regionsList}
                status={statusList}
                handlers={this.setNewProject}
              />
            </div>
          </Modal>
        )}
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            geoServerUrl={GeoServerAPI.getRequestURL()}
          />
          <div className="contentView">
            {console.log(this.state)}
            {
              !projectName && (
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
              projectName && (
              <Drawer
                areaName={`${currentCompany} ${currentRegion}`}
                back={this.handlerBackButton}
                basinName={projectName}
                colors={colors.map(obj => Object.values(obj)[0])}
                layerName={layerName}
                biomeData={currentBiome}
                subAreaName={projectType}
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
