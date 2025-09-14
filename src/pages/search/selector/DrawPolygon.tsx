import { useCallback, useContext, useEffect, useState } from "react";
import { Done } from "@mui/icons-material";
import L, { Polygon } from "leaflet";
import type { DrawEvents } from "leaflet";
import * as geojson from "geojson";

import EditPolygonIcon from "pages/search/selector/EditIcon";
import PolygonIcon from "pages/search/selector/PolygonIcon";
import RemoveIcon from "pages/search/selector/RemoveIcon";
import {
  useSearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/SearchContext";
import "./DrawPolygon.css";

const DrawPolygon = () => {
  const context = useSearchLegacyCTX();
  const { setOnEditControlMounted, setAreaType, setAreaLayer } =
    context as LegacyContextValues;
  const [drawControl, setDrawControl] = useState<any>();
  const [drawnPolygon, setDrawnPolygon] =
    useState<Polygon<geojson.Polygon> | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const onDrawStart = useCallback(() => {
    setIsDrawing(true);
  }, []);

  const onDrawStop = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const onPolygonDrawn = useCallback((e: DrawEvents.Created) => {
    setDrawnPolygon(e.layer as Polygon);
    setIsDrawing(false);
  }, []);

  const onPolygonEdited = useCallback((e: DrawEvents.Edited) => {
    const editedLayers = e.layers.getLayers();
    if (editedLayers.length > 0) {
      setDrawnPolygon(editedLayers[0] as Polygon);
    }
  }, []);

  const onPolygoDeleted = useCallback(() => {
    setDrawnPolygon(null);
  }, []);

  const onEditControlMounted = useCallback(
    (control: any) => {
      const newDrawControl = control;
      setDrawControl(newDrawControl);
      newDrawControl._map.on("draw:created", onPolygonDrawn);
      newDrawControl._map.on("draw:edited", onPolygonEdited);
      newDrawControl._map.on("draw:deleted", onPolygoDeleted);
      newDrawControl._map.on("draw:drawstart", onDrawStart);
      newDrawControl._map.on("draw:drawstop", onDrawStop);
    },
    [onPolygonDrawn, onPolygonEdited, onPolygoDeleted, onDrawStart, onDrawStop],
  );

  useEffect(() => {
    setOnEditControlMounted(() => onEditControlMounted);

    return () => {
      if (drawControl && drawControl._map) {
        drawControl._map.off("draw:drawstart", onDrawStart);
        drawControl._map.off("draw:drawstop", onDrawStop);
        drawControl._map.off("draw:created", onPolygonDrawn);
        drawControl._map.off("draw:edited", onPolygonEdited);
        drawControl._map.off("draw:deleted", onPolygoDeleted);
      }
      setOnEditControlMounted(() => () => {});
    };
  }, [
    setOnEditControlMounted,
    onEditControlMounted,
    drawControl,
    onDrawStart,
    onDrawStop,
    onPolygonDrawn,
    onPolygonEdited,
    onPolygoDeleted,
  ]);

  const drawClick = () => {
    setIsDrawing(true);
    drawControl!._toolbars.draw._modes.polygon.handler.enable();
  };

  const editClick = () => {
    setIsEditing(true);
    drawControl!._toolbars.edit._modes.edit.handler.enable();
  };

  const finishEdit = () => {
    setIsEditing(false);
    drawControl!._toolbars.edit._actionButtons[0].button.click();
  };

  const removeClick = () => {
    setIsRemoving(true);
    drawControl!._toolbars.edit._modes.remove.handler.enable();
  };

  const finishRemove = () => {
    if (
      drawControl &&
      drawnPolygon &&
      drawControl._map.hasLayer(drawnPolygon)
    ) {
      drawnPolygon!.remove();
    }
    setIsRemoving(false);
    drawControl!._toolbars.edit._actionButtons[0].button.click();
  };

  const cancelChange = () => {
    setIsEditing(false);
    setIsRemoving(false);
    drawControl!._toolbars.edit._actionButtons[1].button.click();
  };

  const sendClick = () => {
    if (!drawnPolygon) return;

    const polygonBounds = L.polygon(drawnPolygon.getLatLngs()).getBounds();
    const bbox: geojson.BBox = [
      polygonBounds.getSouthWest().lng,
      polygonBounds.getSouthWest().lat,
      polygonBounds.getNorthEast().lng,
      polygonBounds.getNorthEast().lat,
    ];
    const geojson =
      drawnPolygon.toGeoJSON() as geojson.Feature<geojson.Polygon>;
    geojson.geometry.bbox = bbox;

    setAreaType({ id: "custom", label: "Consulta Personalizada" });
    setAreaLayer(geojson);
    setDrawnPolygon(null);
  };

  return (
    <div className="drawPAcc">
      <div className="drawPAcc-header">
        <div className="drawPAcc-title">
          {isDrawing
            ? "Dibujando polígono..."
            : isEditing
              ? "Editando polígono..."
              : isRemoving
                ? "Haga clic en el polígono para eliminarlo"
                : drawnPolygon
                  ? "Polígono creado - Seleccione una acción"
                  : "Dibuje UN polígono para comenzar"}
        </div>
      </div>

      <div className="drawPAcc-content">
        <div className="button-section">
          <button
            className={`action-button ${isDrawing ? "active" : ""}`}
            disabled={drawnPolygon !== null}
            onClick={drawClick}
          >
            <PolygonIcon />
            <span>Dibujar polígono</span>
          </button>
          <p className="instruction-text">
            {drawnPolygon
              ? "✓ Polígono dibujado correctamente"
              : isDrawing
                ? "Haga clic en el mapa para empezar a dibujar (doble clic para finalizar)"
                : "Haga clic aquí para activar. Luego dibuje UN polígono en el mapa (doble clic para finalizar)."}
          </p>
        </div>

        <div className="button-section">
          <button
            className={`action-button ${isEditing ? "active" : ""}`}
            disabled={drawnPolygon === null || isRemoving || isDrawing}
            onClick={editClick}
          >
            <EditPolygonIcon />
            <span>Editar polígono</span>
          </button>
          <p className="instruction-text">
            {drawnPolygon === null
              ? "Primero debe dibujar un polígono"
              : isEditing
                ? "Arrastre los puntos para modificar la forma"
                : "Haga clic para activar el modo edición"}
          </p>

          {isEditing && (
            <div className="secondary-buttons-container">
              <button className="secondary-button" onClick={finishEdit}>
                <div className="icon-placeholder"></div>
                <span>Guardar cambios</span>
              </button>

              <button className="secondary-button" onClick={cancelChange}>
                <div className="icon-placeholder cancel"></div>
                <span>Cancelar cambios</span>
              </button>
            </div>
          )}
        </div>

        <div className="button-section">
          <button
            className={`action-button ${isRemoving ? "active" : ""}`}
            disabled={drawnPolygon === null || isEditing || isDrawing}
            onClick={removeClick}
          >
            <RemoveIcon />
            <span>Borrar polígono</span>
          </button>
          <p className="instruction-text">
            {drawnPolygon === null
              ? "Primero debe dibujar un polígono"
              : isRemoving
                ? "Haga clic en el polígono del mapa para eliminarlo"
                : "Eliminará el polígono actual del mapa"}
          </p>

          {isRemoving && (
            <div className="secondary-buttons-container">
              <button className="secondary-button" onClick={finishRemove}>
                <div className="icon-placeholder"></div>
                <span>Confirmar eliminación</span>
              </button>

              <button className="secondary-button" onClick={cancelChange}>
                <div className="icon-placeholder cancel"></div>
                <span>Cancelar eliminación</span>
              </button>
            </div>
          )}
        </div>

        <div className="button-section">
          <button
            className={`action-button`}
            disabled={
              drawnPolygon === null || isEditing || isRemoving || isDrawing
            }
            onClick={sendClick}
          >
            <Done />
            <span>Enviar consulta</span>
          </button>
          <p className="instruction-text">
            {drawnPolygon === null
              ? "Primero debe dibujar un polígono"
              : isEditing || isRemoving || isDrawing
                ? "Complete la acción actual antes de enviar"
                : "Procesar consulta con el polígono creado"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrawPolygon;
