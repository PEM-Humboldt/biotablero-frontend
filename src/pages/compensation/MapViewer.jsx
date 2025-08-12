import PropTypes from "prop-types";
import React from "react";

import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  ImageOverlay,
  MapContainer,
  TileLayer,
  WMSTileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const config = {};
config.params = {
  center: [5.25, -74.9167], // Location: Mariquita-Tolima
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
  };

  constructor(props) {
    super(props);
    this.state = {
      layers: {},
      activeLayers: [],
      update: false,
      openErrorModal: true,
    };

    this.mapRef = React.createRef();
  }

  componentDidUpdate() {
    const { layers, activeLayers, update } = this.state;
    const { loadingLayer, rasterBounds } = this.props;
    if (update) {
      Object.keys(layers).forEach((layerName) => {
        if (activeLayers.includes(layerName))
          this.showLayer(layers[layerName], true);
        else this.showLayer(layers[layerName], false);
      });
    }
    const countActiveLayers =
      Object.values(activeLayers).filter(Boolean).length;
    if (rasterBounds) {
      this.mapRef.current.fitBounds(rasterBounds);
    } else if (countActiveLayers === 0 && !loadingLayer) {
      this.mapRef.current.setView(config.params.center, 5);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newActiveLayers = MapViewer.infoFromLayers(nextProps.layers, "active");
    newActiveLayers = Object.keys(newActiveLayers).filter(
      (name) => newActiveLayers[name]
    );
    const { layers: oldLayers, activeLayers } = prevState;
    if (newActiveLayers.join() === activeLayers.join()) {
      return { update: false };
    }

    const layers = MapViewer.infoFromLayers(nextProps.layers, "layer");
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
      this.mapRef.current.removeLayer(layer);
    } else {
      this.mapRef.current.addLayer(layer);
      if (fitBounds) {
        this.mapRef.current.fitBounds(layer.getBounds());
      }
    }
  };

  render() {
    const {
      geoServerUrl,
      userLogged,
      loadingLayer,
      layerError,
      rasterLayers,
      rasterBounds,
      mapTitle,
    } = this.props;
    const { openErrorModal } = this.state;
    return (
      <MapContainer
        id="map"
        ref={this.mapRef}
        center={config.params.center}
        zoom={5}
      >
        {mapTitle}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={loadingLayer}
          disableAutoFocus
          container={() => document.getElementById("map")}
          style={{ position: "absolute" }}
          BackdropProps={{ style: { position: "absolute" } }}
        >
          <div className="generalAlarm">
            <h2>
              <b>Cargando</b>
              <div className="load-wrapp">
                <div className="load-1">
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                </div>
              </div>
            </h2>
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={layerError && openErrorModal}
          onClose={() => {
            this.setState({ openErrorModal: false });
          }}
          container={() => document.getElementById("map")}
          style={{ position: "absolute" }}
          BackdropProps={{ style: { position: "absolute" } }}
        >
          <div className="generalAlarm">
            <h2>
              <b>Capa no disponible actualmente</b>
            </h2>
            <button
              type="button"
              className="closebtn"
              style={{ position: "absolute" }}
              onClick={() => {
                this.setState({ openErrorModal: false });
              }}
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        </Modal>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {rasterLayers &&
          rasterBounds &&
          rasterLayers.map((ras, index) => (
            <ImageOverlay
              key={index}
              url={ras.data}
              bounds={rasterBounds}
              opacity={ras.opacity}
            />
          ))}
        {/* TODO: Catch warning from OpenStreetMap when cannot load the tiles */}
        {userLogged && (
          <WMSTileLayer
            layers="Biotablero:Regiones_geb"
            format="image/png"
            url={`${geoServerUrl}/Biotablero/wms?service=WMS`}
            opacity={0.4}
            transparent
            alt="Regiones"
          />
        )}
      </MapContainer>
    );
  }
}

MapViewer.propTypes = {
  geoServerUrl: PropTypes.string.isRequired,
  userLogged: PropTypes.object,
  loadingLayer: PropTypes.bool,
  // They're used in getDerivedStateFromProps but eslint won't realize
  // eslint-disable-next-line react/no-unused-prop-types
  layers: PropTypes.object.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  layerError: PropTypes.bool,
  rasterLayers: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.string,
      opacity: PropTypes.number,
    })
  ),
  rasterBounds: PropTypes.object,
  mapTitle: PropTypes.object,
};

MapViewer.defaultProps = {
  userLogged: null,
  loadingLayer: false,
  layerError: false,
  rasterLayers: [],
  rasterBounds: null,
  mapTitle: null,
};

export default MapViewer;
