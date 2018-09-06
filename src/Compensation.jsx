/** eslint verified */
import React, { Component } from 'react';
import L from 'leaflet';

import MapViewer from './MapViewer';
import Drawer from './compensation/Drawer';
import Selector from './Selector';
import ElasticAPI from './api/elastic';
import GeoServerAPI from './api/geoserver';
import Layout from './Layout';
import { description, selectorData } from './compensation/assets/selectorData';

class Compensation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCategory: null,
      company: null,
      projectType: null,
      projectName: null,
      layerName: null,
      layers: {},
      projects: [],
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
      GeoServerAPI.requestProjectsGEB(),
      GeoServerAPI.requestBiomasSogamoso(),
      GeoServerAPI.requestSogamoso(),
    ]).then((res) => {
      const projectsFound = [];
      // TODO: Finalize new projects load structure
      Object.keys(res[0].features).forEach(
        (index) => {
          const project = {};
          project.values = [
            res[0].features[index].properties.ESTADO,
            res[0].features[index].properties.PROYECTO,
            res[0].features[index].properties.AREA_ha,
          ];
          project.key = res[0].features[index].properties.NOM_GEN;
          projectsFound.push(project);
        },
      );
      this.setState(prevState => ({
        company: 'GEB',
        projects: projectsFound,
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
    });
  }

  featureStyle = (feature) => {
    const { colors, layerName } = this.state;
    const styleResponse = {
      stroke: false, opacity: 0.6, fillOpacity: 0.6,
    };
    if (layerName && (layerName === feature.properties.BIOMA_IAvH)) {
      styleResponse.fillOpacity = 1;
      styleResponse.weight = 1;
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
  // TODO: highlight basin inside dotsWhere and dotsWhat at the time with the graph
    const area = event.target;
    area.setStyle({
      weight: 1,
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
    if (!L.Browser.ie && !L.Browser.opera) area.bringToFront();
  }

  resetHighlight = (area, parentLayer) => {
    const { layerName, layers } = this.state;
    if (
      layers[parentLayer] && layerName && (layerName !== area.feature.properties.BIOMA_IAvH)
    ) {
      layers[parentLayer].layer.resetStyle(area);
    }
  }

  clickFeature = (event, parentLayer) => {
    const area = event.target;
    this.updateActiveBioma(area.feature.properties.BIOMA_IAvH);
    this.highlightFeature(event, parentLayer);
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

      newState.projectName = null;
      return newState;
    });
  }

  /** ****************************** */
  /** LISTENERS FOR SELECTOR CHANGES */
  /** ****************************** */

  firstLevelChange = (name) => {
    this.setState({
      currentCategory: name,
    });
  }

  secondLevelChange = (name) => {
    this.setState({
      projectType: name,
    });
  }

  innerElementChange = (nameToOff, nameToOn) => {
    const { layers } = this.state;
    this.setState((prevState) => {
      const newState = { ...prevState };
      if (layers[nameToOff]) newState.layers[nameToOff].active = false;
      if (layers[nameToOn]) {
        newState.layers[nameToOn].active = true;
        if (nameToOn === 'sogamoso') newState.layers.biomasSogamoso.active = true;
        newState.projectName = newState.layers[nameToOn].displayName;
      }
      return newState;
    });
  }

  updateActiveBioma = (name) => {
    const { layers: { biomasSogamoso } } = this.state;
    ElasticAPI.requestDondeCompensarSogamoso(name)
      .then((res) => {
        this.setState({
          layerName: name,
          datosSogamoso: res,
        });
      }).then(() => {
        const currentLayers = biomasSogamoso.layer.getLayers();
        const currentClasses = Object.values(currentLayers)
          .filter(obj => obj.feature.properties.BIOMA_IAvH === name);
        currentClasses.forEach(currentClass => currentClass.setStyle({
          weight: 1,
          fillOpacity: 1,
        }));
        currentLayers.forEach(area => this.resetHighlight(area, 'biomasSogamoso'));
      });
    // TODO: When the promise is rejected, we need to show a "Data not available" error
    // (in the SZH selector). But the application won't break as it currently is
  }

  render() {
    const {
      datosSogamoso, currentCategory, projectType, projectName, layerName,
      colors, layers,
    } = this.state;
    return (
      <Layout
        moduleName="Compensaciones"
        showFooterLogos={false}
      >
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            geoServerUrl={GeoServerAPI.getRequestURL()}
          />
          <div className="contentView">
            {
              !projectName && (
              <Selector
                handlers={[
                  this.firstLevelChange,
                  this.secondLevelChange,
                  this.innerElementChange,
                ]}
                description={description}
                expandedId={1}
                data={selectorData}
                iconClass="iconsec2"
              />
              )
            }
            {
              projectName && (
              <Drawer
                areaName={`GEB ${currentCategory}`}
                back={this.handlerBackButton}
                basinName={projectName}
                colors={colors.map(obj => Object.values(obj)[0])}
                layerName={layerName}
                projectData={datosSogamoso}
                subAreaName={projectType}
                updateActiveBioma={this.updateActiveBioma}
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
