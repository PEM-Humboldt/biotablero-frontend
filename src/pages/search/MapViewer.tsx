import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { LatLngBoundsExpression, LatLngBoundsLiteral, Map } from "leaflet";
import {
  ImageOverlay,
  MapContainer,
  TileLayer,
  WMSTileLayer,
  Pane,
  GeoJSON,
  Polygon,
} from "react-leaflet";

import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { DrawControl } from "pages/search/mapViewer/DrawControl";
import type { UiManager } from "app/Layout";
import type { Polygon as PolygonType } from "pages/search/types/dashboard";
import { useSearchStateCTX } from "pages/search/SearchContext";
import "leaflet/dist/leaflet.css";

const COLOMBIA_BOUNDS: LatLngBoundsLiteral = [
  [-4.2316872, -82.1243666],
  [16.0571269, -66.85119073],
];

const config = {
  params: {
    colombia: COLOMBIA_BOUNDS,
  },
};

interface MapViewerProps {
  bounds: LatLngBoundsExpression;
  geoServerUrl: string;

  // TODO: ajustar cuando haya conexión de consulta por polígono dibujado
  polygon: PolygonType | null;
  loadPolygonInfo: () => void;
}

export function MapViewer({
  bounds,
  geoServerUrl,
  polygon,
  loadPolygonInfo,
}: MapViewerProps) {
  const [errorModal, setErrorModal] = useState(true);
  const mapRef = useRef<Map>(null);
  const {
    layoutState: { user },
  } = useOutletContext<UiManager>();

  const {
    searchType,
    areaLayer,
    shapeLayers,
    rasterLayers,
    mapTitle,
    loadingLayer,
    layerError,
    showDrawControl,
    showAreaLayer,
  } = useSearchStateCTX();

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (Array.isArray(bounds) && bounds.length === 0) {
      map.flyToBounds(config.params.colombia);
    } else {
      map.flyToBounds(bounds);
    }
  }, [bounds]);

  useEffect(() => {
    if (layerError) {
      setErrorModal(true);
    }
  }, [layerError]);

  const handleModalClose = () => setErrorModal(false);

  const drawControlRender = showDrawControl && searchType === "drawPolygon";
  const titleName = mapTitle?.name || "";
  const shapeLayersRender = showAreaLayer
    ? [areaLayer, ...shapeLayers]
    : shapeLayers;
  const paneLevels = [
    ...new Set(
      [...shapeLayersRender, ...rasterLayers].map((layer) => layer.paneLevel),
    ),
  ];

  return (
    <MapContainer id="map" ref={mapRef} bounds={config.params.colombia}>
      {/* TODO: agrega componente para el gradiente */}

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
        open={layerError && errorModal}
        onClose={handleModalClose}
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
            onClick={handleModalClose}
            title="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>
      </Modal>

      {drawControlRender && <DrawControl />}

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
          {shapeLayersRender
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
              if (layer.opacity) {
                opacity = layer.opacity;
              }
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

      {user && (
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
