/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, WMSTileLayer } from 'react-leaflet';


const config = {};
config.params = {
  center: [5.2500, -74.9167], // Location: Mariquita-Tolima
};

class MapViewer extends React.Component {
  /**
   * Construct an object with just one value corresponding to a desired attribute
   *
   * @param {object} layers layers from props,
   *  this param is to make the function callable from getDerivedStateFromProps
   * @param {string} key attribute to choose,
   *  see attributes of layers inner objects in Search and Compensation.
   */
  static infoFromLayers = (layers, key) => {
    const responseObj = {};
    Object.keys(layers).forEach((layerKey) => {
      responseObj[layerKey] = layers[layerKey][key];
    });

    return responseObj;
  }

  constructor(props) {
    super(props);
    this.state = {
      layers: {},
      activeLayers: [],
      update: false,
    };

    this.mapRef = React.createRef();
  }

  componentDidUpdate() {
    const { layers, activeLayers, update } = this.state;
    const { loadingModal } = this.props;
    if (update) {
      Object.keys(layers).forEach((layerName) => {
        if (activeLayers.includes(layerName)) this.showLayer(layers[layerName], true);
        else this.showLayer(layers[layerName], false);
      });
    }
    const countActiveLayers = Object.values(activeLayers).filter(Boolean).length;
    if (countActiveLayers === 0 && !loadingModal) {
      this.mapRef.current.leafletElement.setView(config.params.center, 5);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newActiveLayers = MapViewer.infoFromLayers(nextProps.layers, 'active');
    newActiveLayers = Object.keys(newActiveLayers).filter(name => newActiveLayers[name]);
    const { layers: oldLayers, activeLayers } = prevState;
    if (newActiveLayers.join() === activeLayers.join()) {
      return { update: false };
    }

    const layers = MapViewer.infoFromLayers(nextProps.layers, 'layer');
    Object.keys(oldLayers).forEach((name) => {
      if (layers[name] !== oldLayers[name]) {
        oldLayers[name].remove();
      }
    });
    return { layers, activeLayers: newActiveLayers, update: true };
  }

  /**
   *  Defines what layer to show and actions derivate from the selection
   *
   * @param {Object} layer receives leaflet object and e.target as the layer
   * @param {Boolean} state if it's false, then the layer should be hidden
   */
  showLayer = (layer, state) => {
    let fitBounds = true;
    if (layer.options.fitBounds === false) fitBounds = false;

    if (state === false) {
      this.mapRef.current.leafletElement.removeLayer(layer);
    } else {
      this.mapRef.current.leafletElement.addLayer(layer);
      if (fitBounds) {
        this.mapRef.current.leafletElement.fitBounds(layer.getBounds());
      }
    }
  }

  render() {
    const { geoServerUrl, userLogged } = this.props;
    return (
      <Map ref={this.mapRef} center={config.params.center} zoom={5} onClick={this.onMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {/* TODO: Catch warning from OpenStreetMap when cannot load the tiles */}
        {/** TODO: Mostrar bajo este formato raster this.CapaBiomasSogamoso de cada estrategia de
          Compensaciones */}
        {/* <WMSTileLayer
          srs="EPSG:4326"
          layers="Biotablero:strategy_sogamoso_111_1_c"
          url="http://indicadores.humboldt.org.co/geoserver/Biotablero/wms?service=WMS&styles=raster_strategy"
          opacity={1}
          alt="Regiones"
          styles="raster_strategy"
          format="image/png"
          transparent
        /> */}
        {/** TODO: La carga del WMSTileLayer depende del usuario activo,
            se debe ajustar esta carga cuando se implementen los usuarios */}
        { userLogged ? ( // TODO: Implementing WMSTileLayer load from Compensator
          <WMSTileLayer
            layers="Biotablero:Regiones_geb"
            url={`${geoServerUrl}/geoserver/Biotablero/wms?service=WMS`}
            opacity={0.2}
            alt="Regiones"
          />
        )
          : '' }
      </Map>
    );
  }
}

MapViewer.propTypes = {
  geoServerUrl: PropTypes.string.isRequired,
  userLogged: PropTypes.object,
  // It's used in getDerivedStateFromProps but eslint won't realize
  // eslint-disable-next-line react/no-unused-prop-types
  layers: PropTypes.object.isRequired,
  loadingModal: PropTypes.bool,
};

MapViewer.defaultProps = {
  userLogged: null,
  loadingModal: false,
};

export default MapViewer;
