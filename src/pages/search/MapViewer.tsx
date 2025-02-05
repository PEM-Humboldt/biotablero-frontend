import React from "react";

import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  ImageOverlay,
  Map,
  TileLayer,
  WMSTileLayer,
  Pane,
  GeoJSON,
  Polygon,
} from "react-leaflet";

import DrawControl from "pages/search/mapViewer/DrawControl";

import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression, LatLngBoundsLiteral } from "leaflet";
import { Polygon as PolygonType } from "pages/search/types/dashboard";
import SearchContext from "pages/search/SearchContext";

import { rasterLayer, shapeLayer } from "pages/search/types/layers";

interface Props {
  drawPolygonEnabled: boolean;
  geoServerUrl: string;
  loadingLayer: boolean;
  layerError: boolean;
  // TODO: tipar correctamente
  mapTitle: {
    name: string;
    gradientData?: { from: number; to: number; colors: Array<string> };
  };
  mapBounds: LatLngBoundsExpression;
  rasterBounds: LatLngBoundsExpression;
  polygon: PolygonType | null;
  loadPolygonInfo: () => void;
  shapeLayers: Array<shapeLayer>;
  rasterLayers: Array<rasterLayer>;
  userLogged?: {
    id: number;
    username: string;
    name: string;
    company: {
      id: number;
    };
  };
}

interface State {
  openErrorModal: boolean;
}

const colombiaBounds: LatLngBoundsLiteral = [
  [-4.2316872, -82.1243666],
  [16.0571269, -66.85119073],
];

const config = {
  params: {
    colombia: colombiaBounds,
  },
};

class MapViewer extends React.Component<Props, State> {
  mapRef;

  constructor(props: Props) {
    super(props);
    this.state = {
      openErrorModal: true,
    };

    this.mapRef = React.createRef<Map>();
  }

  // TODO: ESto seguramente no está sirviendo para nada
  componentDidUpdate(prevProps: Props) {
    /*const { mapBounds } = this.props;
    if (prevProps.mapBounds !== mapBounds) {
      this.mapRef.current?.leafletElement.flyToBounds(
        mapBounds ?? config.params.colombia
      );
    }*/
  }

  render() {
    const {
      geoServerUrl,
      userLogged,
      loadingLayer,
      layerError,
      rasterLayers,
      shapeLayers,
      rasterBounds,
      mapTitle,
      polygon,
      drawPolygonEnabled,
      loadPolygonInfo,
    } = this.props;
    //TODO Borrar searchRasterLayers al finalizar la migracion
    //Trabajar igual los shapeLayers
    // const { rasterLayers, shapeLayers } = this.context as SearchContextValues;

    const { openErrorModal } = this.state;

    const paneLevels = Array.from(
      new Set([...shapeLayers, ...rasterLayers].map((layer) => layer.paneLevel))
    );

    return (
      <Map id="map" ref={this.mapRef} bounds={config.params.colombia}>
        {/* TODO agrega componente para el gradiente */}
        {mapTitle && (
          <>
            <div className="mapsTitle">
              <div className="title">{mapTitle.name}</div>
            </div>
          </>
        )}
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
        {drawPolygonEnabled && (
          <DrawControl loadPolygonInfo={loadPolygonInfo} />
        )}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {paneLevels.map((panelLevel, index) => (
          <Pane key={panelLevel} style={{ zIndex: 500 + index }}>
            {shapeLayers
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
              .map((layer) => {
                let opacity = layer.selected ? 1 : 0.7;
                if (layer.opacity) opacity = layer.opacity;
                return (
                  <ImageOverlay
                    key={layer.id}
                    url={layer.data}
                    bounds={rasterBounds}
                    opacity={opacity}
                  />
                );
              })}
          </Pane>
        ))}
        {polygon && polygon.coordinates && (
          <Polygon
            positions={polygon.coordinates}
            color={polygon.color}
            opacity={0.8}
            fill={polygon.fill}
          />
        )}
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

export default MapViewer;

MapViewer.contextType = SearchContext;
