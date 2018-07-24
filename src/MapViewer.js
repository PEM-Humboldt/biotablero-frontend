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
    this.setGeoJSONLayer = this.setGeoJSONLayer.bind(this);
    this.cargarCapaGeoJSON = this.cargarCapaGeoJSON.bind(this);

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
    const capas = [{ nombre: 'Jurisdicciones',
      url: 'http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:jurisdicciones_low&maxFeatures=50&outputFormat=application%2Fjson',
      capa: null,
    },
    {
      nombre: 'CORPOBOYACA',
      url: `http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Corpoboyaca-Biomas-IaVH-1&maxFeatures=50&outputFormat=application%2Fjson`,
      // url: `http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Corpoboyaca-agrupado&maxFeatures=50&outputFormat=application%2Fjson`,
      capa: null,
    }];
    return capas;
  }

	mostrarCapa(capa, estado){
    if(estado === false){ // Si estado === false : Ocultar capa
      this.mapRef.current.leafletElement.removeLayer(capa);
    }
    else{ // Mostrar capa
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
    console.log('this.props.capasMontadas[1]: '+this.props.capasMontadas[1]);
      console.log('this.props.capasMontadas[2]: '+this.props.capasMontadas[2]);
    console.log('highlightFeature:' +JSON.stringify(e.target.feature.properties));
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
	}

	mifunc2(e){
    if(this.props.capasMontadas[2]!== null){
      this.props.biomaActivo(e.target.feature.properties.BIOMA_IAvH);
    }
	}

  // TODO: Cambiar método de carga, para forzar carga sincrónica de axios
  //  revisando la carga
  setGeoJSONLayer(URL) {
    let capa = null;
    axios.get(URL)
      .then((res) => {
        capa = res.data;
        this.setState({ geoJsonLayer: capa,
          // geoJsonLayerAvailable: [...this.state.geoJsonLayerAvailable, capa]
        });
        if (this.state.geoJsonLayer
              .features[0].id==='jurisdicciones_low.1'){
          this.CapaJurisdicciones=L.geoJSON(this.state.geoJsonLayer,
            {
              style:
              {
                color:'#e84a5f', weight: 0.5, fillColor:'#ffd8e2', opacity:0.6,fillOpacity:0.4
            },
            onEachFeature:this.hexagonosOnEachFeature,
          })
            .addTo(this.mapRef.current.leafletElement);
          this.mostrarCapa(this.CapaJurisdicciones, false);
        }
        if (this.state.geoJsonLayer
          .features[0].id==='Corpoboyaca-Biomas-IaVH-1.1'){
          this.CapaCorpoBoyaca=L.geoJSON(this.state.geoJsonLayer,
            {
              style:
              {
            stroke:false, fillColor:'#7b56a5',opacity:0.6,fillOpacity:0.4
          },
          onEachFeature:this.onEachFeature,
        })
        .addTo(this.mapRef.current.leafletElement);
          this.mostrarCapa(this.CapaCorpoBoyaca, false);
        }
        if (this.state.geoJsonLayer
          .features[0].id==='Sogamoso_84.1'){
          this.CapaSogamoso=L.geoJSON(this.state.geoJsonLayer,
            {
              style:
              {
            stroke:true, fillColor:'#56a58e',opacity:0.6,fillOpacity:0.4
          },
          onEachFeature:this.hexagonosOnEachFeature,
        })
        .addTo(this.mapRef.current.leafletElement);
          this.mostrarCapa(this.CapaSogamoso, false);
        }
      })
  }

  cargarCapaGeoJSON(URL_JSON){
    // TODO: Centralizar la carga de capas en esta función
    const res = axios.get(URL_JSON).then((r)=>{return r;});
    // console.log("cargarCapaGeoJSON(URL_JSON): "+ JSON.stringify(res.data));
    this.setState({
      geoJsonLayer: res.data,
      geoJsonLayerAvailable: [...this.state.geoJsonLayerAvailable, res.data]
    });
    console.log('Capas disponibles: '+ JSON.stringify(this.state.geoJsonLayerAvailable[0].features[0].id));
    if(this.state.geoJsonLayerAvailable[1]){
      console.log('Capas disponibles: '+ JSON.stringify(this.state.geoJsonLayerAvailable[1].features[1].id));
    }
  }

  componentWillMount() {
    // this.cargarCapaGeoJSON('http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:jurisdicciones_low&maxFeatures=50&outputFormat=application%2Fjson');
    // this.cargarCapaGeoJSON('http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Corpoboyaca-Biomas-IaVH-1&maxFeatures=50&outputFormat=application%2Fjson');
    // this.setState({
    //   capasMontadas: local,
    // });
    // TODO: Iniciar la carga del módulo de consultas con la capa / imagen
    //  de las 4 regiones precargada y que permita elegir la jurisdicción
    //  sobre el mapa.
    this.CapaJurisdicciones=null;
    this.CapaCorpoBoyaca=null;
    this.CapaSogamoso=null;
    // TODO: Manejar la promesa, para que espere las capas a cargar
    this.setGeoJSONLayer('http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:jurisdicciones_low&maxFeatures=50&outputFormat=application%2Fjson');
    this.setGeoJSONLayer(`http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Corpoboyaca-Biomas-IaVH-1&maxFeatures=50&outputFormat=application%2Fjson`);
    this.setGeoJSONLayer(`http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Sogamoso_84&maxFeatures=50&outputFormat=application%2Fjson`);

    // this.setGeoJSONLayer(`http://192.168.205.192:8080/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:Corpoboyaca-agrupado&maxFeatures=50&outputFormat=application%2Fjson`);
    // this.setGeoJSONLayer(this.state.capasMontadas[1].url);
  }

  componentDidUpdate() {

    // adevia - Comentarios: Esta función se ejecuta siempre que hay evento en el componente MapViewer
    // Verificadores de capa seleccionada en el selector
    if(this.props.capasMontadas[1] === 'Jurisdicciones') {
      this.mostrarCapa(this.CapaJurisdicciones, true);
      this.mostrarCapa(this.CapaCorpoBoyaca, false);
    }
    if(this.props.capasMontadas[2] ==='CORPOBOYACA') {
        // || (this.props.capasMontadas[0] && this.props.capasMontadas[2].feature.properties.IDCAR ==='CORPOBOYACA')
      this.mostrarCapa(this.CapaCorpoBoyaca, true);
      this.mostrarCapa(this.CapaJurisdicciones, false);
    } else if (this.CapaCorpoBoyaca!==null
      && this.props.capasMontadas[1] === null){
      this.mostrarCapa(this.CapaCorpoBoyaca, false);
      this.mostrarCapa(this.CapaJurisdicciones, false);
    } if (this.CapaSogamoso !== null && this.props.capasMontadas[2] === 'Sogamoso'){
      this.mostrarCapa(this.CapaSogamoso, true);
      // TODO: Implementar arreglo "capasActivas" para evitar crear por cada capa, un mostrarCapa(capa, false)
        if (this.CapaCorpoBoyaca !== null && this.CapaJurisdicciones !== null){ // Esto se hace al ser la capa más pesada en descargar
          this.mostrarCapa(this.CapaCorpoBoyaca, false);
          this.mostrarCapa(this.CapaJurisdicciones, false);
      }
    }
  }

  hexagonosOnEachFeature(feature, layer){
    layer.on(
      {
        mouseover : this.highlightFeature,
        mouseout : this.resetHighlight,
        click : this.mifunc
      }
    );
  }

	onEachFeature(feature, layer){
		layer.on(
			{
				mouseover : this.highlightFeature,
				mouseout : this.resetHighlight2,
				click : this.mifunc2
			}
		);
	}

  getStyle(feature, layer) {
    //TODO: Ajustar función de estilo para pasarala a componentes react-leaflet
    console.log('Si entré a estilo');
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
    <WMSTileLayer
     layers='Biotablero:Regiones_geb'
     url={"http://192.168.205.192:8080/geoserver/Biotablero/wms?service=WMS"}
     opacity={0.2} alt={"Regiones"}/>
  </Map>
);}
}

export default MapViewer;
