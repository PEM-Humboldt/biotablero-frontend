/** eslint verified */
// TODO: Estilos diferentes entre elementos de cada capa

import React from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, WMSTileLayer } from 'react-leaflet';

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
  }

  componentDidUpdate() {
    const { activeLayers } = this.props;
    const { layers } = this.state;
    if (activeLayers) {
      Object.keys(activeLayers).forEach((layerName) => {
        if (activeLayers[layerName]) this.showLayer(layers[layerName], true);
        else this.showLayer(layers[layerName], false);
      });
      const countActiveLayers = Object.values(activeLayers).filter(Boolean).length;
      if (countActiveLayers === 0) {
        this.mapRef.current.leafletElement.setView(config.params.center, 5);
      }
    } else this.mapRef.current.leafletElement.setView(config.params.center, 5);
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

  /**
   *  Defines what layer to show and actions derivate from the selection
   *
   * @param {Object} layer receives leaflet object and e.target as the layer
   * @param {Boolean} state if it's false, then the layer should be hidden
   */
  showLayer = (layer, state) => {
    if (state === false) {
      this.mapRef.current.leafletElement.removeLayer(layer);
    } else {
      this.mapRef.current.leafletElement.addLayer(layer);
      this.mapRef.current.leafletElement.fitBounds(layer.getBounds());
    }
  }

  render() {
    return (
      <Map ref={this.mapRef} center={config.params.center} zoom={5} onClick={this.onMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {/** TODO: Mostrar bajo este formato los rathis.CapaBiomasSogamososter de cada estrategia de
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
        <WMSTileLayer
          layers="Biotablero:Regiones_geb"
          url="http://indicadores.humboldt.org.co/geoserver/Biotablero/wms?service=WMS"
          opacity={0.2}
          alt="Regiones"
        />
      </Map>
    );
  }
}

MapViewer.propTypes = {
  // {layerName: layerValue} syntax for each layer to be loaded
  activeLayers: PropTypes.object,
};

MapViewer.defaultProps = {
  activeLayers: null,
};

export default MapViewer;
