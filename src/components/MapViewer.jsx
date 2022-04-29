import PropTypes from 'prop-types';
import React from 'react';

import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  ImageOverlay,
  Map,
  TileLayer,
  WMSTileLayer,
  Pane,
  GeoJSON,
} from 'react-leaflet';

import DrawControl from 'components/mapViewer/DrawControl';

import 'leaflet/dist/leaflet.css';

const config = {};
config.params = {
  colombia: [[-4.2316872, -82.1243666], [16.0571269, -66.85119073]],
};

class MapViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openErrorModal: true,
    };

    this.mapRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { mapBounds } = this.props;
    if (prevProps.mapBounds !== mapBounds) {
      this.mapRef.current.leafletElement.flyToBounds(mapBounds ?? config.params.colombia);
    }
  }

  render() {
    const {
      geoServerUrl,
      userLogged,
      loadingLayer,
      layerError,
      rasterLayers,
      layers,
      rasterBounds,
      mapTitle,
      drawPolygonEnabled,
      loadPolygonInfo,
    } = this.props;
    const { openErrorModal } = this.state;

    const paneLevels = Array.from(
      new Set([...layers, ...rasterLayers].map((layer) => layer.paneLevel)),
    );

    return (
      <Map
        id="map"
        ref={this.mapRef}
        bounds={config.params.colombia}
      >
        {mapTitle}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={loadingLayer}
          disableAutoFocus
          container={() => document.getElementById('map')}
          style={{ position: 'absolute' }}
          BackdropProps={{ style: { position: 'absolute' } }}
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
          onClose={() => { this.setState({ openErrorModal: false }); }}
          container={() => document.getElementById('map')}
          style={{ position: 'absolute' }}
          BackdropProps={{ style: { position: 'absolute' } }}
        >
          <div className="generalAlarm">
            <h2>
              <b>Capa no disponible actualmente</b>
            </h2>
            <button
              type="button"
              className="closebtn"
              style={{ position: 'absolute' }}
              onClick={() => { this.setState({ openErrorModal: false }); }}
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        </Modal>
        { drawPolygonEnabled && (<DrawControl loadPolygonInfo={loadPolygonInfo} />)}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {paneLevels.map((panelLevel, index) => (
          <Pane key={panelLevel} style={{ zIndex: 500 + index }}>
            {layers
              .filter((l) => l.paneLevel === panelLevel)
              .map((layer) => (
                <GeoJSON
                  key={layer.id}
                  data={layer.json}
                  style={layer.layerStyle}
                  onEachFeature={layer.onEachFeature}
                />
              ))}
            {rasterLayers
              .filter((l) => l.paneLevel === panelLevel)
              .map((layer) => (
                <ImageOverlay
                  key={layer.id}
                  url={layer.data}
                  bounds={rasterBounds}
                  opacity={layer.opacity}
                />
              ))}
          </Pane>
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
      </Map>
    );
  }
}

MapViewer.propTypes = {
  drawPolygonEnabled: PropTypes.bool,
  geoServerUrl: PropTypes.string.isRequired,
  userLogged: PropTypes.object,
  loadingLayer: PropTypes.bool,
  layers: PropTypes.array,
  layerError: PropTypes.bool,
  rasterLayers: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.string,
    opacity: PropTypes.number,
  })),
  mapBounds: PropTypes.object,
  rasterBounds: PropTypes.object,
  mapTitle: PropTypes.object,
  loadPolygonInfo: PropTypes.func,
};

MapViewer.defaultProps = {
  userLogged: null,
  drawPolygonEnabled: false,
  loadingLayer: false,
  layerError: false,
  rasterLayers: [],
  layers: [],
  mapBounds: null,
  rasterBounds: null,
  mapTitle: null,
  loadPolygonInfo: () => {},
};

export default MapViewer;
