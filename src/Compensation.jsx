// TODO: Ajustar transiciones en proyecto HOME y embeber este proyecto
import React, { Component } from 'react';
// import Viewfinder from './Viewfinder';
import L from 'leaflet';
import MapViewer from './MapViewer';
import ProjectFilter from './compensation/ProjectFilter';
import Footer from './Footer';

import ElasticAPI from './api/elastic';
import GeoServerAPI from './api/geoserver';

class Compensation extends Component {
    constructor (props){
    super(props);
    this.state = {
      hasShape: false,
      test: null,
      geojsonCapa1: null,
      geojsonCapa2: null,
      geojsonCapa3: null,
      geojsonCapa4: null,
      ubicacionMapa: null,
      infoCapaActiva: null,
      layers: null,
      activeLayers: null,
    };
    this.actualizarCapaActiva = this.actualizarCapaActiva.bind(this);
    this.eventoDelMapa = this.eventoDelMapa.bind(this);
  }

  componentDidMount() {
    Promise.all([
      GeoServerAPI.requestSogamoso(),
      GeoServerAPI.requestBiomasSogamoso(),
    ]).then((res) => {
      this.setState(prevState => (
        {
          layers: {
            ...prevState.layers,
            sogamoso: L.geoJSON(
              res[0],
              {
                style: {
                  stroke: true,
                  color: '#ea495f',
                  fillColor: '#ea495f',
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
                style: {
                  stroke: false, fillColor: '#7b56a5', opacity: 0.6, fillOpacity: 0.4,
                },
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'biomasSogamoso')
                ),
              },
            ),
          },
        }
      ));
    });
  }

  featureActions = (feature, layer, parentLayer) => {
    layer.on(
      {
        mouseover: this.highlightFeature,
        mouseout: e => this.resetHighlight(e, parentLayer),
        click: this.clickFeature,
      },
    );
  }

  highlightFeature = (event) => {
    const feature = event.target;
    feature.setStyle({
      weight: 1,
      fillOpacity: 1,
    });
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

  handlerBackButton = () => {
    this.setState(prevState => (
      {
        activeLayers: {
          ...prevState.activeLayers,
          sogamoso: false,
          biomasSogamoso: false,
        },
        geojsonCapa3: null,
        infoCapaActiva: null,
      }
    ));
  }

  panelLayer = (nombre) => {
    this.setState({
      geojsonCapa1: nombre,
    });
  }

  subPanelLayer = (nombre) => {
    this.setState({
      geojsonCapa2: nombre,
    });
  }

  innerPanelLayer = (name) => {
    this.setState(prevState => (
      {
        activeLayers: {
          ...prevState.activeLayers,
          sogamoso: true,
          biomasSogamoso: true,
        },
        geojsonCapa3: name,
        infoCapaActiva: name,
      }
    ));
  }

  eventoDelMapa(latLong){
    this.setState({
      ubicacionMapa: latLong,
    });
  }

  actualizarCapaActiva(campo){
    this.setState({
      geojsonCapa3: campo,
      infoCapaActiva: campo,
    });
  }

  actualizarBiomaActivo = (campo) => {
    ElasticAPI.requestDondeCompensarSogamoso(campo)
      .then((res) => {
        this.setState({
          geojsonCapa4: campo,
          datosSogamoso: res
        });
      });
  }

  render() {
    return (
      <div>
        <div className="appSearcher">
          <MapViewer
            layers = {this.state.layers}
            activeLayers = {this.state.activeLayers}
          />
            <div className="contentView">
              <ProjectFilter panelLayer = {this.panelLayer}
                subPanelLayer = {this.subPanelLayer}
                innerPanelLayer = {this.innerPanelLayer}
                dataCapaActiva={this.state.infoCapaActiva}
                handlerBackButton= {this.handlerBackButton}
                // actualizarCapaActiva= {this.actualizarCapaActiva}
                actualizarBiomaActivo={this.actualizarBiomaActivo}
                geocerca= {this.state.geojsonCapa2}
                subArea={this.state.geojsonCapa4}
                datosSogamoso={this.state.datosSogamoso}
                zonageb={'GEB Centro'}
              />
            </div>
          </div>
        <Footer showLogos={false}/>
      </div>
    );
  }
}

export default Compensation;
