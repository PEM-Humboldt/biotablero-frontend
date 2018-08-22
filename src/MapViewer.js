// TODO: Estilos diferentes entre elementos de cada capa
// TODO: Organizar eventos, para que no dependa del tipo de capa, sino que sea genérico
// TODO: Manejar capas activas. Hacer síncrono la carga del Selector (elementos
//  activos), con los elementos cargados

import React from 'react';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, WMSTileLayer } from 'react-leaflet';
import L from 'leaflet';

import ElasticAPI from './api/elastic';
// import GeoServerAPI from './api/geoserver';

const config = {};
config.params = {
  center: [5.2500, -74.9167], // Mariquita-Tolima
};

class MapViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: null,
    };

    this.mapRef = React.createRef();
    this.CapaJurisdicciones = null;
    this.CapaCorpoBoyaca = null;
    // this.CapaSogamoso = null;
    // this.CapaBiomasSogamoso = null;

    this.hexagonosOnEachFeature = this.hexagonosOnEachFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.resetHighlight2 = this.resetHighlight2.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.mifunc = this.mifunc.bind(this);
    // TODO: Analizar estrategia con props.capasMontadas y props.capaActiva
    // const capasCargadas = null;
  }

  /**
   *  Defines what layer to show and actions derivate from the selection
   *
   * @param {Object} layer receives leaflet object and e.target as the layer
   * @param {Boolean} state if it's false, then the layer should be hidden
   */
  showLayer = (layer, state) => {
    if (state === false) {
      this.mapRef.current.leafletElement.removeLayer(layer);
      this.mapRef.current.leafletElement.setView(config.params.center, 5);
    } else {
      this.mapRef.current.leafletElement.addLayer(layer);
      this.mapRef.current.leafletElement.fitBounds(layer.getBounds());
    }
  }

  mifunc(e) {
    console.log('es click?', e);
    if (e.target.feature.properties.IDCAR === "CORPOBOYACA") {
      this.showLayer(e.target, true);
      this.showLayer(this.CapaJurisdicciones, false);
      this.props.capaActiva('CORPOBOYACA');
    }
    this.resetHighlight(e);
  }

  // TODO: Esto lo deberíamos manejar desde el Search, porque es algo exclusivo del search
  /**
   * When a click event occurs on a bioma layer in the searches module,
   *  request info by szh on that bioma
   *
   * @param {Object} e event object
   */
  handleClickOnBioma = (e) => {
    const { capasMontadas, setBiomaActivo } = this.props;
    const secondLayer = capasMontadas[2];
    if (secondLayer !== null) {
      const bioma = e.target.feature.properties.BIOMA_IAvH;
      ElasticAPI.requestBiomaBySZH(bioma)
        .then((res) => {
          setBiomaActivo(bioma, res);
        });
    }
    this.resetHighlight2(e);
  }

  highlightFeature = (e) => {
    const layer = e.target;
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

  resetHighlight(e) {
    this.CapaJurisdicciones.resetStyle(e.target);
  }

  resetHighlight2(e) {
    this.CapaCorpoBoyaca.resetStyle(e.target);
  }

  componentDidUpdate() {
    if (this.props.activeLayers) {
      Object.keys(this.props.activeLayers).forEach((layerName) => {
        if (this.props.activeLayers[layerName]) this.showLayer(this.state.layers[layerName], true);
        else this.showLayer(this.state.layers[layerName], false);
      });
    }

    if(this.CapaJurisdicciones !== null && this.CapaCorpoBoyaca !== null
      && this.props.capasMontadas[1] === 'Jurisdicciones') {
      this.showLayer(this.CapaJurisdicciones, true);
      this.showLayer(this.CapaCorpoBoyaca, false);
    }
    if(this.CapaCorpoBoyaca !== null && this.CapaJurisdicciones !== null
      && this.props.capasMontadas[2] ==='CORPOBOYACA') {
      // || (this.props.capasMontadas[0] && this.props.capasMontadas[2].feature.properties.IDCAR ==='CORPOBOYACA')
      this.showLayer(this.CapaCorpoBoyaca, true);
      this.showLayer(this.CapaJurisdicciones, false);
    } else if (this.CapaCorpoBoyaca!== null && this.CapaJurisdicciones !== null
      && this.props.capasMontadas[1] === null) {
      this.showLayer(this.CapaCorpoBoyaca, false);
      this.showLayer(this.CapaJurisdicciones, false);
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

  onEachFeature = (feature, layer) => {
    layer.on(
      {
        mouseover : this.highlightFeature,
        mouseout : this.resetHighlight2,
        click : this.handleClickOnBioma
      }
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { layers } = nextProps;
    const { layers: oldLayers } = prevState;
    if (oldLayers === null) {
      return { layers };
    }
    Object.keys(oldLayers).forEach((name) => {
      if (layers[name] !== oldLayers[name]) {
        if (oldLayers[name]) {
          oldLayers[name].remove();
        }
      }
    });
    return { layers };
  }

  getStyle(feature, layer) {
    //TODO: Ajustar función de estilo para pasarala a componentes react-leaflet
    return {
      color: '#006400',
      weight: 5,
      opacity: 0.65
    }
  }

  render() {
    // const layerStyle = this.getStyle();
    // TODO: Ajustar el zoom para que tenga límites sobre el mapa
    return (
      <Map ref={this.mapRef} center={config.params.center} zoom={5} onClick={this.onMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {/* TODO: Mostrar bajo este formato los rathis.CapaBiomasSogamososter de cada estrategia de Compensaciones
          <WMSTileLayer srs={ 'EPSG:4326' }
                    layers='Biotablero:strategy_sogamoso_111_1_c'
                    url={"http://indicadores.humboldt.org.co/geoserver/Biotablero/wms?service=WMS&styles=raster_strategy"}
                    opacity={1} alt={"Regiones"} styles={"raster_strategy"} format={'image/png'} transparent={true}/> */}
        {/** TODO: La carga del WMSTileLayer depende del usuario activo,
            se debe ajustar esta carga cuando se implementen los usuarios*/}
        <WMSTileLayer
          layers='Biotablero:Regiones_geb'
          url={"http://indicadores.humboldt.org.co/geoserver/Biotablero/wms?service=WMS"}
          opacity={0.2} alt={"Regiones"}/>
        </Map>
    );
  }
}

export default MapViewer;
