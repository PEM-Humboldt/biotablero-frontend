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
  constructor(props){
    super(props);
    this.state = {
      hasShape: false,
      test: null,
      geojsonCapa1: null,
      geojsonCapa2: null,
      geojsonCapa3: null,
      geojsonCapa4: null,
      biomaActivoData: null,
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
                // onEachFeature: (feature, layer) => (
                //   this.featureActions(feature, layer, 'jurisdicciones')
                // ),
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
                // onEachFeature: (feature, layer) => (
                //   this.featureActions(feature, layer, 'corpoBoyaca')
                // ),
              },
            ),
          },
        }
      ));
    });
  }

  handlerBackButton = () => {
    this.setState(prevState => (
      {
        activeLayers: {
          ...prevState.activeLayers,
          jurisdicciones: false,
          corpoBoyaca: false,
        },
        biomaActivoData: null,
        geojsonCapa2: null,
        geojsonCapa3: null,
        geojsonCapa4: null,
        infoCapaActiva: null,
      }
    ));
  }

  panelLayer = (nombre) => {
    this.setState({
      geojsonCapa1: nombre,
    });
  }

  subPanelLayer = (name) => {
    this.setState(prevState => {
      const { jurisdicciones } = prevState.activeLayers;
      return {
        activeLayers: {
          ...prevState.activeLayers,
          jurisdicciones: !jurisdicciones,
        },
        geojsonCapa2: name,
      }
    });
  }

  innerPanelLayer = (name) => {
    this.setState(prevState => ({
      activeLayers: {
        ...prevState.activeLayers,
        jurisdicciones: false,
        corpoBoyaca: true,
      },
      geojsonCapa3: name,
      infoCapaActiva: name,
    }));
  }

  eventoDelMapa(latLong){
    this.setState({
      ubicacionMapa: latLong,
    });
  }

  actualizarCapaActiva(campo){
    if(campo===null){
      this.setState({
        geojsonCapa2: null,
        geojsonCapa3: null,
        infoCapaActiva: null,
      });
    } else {
      this.setState({
        infoCapaActiva: campo,
      });
    }
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
      biomaActivoData: data
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
            capaActiva={this.actualizarCapaActiva}
            setBiomaActivo={this.actualizarBiomaActivo}
          />
          <div className="contentView">
            <Filter
              handlerBackButton={this.handlerBackButton}
              panelLayer = {this.panelLayer}
              subPanelLayer = {this.subPanelLayer}
              innerPanelLayer = {this.innerPanelLayer}
              dataCapaActiva={this.state.infoCapaActiva}
              actualizarCapaActiva= {this.actualizarCapaActiva}
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
