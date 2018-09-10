/** eslint verified */
// TODO: Manejar capas activas. Hacer síncrono la carga del Selector (elementos
//  activos), con los elementos cargados
import React, { Component } from 'react';

import L from 'leaflet';
import MapViewer from './MapViewer';
import Selector from './Selector';
import Drawer from './search/Drawer';
import ElasticAPI from './api/elastic';
import GeoServerAPI from './api/geoserver';
import { description, selectorData } from './search/assets/selectorData';
import Layout from './Layout';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: {},
      subAreaName: null,
      layerName: null,
      basinData: null,
      activeLayerName: null,
      activeLayers: null,
      colors: ['#d49242',
        '#e9c948',
        '#b3b638',
        '#acbf3b',
        '#92ba3a',
        '#70b438',
        '#5f8f2c',
        '#667521',
        '#75680f',
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
      this.setState(prevState => ({
        layers: {
          ...prevState.layers,
          // the key is the id that communicates with other components and should match selectorData
          jurisdicciones: {
            displayName: 'Jurisdicciones',
            active: false,
            layer: L.geoJSON(
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
          },
          // the key is the id that communicates with other components and should match selectorData
          corpoBoyaca: {
            displayName: 'CorpoBoyaca',
            active: false,
            layer: L.geoJSON(
              res[1],
              {
                style: this.featureStyle,
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'corpoBoyaca')
                ),
              },
            ),
          },
        },
      }));
    }); // We don't need a catch, because on error we must literally do nothing
  }

  /**
   * Choose the right color for the bioma inside the map, according
   *  with colorsFC state
   *
   * @param {Object} feature target object
   */
  featureStyle = (feature) => {
    const { colorsFC } = this.state;
    const valueFC = Math.min((Math.ceil((feature.properties.FC_Valor * 10) / 5) * 5) / 10, 10);
    const colorFound = Object.values(colorsFC.find(obj => Number(Object.keys(obj)) === valueFC));
    const styleReturn = {
      stroke: false,
      fillColor: colorFound,
      fillOpacity: 0.7,
    };
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
        point.bindPopup(
          `<b>${point.feature.properties.IDCAR}</b><br>${point.feature.properties.NOMCAR}`,
        );
        break;
      case 'corpoBoyaca':
        point.bindPopup(`<b>Bioma:</b> ${point.feature.properties.BIOMA_IAvH}<br><b>Factor de compensación:</b> ${point.feature.properties.FC_Valor}`);
        break;
      default:
        break;
    }
    if (!L.Browser.ie && !L.Browser.opera) point.bringToFront();
  }

  resetHighlight = (event, parentLayer) => {
    const feature = event.target;
    const { layers } = this.state;
    layers[parentLayer].layer.resetStyle(feature);
    if (parentLayer === 'jurisdicciones') feature.closePopup();
  }

  clickFeature = (event, parentLayer) => {
    // TODO: Activate bioma inside dotsWhere and dotsWhat
    // TODO: Create function for jurisdicciones layer
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
          this.setState({
            layerName: bioma,
            basinData: res,
          });
        });
      // TODO: When the promise is rejected, we need to show a "Data not available" error
      // (in the table). But the application won't break as it currently is
    }

  /** ****************************** */
  /** LISTENERS FOR SELECTOR CHANGES */
  /** ****************************** */
  secondLevelChange = (name) => {
    const { layers } = this.state;
    this.setState((prevState) => {
      const newState = { ...prevState };
      if (layers[name]) {
        newState.layers[name].active = !prevState.layers[name].active;
        newState.subAreaName = newState.layers[name].displayName;
      }

      return newState;
    });
  }

  innerElementChange = (nameToOff, nameToOn) => {
    const { layers } = this.state;
    this.setState((prevState) => {
      const newState = { ...prevState };
      if (layers[nameToOff]) newState.layers[nameToOff].active = false;
      if (layers[nameToOn]) {
        newState.layers[nameToOn].active = true;
        newState.activeLayerName = newState.layers[nameToOn].displayName;
      }

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
      Object.keys(layers).forEach((layerKey) => {
        newState.layers[layerKey].active = false;
      });

      newState = {
        ...newState,
        basinData: null,
        subAreaName: null,
        layerName: null,
        activeLayerName: null,
      };
      return newState;
    });
  }

  render() {
    const {
      subAreaName, layerName, activeLayerName, basinData, colors, colorsFC, colorSZH, layers,
    } = this.state;
    return (
      <Layout
        moduleName="Consultas"
        showFooterLogos={false}
      >
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            geoServerUrl={GeoServerAPI.getRequestURL()}
          />
          <div className="contentView">
            { !activeLayerName && (
              <Selector
                handlers={[
                  () => {},
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
              layerName={layerName}
              subAreaName={subAreaName}
            />
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

export default Search;
