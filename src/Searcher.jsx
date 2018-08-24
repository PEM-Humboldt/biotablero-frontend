// TODO: Ajustar transiciones en proyecto HOME y embeber este proyecto
import React, { Component } from 'react';
// import Viewfinder from './Viewfinder';
import L from 'leaflet';
import MapViewer from './MapViewer';
import Filter from './searcher/Filter';
import Footer from './Footer';
import './searcher/searcher.css';

import GeoServerAPI from './api/geoserver';

class Searcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasShape: false,
      test: null,
      geojsonCapa1: null,
      geojsonCapa2: null,
      geojsonCapa3: null,
      geojsonCapa4: null,
      biomaActivoData: null,
      infoCapaActiva: null,
      layers: null,
      activeLayers: null,
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
                style: {
                  stroke: false,
                  fillColor: '#7b56a5',
                  opacity: 0.6,
                  fillOpacity: 0.4,
                },
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

  clickFeature = (event) => {
    // TODO: Activate bioma inside dotsWhere and dotsWhat
    this.highlightFeature(event);
  }

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
        biomaActivoData: null,
        geojsonCapa2: null,
        geojsonCapa3: null,
        geojsonCapa4: null,
        infoCapaActiva: null,
      };
      return newState;
    });
  }

  panelLayer = (nombre) => {
    this.setState({
      geojsonCapa1: nombre,
    });
  }

  subPanelLayer = (name) => {
    const { layers } = this.state;
    this.setState((prevState) => {
      const layerStatus = prevState.activeLayers[name];
      const newState = { ...prevState };
      if (layers[name]) newState.activeLayers[name] = !layerStatus;

      newState.geojsonCapa2 = name;
      return newState;
    });
  }

  innerPanelLayer = (nameToOff, nameToOn) => {
    const { layers } = this.state;
    this.setState((prevState) => {
      const newState = { ...prevState };
      if (layers[nameToOff]) newState.activeLayers[nameToOff] = false;
      if (layers[nameToOn]) newState.activeLayers[nameToOn] = true;

      newState.geojsonCapa3 = nameToOn;
      newState.infoCapaActiva = nameToOn;
      return newState;
    });
  }

  /**
   * Update information about the active bioma
   *
   * @param {String} bioma bioma's name
   * @param {Object} data bioma's data (usually it's info about szh)
   */
  actualizarBiomaActivo = (bioma, data) => {
    this.setState({
      geojsonCapa4: bioma,
      biomaActivoData: data,
    });
  }

  render() {
    return (
      <div>
        <div className="appSearcher">
          <MapViewer
            layers = {this.state.layers}
            activeLayers = {this.state.activeLayers}
            capasMontadas={[
                  this.state.geojsonCapa1,
                  this.state.geojsonCapa2,
                  this.state.geojsonCapa3,
                  this.state.geojsonCapa4]}
            setBiomaActivo={this.actualizarBiomaActivo}
          />
          <div className="contentView">
            <Filter
              handlerBackButton={this.handlerBackButton}
              panelLayer = {this.panelLayer}
              subPanelLayer = {this.subPanelLayer}
              innerPanelLayer = {this.innerPanelLayer}
              dataCapaActiva={this.state.infoCapaActiva}
              actualizarBiomaActivo={this.actualizarBiomaActivo}
              geocerca= {this.state.geojsonCapa2}
              biomaActivo={this.state.geojsonCapa4}
              biomaActivoData={this.state.biomaActivoData}
            />
          </div>
        </div>
      <Footer showLogos={false}/>
    </div>
    );
  }
}

export default Searcher;
