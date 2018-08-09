// TODO: Ajustar transiciones en proyecto HOME y embeber este proyecto
import React, { Component } from 'react';
// import Viewfinder from './Viewfinder';
import MapViewer from './MapViewer';
import Filter from './searcher/Filter';
import './searcher/searcher.css';

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
    };
    this.panelLayer = this.panelLayer.bind(this);
    this.subPanelLayer = this.subPanelLayer.bind(this);
    this.innerPanelLayer = this.innerPanelLayer.bind(this);
    this.actualizarCapaActiva = this.actualizarCapaActiva.bind(this);
    this.eventoDelMapa = this.eventoDelMapa.bind(this);
  }

  panelLayer(nombre){
    this.setState({
      test: 'Biotablero',
      geojsonCapa1: nombre,
    });
  }

  subPanelLayer(nombre){
    this.setState({
      test: 'Biotablero',
      geojsonCapa2: nombre,
    });
    // console.log('subPanel: ' + nombre);
  }

  innerPanelLayer(nombre){
    this.setState({
      test: 'Biotablero',
      geojsonCapa3: nombre,
      infoCapaActiva: nombre,
    });
    // console.log('innerPanel: ' + nombre);
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
    let layer = this.state.geojson;
    return (
      <div className="appSearcher">
        <MapViewer mostrarJSON={layer}
          capasMontadas={[
                this.state.geojsonCapa1,
                this.state.geojsonCapa2,
                this.state.geojsonCapa3,
                this.state.geojsonCapa4]}
          capaActiva={this.actualizarCapaActiva}
          setBiomaActivo={this.actualizarBiomaActivo}
        />
        <div className="contentView">
          <Filter panelLayer = {this.panelLayer}
            subPanelLayer = {this.subPanelLayer}
            innerPanelLayer = {this.innerPanelLayer}
            dataCapaActiva={this.state.infoCapaActiva}
            actualizarCapaActiva= {this.actualizarCapaActiva}
            geocerca= {this.state.geojsonCapa2}
            biomaActivo={this.state.geojsonCapa4}
            biomaActivoData={this.state.biomaActivoData}
          />
        </div>
      </div>
    );
  }
}

export default Searcher;
