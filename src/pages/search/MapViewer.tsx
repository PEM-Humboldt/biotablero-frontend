import React from "react";

import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  ImageOverlay,
  MapContainer,
  TileLayer,
  WMSTileLayer,
  Pane,
  GeoJSON,
  Polygon,
} from "react-leaflet";
import { LatLngBoundsExpression, LatLngBoundsLiteral, Map } from "leaflet";

import "leaflet/dist/leaflet.css";

import DrawControl from "pages/search/mapViewer/DrawControl";
import { Polygon as PolygonType } from "pages/search/types/dashboard";

import { MapTitle, rasterLayer, shapeLayer } from "pages/search/types/layers";

interface Props {
  showDrawControl: boolean;
  geoServerUrl: string;
  loadingLayer: boolean;
  layerError: boolean;
  mapTitle: MapTitle;
  shapeLayers: Array<shapeLayer>;
  rasterLayers: Array<rasterLayer>;
  bounds: LatLngBoundsExpression;
  // TODO ajustar cuando se haga la conexión con la consulta por polígono dibujado
  polygon: PolygonType | null;
  loadPolygonInfo: () => void;
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
  map: Map | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      openErrorModal: true,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { bounds } = this.props;
    const { map } = this;

    if (!map) return;

    if (Array.isArray(bounds) && bounds.length === 0) {
      map.flyToBounds(config.params.colombia);
    } else if (prevProps.bounds !== bounds) {
      map.flyToBounds(bounds);
    }
  }

  render() {
    const {
      geoServerUrl,
      userLogged,
      loadingLayer,
      layerError,
      rasterLayers,
      shapeLayers,
      bounds,
      mapTitle,
      polygon,
      showDrawControl,
    } = this.props;
    //TODO Borrar searchRasterLayers al finalizar la migracion
    //Trabajar igual los shapeLayers
    // const { rasterLayers, shapeLayers } = this.context as SearchContextValues;

    const { openErrorModal } = this.state;

    const paneLevels = Array.from(
      new Set([...shapeLayers, ...rasterLayers].map((layer) => layer.paneLevel))
    );

    const titleName = mapTitle?.name || "";

    // HACK: touchExtend dentro de MapContainer existe mientras se actualiza
    // librería para evitar el warn, no afecta funcionalidad en escritorio
    return (
      <MapContainer
        id="map"
        whenCreated={(map) => {
          this.map = map;
        }}
        bounds={config.params.colombia}
        touchExtend={false}
      >
        {/* TODO agrega componente para el gradiente */}
        {titleName && (
          <>
            <div className="mapsTitle">
              <div className="title">{titleName}</div>
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
        {showDrawControl && <DrawControl />}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {paneLevels.map((panelLevel, index) => (
          <Pane
            name={`Pane${panelLevel}`}
            key={panelLevel}
            style={{ zIndex: 500 + index }}
          >
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
                    bounds={bounds}
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
          />
        )}
      </MapContainer>
    );
  }
}

export default MapViewer;
