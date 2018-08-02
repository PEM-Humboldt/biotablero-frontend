// TODO: Estilos diferentes entre elementos de cada capa
// TODO: Organizar eventos, para que no dependa del tipo de capa, sino que sea genérico
// TODO: Manejar capas activas. Hacer síncrono la carga del Selector (elementos activos), con los elementos cargados

import React from 'react';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, WMSTileLayer } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
// TODO: Recibir esta información JSON
// import datosJSON from './data/biomas-iavh-szh.json';

let config = {};
config.params = {
  center: [5.2500,-74.9167],//Mariquita-Tolima
};

class MapViewer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      map: null,
      tileLayer: null,
      geoJsonLayerAvailable: [],
      geoJson: null,
    };

    this.CapaJurisdicciones=null;
    this.CapaCorpoBoyaca=null;
    this.CapaSogamoso=null;
    this.CapaBiomasSogamoso=null;

    this.onEachFeature = this.onEachFeature.bind(this);
    this.hexagonosOnEachFeature = this.hexagonosOnEachFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.resetHighlight2 = this.resetHighlight2.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.mifunc = this.mifunc.bind(this);
    this.mifunc2 = this.mifunc2.bind(this);
    this.capasDisponibles = this.capasDisponibles.bind(this);
    // TODO: Analizar estrategia con props.capasMontadas y props.capaActiva
    // const capasCargadas = null;
  }

  mapRef = React.createRef();

  capasDisponibles(){
    // TODO: Crear arreglo de objetos de las capas disponibles y a cargar,
    // pero recibido desde el arreglo de capas, como una propiedad
    const capas = [
      { nombre: 'Jurisdicciones',
        url: 'http://192.168.11.63:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:jurisdicciones_low&maxFeatures=50&outputFormat=application%2Fjson',
        capa: null,
      },
      {
        nombre: 'CORPOBOYACA',
        url: `http://192.168.11.63:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Corpoboyaca-Biomas-IaVH-1&maxFeatures=50&outputFormat=application%2Fjson`,
        // url: `http://192.168.11.63:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Corpoboyaca-agrupado&maxFeatures=50&outputFormat=application%2Fjson`,
        capa: null,
      }
    ];
    return capas;
  }

  mostrarCapa(capa, estado){
    if(estado === false){ // Si estado === false : Ocultar capa
      this.mapRef.current.leafletElement.removeLayer(capa);
    }
    else{ // Mostrar capa
      // TODO: Ajustar límites y agregar función .setView()
      // let bounds =
      this.mapRef.current.leafletElement.addLayer(capa);
    }
  }

  highlightFeature(e){
    var layer = e.target;
    if(e.target.feature.properties.IDCAR !== 'CORPOBOYACA')
    e.target.bindPopup(e.target.feature.properties.IDCAR);
    layer.setStyle(
      {
        weight : 1,
        fillOpacity : 1
      }
    );
    if(!L.Browser.ie && !L.Browser.opera){
      layer.bringToFront();
    }
    if(e.target.feature.properties.IDCAR === 'CORPOBOYACA')
    e.target.bindPopup("Bioma: "+ e.target.feature.properties.BIOMA_IAvH
    +"<br>Factor de compensación: " + e.target.feature.properties.FC_Valor);
  }

  resetHighlight(e){
    this.CapaJurisdicciones.resetStyle(e.target);
  }

  resetHighlight2(e){
    this.CapaCorpoBoyaca.resetStyle(e.target);
  }

  mifunc(e){
    if(e.target.feature.properties.IDCAR==="CORPOBOYACA"){
      this.mostrarCapa(this.CapaCorpoBoyaca, true);
      this.mostrarCapa(this.CapaJurisdicciones, false);
      this.props.capaActiva('CORPOBOYACA');
    }
    this.resetHighlight(e);
  }

  mifunc2(e){
    if(this.props.capasMontadas[2]!== null){
      this.props.biomaActivo(e.target.feature.properties.BIOMA_IAvH);
    }
    this.resetHighlight2(e);
  }

  /**
   * Fucntion to load necessary layers from GeoServer
   *
   * @param layerName string identifier to store the layer data into a variable
   * @param URL string endpoint to request the given layer
   */
  setGeoJSONLayer = (layerName, URL) => {
    return axios.get(URL, {
      method: 'HEAD',
      'Access-Control-Allow-Origin': '*',
    }).then((res) => {
      const layerResult = res.data
      switch (layerName) {
        case 'jurisdicciones':
          this.CapaJurisdicciones = L.geoJSON(
            layerResult,
            {
              style: { color:'#e84a5f', weight: 0.5, fillColor:'#ffd8e2', opacity:0.6,fillOpacity:0.4 },
              onEachFeature: this.hexagonosOnEachFeature,
            }
          ).addTo(this.mapRef.current.leafletElement);
          this.mostrarCapa(this.CapaJurisdicciones, false);
        break;
        case 'Corpoboyaca':
          this.CapaCorpoBoyaca=L.geoJSON(
            layerResult,
            {
              style: { stroke:false, fillColor:'#7b56a5',opacity:0.6,fillOpacity:0.4 },
              onEachFeature:this.onEachFeature,
            }
          ).addTo(this.mapRef.current.leafletElement);
          this.mostrarCapa(this.CapaCorpoBoyaca, false);
        break;
        case 'Sogamoso':
          this.CapaSogamoso=L.geoJSON(
            layerResult,
            {
              style: { stroke:true, color:'#ea495f', fillColor:'#ea495f',opacity:0.6,fillOpacity:0.4 },
              onEachFeature:this.hexagonosOnEachFeature,
            }
          ).addTo(this.mapRef.current.leafletElement);
          this.mostrarCapa(this.CapaSogamoso, false);
        break;
        case 'Sogamoso_Biomas':
          this.CapaBiomasSogamoso=L.geoJSON(
            layerResult,
            {
              style: { stroke:false, fillColor:'#7b56a5',opacity:0.6,fillOpacity:0.4 },
              onEachFeature:this.hexagonosOnEachFeature,
            }
          ).addTo(this.mapRef.current.leafletElement);
          this.mostrarCapa(this.CapaBiomasSogamoso, false);
        break;
        default:
          return;
      }
    });
  }

  componentDidMount() {
    Promise.all([
      this.setGeoJSONLayer('Sogamoso_Biomas', 'http://192.168.11.63:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Sogamoso_Biomas&maxFeatures=50&outputFormat=application%2Fjson'),
      this.setGeoJSONLayer('jurisdicciones', 'http://192.168.11.63:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:jurisdicciones_low&maxFeatures=50&outputFormat=application%2Fjson'),
      this.setGeoJSONLayer('Corpoboyaca', 'http://192.168.11.63:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Corpoboyaca-Biomas-IaVH-1&maxFeatures=50&outputFormat=application%2Fjson'),
      this.setGeoJSONLayer('Sogamoso', 'http://192.168.11.63:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Sogamoso_84&maxFeatures=50&outputFormat=application%2Fjson')
    ]).then(() => this.forceUpdate())
  }

  componentDidUpdate() {
    // adevia - Comentarios: Esta función se ejecuta siempre que hay evento en el componente MapViewer
    // Verificadores de capa seleccionada en el selector
    if(this.CapaJurisdicciones !== null && this.CapaCorpoBoyaca !== null
      && this.props.capasMontadas[1] === 'Jurisdicciones') {
      this.mostrarCapa(this.CapaJurisdicciones, true);
      this.mostrarCapa(this.CapaCorpoBoyaca, false);
    }
    if(this.CapaCorpoBoyaca !== null && this.CapaJurisdicciones !== null
      && this.props.capasMontadas[2] ==='CORPOBOYACA') {
      // || (this.props.capasMontadas[0] && this.props.capasMontadas[2].feature.properties.IDCAR ==='CORPOBOYACA')
      this.mostrarCapa(this.CapaCorpoBoyaca, true);
      this.mostrarCapa(this.CapaJurisdicciones, false);
    } else if (this.CapaCorpoBoyaca!== null && this.CapaJurisdicciones !== null
      && this.props.capasMontadas[1] === null) {
      this.mostrarCapa(this.CapaCorpoBoyaca, false);
      this.mostrarCapa(this.CapaJurisdicciones, false);
    }
    if (this.CapaSogamoso !== null
      && this.props.capasMontadas[2] === 'Sogamoso') {
      this.mostrarCapa(this.CapaSogamoso, true);
      // TODO: Implementar arreglo "capasActivas" para evitar crear por cada capa, un mostrarCapa(capa, false)
      if (this.CapaCorpoBoyaca !== null
        && this.CapaJurisdicciones !== null){ // Esto se hace al ser la capa más pesada en descargar
        this.mostrarCapa(this.CapaCorpoBoyaca, false);
        this.mostrarCapa(this.CapaJurisdicciones, false);
        this.mostrarCapa(this.CapaBiomasSogamoso, true);
      }
    }
  }

  hexagonosOnEachFeature(feature, layer){
    layer.on(
      {
        mouseover : this.highlightFeature,
        mouseout : this.resetHighlight,
        click : this.mifunc,
      }
    );
  }

  onEachFeature(feature, layer){
    layer.on(
      {
        mouseover : this.highlightFeature,
        mouseout : this.resetHighlight2,
        click : this.mifunc2,
      }
    );
  }

  getStyle(feature, layer) {
    //TODO: Ajustar función de estilo para pasarala a componentes react-leaflet
    return {
      color: '#006400',
      weight: 5,
      opacity: 0.65
    }
  }

  render () {
    // const layerStyle = this.getStyle();
    // TODO: Ajustar el zoom para que tenga límites sobre el mapa
    return (
      <Map ref={this.mapRef} center={config.params.center} zoom={5.5} onClick={this.onMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {/* TODO: Mostrar bajo este formato los raster de cada estrategia de Compensaciones
          <WMSTileLayer srs={ 'EPSG:4326' }
                    layers='Biotablero:strategy_sogamoso_111_1_c'
                    url={"http://192.168.11.63:8080/geoserver/Biotablero/wms?service=WMS&styles=raster_strategy"}
                    opacity={1} alt={"Regiones"} styles={"raster_strategy"} format={'image/png'} transparent={true}/> */}
        <WMSTileLayer
          layers='Biotablero:Regiones_geb'
          url={"http://192.168.11.63:8080/geoserver/Biotablero/wms?service=WMS"}
          opacity={0.2} alt={"Regiones"}/>
        </Map>
    );
  }
}

export default MapViewer;
