/** eslint verified */
// TODO: Merge functionalities to replace states geojsonCapa# by activeLayers
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
      geojsonCapa1: null,
      geojsonCapa2: null,
      geojsonCapa3: null,
      geojsonCapa4: null,
      layers: null,
      activeLayers: null,
      colors: ['#eabc47', '#51b4c1', '#ea495f', '#2a363b'],
    };
  }

  componentDidMount() {
    Promise.all([
      GeoServerAPI.requestSogamoso(),
      GeoServerAPI.requestBiomasSogamoso(),
    ]).then((res) => {
      this.setState(prevState => (
        {
          activeLayers: {
            sogamoso: false,
            biomasSogamoso: false,
          },
          layers: {
            ...prevState.layers,
            sogamoso: L.geoJSON(
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
                  this.featureActions(feature, layer, 'sogamoso')
                ),
              },
            ),
            biomasSogamoso: L.geoJSON(
              res[1],
              {
                style: this.featureStyle,
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'biomasSogamoso')
                ),
              },
            ),
          },
        }
      ));
    })
      .catch(() => (
        this.setState({
          activeLayers: {},
          layers: {},
        })
      ));
  }

  featureStyle = (feature) => {
    const { colors } = this.state;
    if (feature.properties.FC_Valor > 6.5 && feature.properties.AFFECTED_P > 12) {
      return { // high
        stroke: false, fillColor: colors[2], opacity: 0.6, fillOpacity: 0.6,
      };
    } if (feature.properties.FC_Valor > 6.5 && feature.properties.AFFECTED_P < 12) {
      return { // low
        stroke: false, fillColor: colors[1], opacity: 0.6, fillOpacity: 0.6,
      };
    } return { // medium
      stroke: false, fillColor: colors[0], opacity: 0.6, fillOpacity: 0.6,
    };
  }

  /** ************************ */
  /** LISTENERS FOR MAP LAYERS */
  /** ************************ */

  featureActions = (feature, layer, parentLayer) => {
    layer.on(
      {
        mouseover: event => this.highlightFeature(event, parentLayer),
        mouseout: event => this.resetHighlight(event, parentLayer),
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
          `<b>Proyecto:</b> ${area.feature.properties.PROYECTO}
           <br><b>Área:</b> ${area.feature.properties.AREA_ha}`,
        );
        break;
      case 'biomasSogamoso':
        area.bindPopup(
          `<b>Jurisdicción:</b> ${area.feature.properties.ID_CAR}
          <br><b>Bioma:</b> ${area.feature.properties.BIOMA_IAvH}
          <br><b>Factor de compensación:</b> ${area.feature.properties.FC_Valor}
          <br><b>% de afectación:</b> ${area.feature.properties.AFFECTED_P}`,
        );
        break;
      default:
        break;
    }
    if (!L.Browser.ie && !L.Browser.opera) area.bringToFront();
  }

  resetHighlight = (event, layer) => {
    const feature = event.target;
    const { layers } = this.state;
    layers[layer].resetStyle(feature);
  }

  clickFeature = (event) => {
    // TODO: Activate bioma inside dotsWhere and dotsWhat
    this.highlightFeature(event);
  }

  /** ***************************************** */
  /** LISTENER FOR BACK BUTTON ON LATERAL PANEL */
  /** ***************************************** */

  handlerBackButton = () => {
    this.setState(prevState => (
      {
        activeLayers: {
          ...prevState.activeLayers,
          sogamoso: false,
          biomasSogamoso: false,
        },
        geojsonCapa3: null,
      }
    ));
  }

  /** ****************************** */
  /** LISTENERS FOR SELECTOR CHANGES */
  /** ****************************** */

  firstLevelChange = (name) => {
    this.setState({
      geojsonCapa1: name,
    });
  }

  secondLevelChange = (name) => {
    this.setState({
      geojsonCapa2: name,
    });
  }

  innerElementChange = (nameToOff, nameToOn, layerName) => {
    const { layers } = this.state;
    this.setState((prevState) => {
      const newState = { ...prevState };
      if (layers) {
        if (layers[nameToOff]) newState.activeLayers[nameToOff] = false;
        if (layers[nameToOn]) {
          newState.activeLayers[nameToOn] = true;
          // Don't know if this can be improved (two layers behaving the same)
          if (nameToOn === 'sogamoso') newState.activeLayers.biomasSogamoso = true;
        }
      }

      newState.geojsonCapa3 = layerName;
      return newState;
    });
  }

  updateActiveBioma = (campo) => {
    ElasticAPI.requestDondeCompensarSogamoso(campo)
      .then((res) => {
        this.setState({
          geojsonCapa4: campo,
          datosSogamoso: res,
        });
      });
    // TODO: When the promise is rejected, we need to show a "Data not available" error
    // (in the SZH selector). But the application won't break as it currently is
  }

  render() {
    const {
      datosSogamoso, geojsonCapa1, geojsonCapa2, geojsonCapa3, geojsonCapa4,
      colors, layers, activeLayers,
    } = this.state;
    return (
      <Layout
        moduleName="Compensaciones"
        showFooterLogos={false}
      >
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            activeLayers={activeLayers}
          />
          <div className="contentView">
            {
              !geojsonCapa3 && (
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
              geojsonCapa3 && (
              <Drawer
                areaName={`GEB ${geojsonCapa1}`}
                back={this.handlerBackButton}
                basinName={geojsonCapa3.NOMCAR || geojsonCapa3}
                colors={colors}
                layerName={geojsonCapa4}
                projectData={datosSogamoso}
                subAreaName={geojsonCapa2}
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
