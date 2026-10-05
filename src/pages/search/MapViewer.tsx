import { useEffect, useRef, useState } from "react";
import type { LatLngBoundsExpression, Map } from "leaflet";
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
import type { Polygon as PolygonType } from "pages/search/types/dashboard";
import { useSearchStateCTX } from "pages/search/hooks/SearchContext";
import "leaflet/dist/leaflet.css";
import { useUserCTX } from "@hooks/UserCTX";
import { COLOMBIA_BOUNDS } from "pages/utils/settings";
import { OnLoadingModal } from "@ui/OnLoadingModal";
import { CssMaskRasterOverlay } from "pages/search/mapViewer/CssMaskRasterOverlay";
import { GradientLegend } from "@ui/GradientLegend";
import { toast } from "sonner";
import { CircleXIcon, FileExclamationPoint, XIcon } from "lucide-react";
import { Button } from "@ui/shadCN/component/button";

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
  loadPolygonInfo: _,
}: MapViewerProps) {
  const [errorModal, setErrorModal] = useState(true);
  const mapRef = useRef<Map>(null);
  const { user } = useUserCTX();

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

    // NOTE: soluciona las discrepancias de render entre react y leaflet
    map.whenReady(() => {
      map.invalidateSize();
    });

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

  useEffect(() => {
    const toastId = toast("Indicadores no disponibles", {
      position: "bottom-left",
      description:
        "Actualmente algunos indicadores no se encuentran disponibles debido a la actualización del módulo de consultas. Estamos trabajando para incorporarlos lo antes posible.",
      icon: <FileExclamationPoint className="size-8 text-accent" />,
      className: "relative p-6 gap-6! border-2! border-accent! -translate-y-17",
      duration: Infinity,
      action: (
        <Button
          size="icon"
          variant="ghost-clean"
          className="absolute top-1 right-1"
          onClick={() => toast.dismiss(toastId)}
        >
          <CircleXIcon className="size-6" />
        </Button>
      ),
    });

    return () => {
      toast.dismiss(toastId);
    };
  }, []);

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
      {titleName && (
        <>
          <div className="mapsTitle">
            <div className="title">{titleName}</div>
            {mapTitle.gradientData && (
              <GradientLegend {...mapTitle.gradientData} />
            )}
          </div>
        </>
      )}

      <OnLoadingModal open={loadingLayer} containerID="map" />

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
            .map((layer) =>
              layer.json && layer.json.type ? (
                <GeoJSON
                  key={layer.id}
                  data={layer.json}
                  style={layer.layerStyle}
                  onEachFeature={layer.onEachFeature}
                />
              ) : null,
            )}

          {rasterLayers
            .filter((l) => l.paneLevel === panelLevel)
            .map((layer) => {
              let opacity = layer.opacity ?? 0.7;
              if (layer.selected) {
                opacity = 1;
              }
              let layerBounds = bounds;
              if (layer.bbox) {
                layerBounds = [
                  [layer.bbox[1], layer.bbox[0]],
                  [layer.bbox[3], layer.bbox[2]],
                ];
              }
              return layer.color ? (
                <CssMaskRasterOverlay
                  key={`${layer.id}-${layer.data}`}
                  source={layer.data}
                  bounds={layerBounds}
                  opacity={opacity}
                  color={layer.color}
                />
              ) : (
                <ImageOverlay
                  key={`${layer.id}-${layer.data}`}
                  url={layer.data}
                  bounds={layerBounds}
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

      {/* HACK: Pendiente a la integración de la db con el sistema de usuarios */}
      {user && user.username === "geb" && (
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
