/** eslint verified */
// TODO: Merge functionalities to replace states geojsonCapa# by activeLayers
// TODO: Manejar capas activas. Hacer síncrono la carga del Selector (elementos
//  activos), con los elementos cargados
import React, { Component } from 'react';
// import Viewfinder from './Viewfinder';
import L from 'leaflet';
import MapViewer from './MapViewer';
import Selector from './Selector';
import Drawer from './search/Drawer';
import Footer from './Footer';
import './search/search.css';

import ElasticAPI from './api/elastic';
import GeoServerAPI from './api/geoserver';
import { description, selectorData } from './search/assets/selectorData';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geojsonCapa1: null,
      geojsonCapa2: null,
      geojsonCapa3: null,
      geojsonCapa4: null,
      basinData: null,
      activeLayerName: null,
      layers: null,
      activeLayers: null,
      colors: ['#7b56a5',
        '#6256a5',
        '#5564a4',
        '#4a8fb8',
        '#51b4c1',
        '#81bb47',
        '#a4c051',
        '#b1b559',
        '#eabc47',
        '#d5753d',
        '#ea5948',
        '#ea495f',
        '#c3374d'],
    };
  }

  componentDidMount() {
    Promise.all([
      GeoServerAPI.requestJurisdicciones(),
      GeoServerAPI.requestCorpoboyaca(),
    ]).then((res) => {
      this.setState(prevState => (
        {
          activeLayers: {
            jurisdicciones: false,
            corpoBoyaca: false,
          },
          layers: {
            ...prevState.layers,
            jurisdicciones: L.geoJSON(
              res[0],
              {
                style: {
                  color: '#e84a5f',
                  weight: 0.5,
                  fillColor: '#ffd8e2',
                  opacity: 0.6,
                  fillOpacity: 0.4,
                },
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'jurisdicciones')
                ),
              },
            ),
            corpoBoyaca: L.geoJSON(
              res[1],
              {
                style: this.featureStyle,
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'corpoBoyaca')
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
    const valueFC = feature.properties.FC_Valor;
    // {
    //   stroke: false,
    //   fillColor:'#7b56a5',
    //   opacity: 0.6,
    //   fillOpacity: 0.4,
    // },
    if (valueFC >= 4 || valueFC > 4.5) {
      return { // high
        stroke: false, fillColor: colors[0], fillOpacity: 0.8,
      };
    } if (valueFC >= 4.5 || valueFC > 5) {
      return { // high
        stroke: false, fillColor: colors[1], fillOpacity: 0.8,
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
        click: event => this.clickFeature(event, parentLayer),
      },
    );
  }

  highlightFeature = (event, parentLayer) => {
    const feature = event.target;
    feature.setStyle({
      weight: 1,
      fillOpacity: 1,
    });
    switch (parentLayer) {
      case 'jurisdicciones':
        event.target.bindPopup(event.target.feature.properties.IDCAR);
        break;
      case 'corpoBoyaca':
        event.target.bindPopup(
          `Bioma: ${event.target.feature.properties.BIOMA_IAvH}<br>Factor de compensación: ${event.target.feature.properties.FC_Valor}`,
        );
        break;
      default:
        break;
    }
    if (!L.Browser.ie && !L.Browser.opera) feature.bringToFront();
  }

  resetHighlight = (event, layer) => {
    const feature = event.target;
    const { layers } = this.state;
    layers[layer].resetStyle(feature);
  }

  clickFeature = (event, parentLayer) => {
    // TODO: Activate bioma inside dotsWhere and dotsWhat
    this.highlightFeature(event);
    if (parentLayer === 'corpoBoyaca') this.handleClickOnArea(event);
  }

  /**
   * When a click event occurs on a bioma layer in the searches module,
   *  request info by szh on that bioma
   *
   * @param {Object} event event object
   */
  handleClickOnArea = (event) => {
    const bioma = event.target.feature.properties.BIOMA_IAvH;
    ElasticAPI.requestBiomaBySZH(bioma)
      .then((res) => {
        this.setState(prevState => ({
          geojsonCapa4: bioma,
          activeLayers: {
            ...prevState.activeLayers,

          },
          basinData: res,
        }));
      });
    // TODO: When the promise is rejected, we need to show a "Data not available" error
    // (in the table). But the application won't break as it currently is
  }

  /** ****************************** */
  /** LISTENERS FOR SELECTOR CHANGES */
  /** ****************************** */
  firstLevelChange = (nombre) => {
    this.setState({
      geojsonCapa1: nombre,
    });
  }

  secondLevelChange = (name) => {
    const { layers } = this.state;
    this.setState((prevState) => {
      const layerStatus = prevState.activeLayers[name];
      const newState = { ...prevState };
      if (layers[name]) newState.activeLayers[name] = !layerStatus;

      newState.geojsonCapa2 = name;
      return newState;
    });
  }

  innerElementChange = (nameToOff, nameToOn) => {
    const { layers } = this.state;
    this.setState((prevState) => {
      const newState = { ...prevState };
      if (layers) {
        if (layers[nameToOff]) newState.activeLayers[nameToOff] = false;
        if (layers[nameToOn]) {
          newState.activeLayers[nameToOn] = true;
          newState.activeLayerName = nameToOn;
        }
      }

      newState.geojsonCapa3 = nameToOn;
      return newState;
    });
  }

  /** ***************************************** */
  /** LISTENER FOR BACK BUTTON ON LATERAL PANEL */
  /** ***************************************** */

  // TODO: Return from bioma to jurisdicción
  handlerBackButton = () => {
    this.setState((prevState) => {
      let newState = { ...prevState };
      const { layers } = prevState;
      if (Object.keys(layers).length !== 0) {
        newState.activeLayers.jurisdicciones = false;
        newState.activeLayers.corpoBoyaca = false;
      }
      newState = {
        ...newState,
        basinData: null,
        geojsonCapa2: null,
        geojsonCapa3: null,
        geojsonCapa4: null,
        activeLayerName: null,
      };
      return newState;
    });
  }

  render() {
    const {
      geojsonCapa1, geojsonCapa2, geojsonCapa3, geojsonCapa4, activeLayerName,
      layers, activeLayers, basinData,
    } = this.state;
    return (
      <div>
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            activeLayers={activeLayers}
            capasMontadas={[
              geojsonCapa1,
              geojsonCapa2,
              geojsonCapa3,
              geojsonCapa4]}
          />
          <div className="contentView">
            { !activeLayerName && (
              <Selector
                handlers={[
                  this.firstLevelChange,
                  this.secondLevelChange,
                  this.innerElementChange,if (feature.properties.FC_Valor) {
      return { // low
        stroke: false, fillColor: colors[1], opacity: 0.6, fillOpacity: 0.6,
      };
    }
                ]}
                description={description}
                data={selectorData}
                expandedId={0}
                iconClass="iconsection"
              />
            )}
            { activeLayerName && (
            <Drawer
              basinData={basinData}
              basinName={activeLayerName.NOMCAR || activeLayerName}
              handlerBackButton={this.handlerBackButton}
              layerName={geojsonCapa4}
              subAreaName={geojsonCapa2}
            />
            )}
          </div>
        </div>
        <Footer showLogos={false} />
      </div>
    );
  }
}

export default Search;
