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
      colors: ['#d49242',
        '#e9c948',
        '#b3b638',
        '#acbf3b',
        '#92ba3a',
        '#70b438',
        '#5f8f2c',
        '#59651f',
        '#62591e',
        '#7b6126'],
      colorSZH: ['#345b6b'],
      colorsFC: [
        { 4: '#7b56a5' },
        { 4.5: '#6256a5' },
        { 5: '#5564a4' },
        { 5.5: '#4a8fb8' },
        { 6: '#51b4c1' },
        { 6.5: '#81bb47' },
        { 7: '#a4c051' },
        { 7.5: '#b1b559' },
        { 8: '#eabc47' },
        { 8.5: '#d5753d' },
        { 9: '#ea5948' },
        { 9.5: '#ea495f' },
        { 10: '#c3374d' },
      ],
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
    const { colorsFC } = this.state;
    const valueFC = Math.min((Math.floor((feature.properties.FC_Valor * 10) / 5) * 5) / 10, 10);
    const colorFound = colorsFC.map(obj => Object.keys(obj)[0])[valueFC];
    const styleReturn = {
      stroke: false,
      fillColor: colorFound,
      fillOpacity: 1,
    };
    console.log('valueFC', valueFC, 'style', styleReturn);
    console.log('color', colorsFC.map(obj => Object.values(obj)[0])[valueFC]);
    console.log('color1', colorsFC.map(obj => Object.values(obj)[0]));
    colorsFC.find((obj) => {
      console.log('color2', Object.values(obj));
      if (Object.keys(obj) === valueFC) return Object.values(obj);
      return false;
    });
    return styleReturn;
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
    const point = event.target;
    point.setStyle({
      weight: 1,
      fillOpacity: 1,
    });
    switch (parentLayer) {
      case 'jurisdicciones':
        point.bindPopup(point.feature.properties.IDCAR);
        break;
      case 'corpoBoyaca':
        point.bindPopup(
          `Bioma: ${point.feature.properties.BIOMA_IAvH}<br>Factor de compensación: ${point.feature.properties.FC_Valor}`,
        );
        break;
      default:
        break;
    }
    if (!L.Browser.ie && !L.Browser.opera) point.bringToFront();
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
      layers, activeLayers, basinData, colors, colorsFC, colorSZH,
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
                  this.innerElementChange,
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
              colors={colors}
              colorsFC={colorsFC.map(obj => Object.values(obj)[0])} // Sort appropriately the colors
              colorSZH={colorSZH}
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
