// TODO: Ajustar transiciones en proyecto HOME y embeber este proyecto
import React, { Component } from 'react';
import MapViewer from './MapViewer';
import Filter from './Filter';
import './searcher.css';

class Searcher extends Component {
  constructor(props){
    super(props);
    this.state = {
      hasShape: false,
      test: null,
      geojsonCapa1: null,
      geojsonCapa2: null,
      geojsonCapa3: null,
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
    console.log('subPanel: ' + nombre);
  }

  innerPanelLayer(nombre){
    this.setState({
      test: 'Biotablero',
      geojsonCapa3: nombre,
      infoCapaActiva: nombre,
    });
    console.log('innerPanel: ' + nombre);
  }

  eventoDelMapa(latLong){
    this.setState({
      ubicacionMapa: latLong,
    });
  }

  actualizarCapaActiva(campo){
    console.log("capaActiva: "+ campo);
    this.setState({
      geojsonCapa3: campo,
      infoCapaActiva: campo,
    });
  }

  render() {
    let layer = this.state.geojson;
    let capasSeleccionadas = [
      this.state.geojsonCapa1,
      this.state.geojsonCapa2,
      this.state.geojsonCapa3,
      this.state.geojsonCapa4];
    return (
      <div className="appSearcher">
          <MapViewer mostrarJSON={layer}
            capasMontadas={capasSeleccionadas}
            capaActiva={this.actualizarCapaActiva}/>
        <div className="contentView">
          <Filter panelLayer = {this.panelLayer}
          subPanelLayer = {this.subPanelLayer}
          innerPanelLayer = {this.innerPanelLayer}
          dataCapaActiva={this.state.infoCapaActiva}
          actualizarCapaActiva= {this.actualizarCapaActiva}
        />
        </div>
      </div>
    );
  }
}

export default Searcher;
