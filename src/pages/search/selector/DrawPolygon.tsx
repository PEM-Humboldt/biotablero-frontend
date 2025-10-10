import { useCallback, useEffect, useState } from "react";
import { Done } from "@mui/icons-material";
import L, { type Polygon } from "leaflet";
import type { DrawEvents } from "leaflet";
import type * as geojson from "geojson";

import EditPolygonIcon from "pages/search/selector/EditIcon";
import PolygonIcon from "pages/search/selector/PolygonIcon";
import RemoveIcon from "pages/search/selector/RemoveIcon";
import {
  useSearchDrawControlsCTX,
  useSearchLegacyCTX,
} from "pages/search/hooks/SearchContext";
import { uiText } from "pages/search/selector/drawPolygon/layout/uiText";
import "pages/search/layout/DrawPolygon.css";
import { DrawMode } from "pages/search/selector/drawPolygon/types/drawPolygon";

export function DrawPolygon() {
  const { drawControlsRef, areDrawControlsMounted } =
    useSearchDrawControlsCTX();
  const { setAreaType, setAreaLayer } = useSearchLegacyCTX();
  const [drawnPolygon, setDrawnPolygon] =
    useState<Polygon<geojson.Polygon> | null>(null);

  const [drawMode, setDrawMode] = useState<DrawMode>(DrawMode.IDLE);

  const onDrawStart = useCallback(() => {
    setDrawMode(DrawMode.DRAW);
  }, []);

  const onDrawStop = useCallback(() => {
    setDrawMode(drawnPolygon ? DrawMode.DONE : DrawMode.IDLE);
  }, [drawnPolygon]);

  const onPolygonDrawn = useCallback((e: DrawEvents.Created) => {
    setDrawnPolygon(e.layer as Polygon);
    setDrawMode(DrawMode.DONE);
  }, []);

  const onPolygonEdited = useCallback((e: DrawEvents.Edited) => {
    const editedLayers = e.layers.getLayers();
    if (editedLayers.length > 0) {
      setDrawnPolygon(editedLayers[0] as Polygon);
      setDrawMode(DrawMode.DONE);
    }
  }, []);

  const onPolygoDeleted = useCallback(() => {
    setDrawnPolygon(null);
    setDrawMode(DrawMode.IDLE);
  }, []);

  useEffect(() => {
    if (areDrawControlsMounted && drawControlsRef?.current) {
      const drawControl = drawControlsRef.current;
      drawControl._map.on("draw:created", onPolygonDrawn);
      drawControl._map.on("draw:edited", onPolygonEdited);
      drawControl._map.on("draw:deleted", onPolygoDeleted);
      drawControl._map.on("draw:drawstart", onDrawStart);
      drawControl._map.on("draw:drawstop", onDrawStop);

      return () => {
        if (drawControl && drawControl._map) {
          drawControl._map.off("draw:created", onPolygonDrawn);
          drawControl._map.off("draw:edited", onPolygonEdited);
          drawControl._map.off("draw:deleted", onPolygoDeleted);
          drawControl._map.off("draw:drawstart", onDrawStart);
          drawControl._map.off("draw:drawstop", onDrawStop);
        }
      };
    }
  }, [
    areDrawControlsMounted,
    drawControlsRef,
    onPolygonDrawn,
    onPolygonEdited,
    onPolygoDeleted,
    onDrawStart,
    onDrawStop,
  ]);

  const drawClick = () => {
    setDrawMode(DrawMode.DRAW);
    drawControlsRef!.current!._toolbars.draw._modes.polygon.handler.enable();
  };

  const editClick = () => {
    setDrawMode(DrawMode.EDIT);
    drawControlsRef!.current!._toolbars.edit._modes.edit.handler.enable();
  };

  const finishEdit = () => {
    setDrawMode(DrawMode.DONE);
    drawControlsRef!.current!._toolbars.edit._actionButtons[0].button.click();
  };

  const removeClick = () => {
    setDrawMode(DrawMode.DELETE);
    drawControlsRef!.current!._toolbars.edit._modes.remove.handler.enable();
  };

  const finishRemove = () => {
    if (
      drawControlsRef?.current &&
      drawnPolygon &&
      drawControlsRef.current._map.hasLayer(drawnPolygon)
    ) {
      drawnPolygon!.remove();
    }
    setDrawMode(DrawMode.IDLE);
    drawControlsRef!.current!._toolbars.edit._actionButtons[0].button.click();
  };

  const cancelChange = () => {
    setDrawMode(DrawMode.DONE);
    drawControlsRef!.current!._toolbars.edit._actionButtons[1].button.click();
  };

  const sendClick = () => {
    if (!drawnPolygon) {
      return;
    }

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
    setDrawMode(DrawMode.IDLE); // NOTE: Revisar estye
  };

  return (
    <div className="drawPAcc">
      <div className="drawPAcc-header">
        <div className="drawPAcc-title">{uiText.title[drawMode]}</div>
      </div>

      <div className="drawPAcc-content">
        <div className="button-section">
          <button
            className={`action-button ${drawMode === DrawMode.DRAW ? "active" : ""}`}
            disabled={drawnPolygon !== null || !areDrawControlsMounted}
            onClick={drawClick}
          >
            <PolygonIcon />
            <span>{uiText.drawButton.title}</span>
          </button>
          <p className="instruction-text">
            {uiText.drawButton.instruction[drawMode]}
          </p>
        </div>

        <div className="button-section">
          <button
            className={`action-button ${drawMode === DrawMode.EDIT ? "active" : ""}`}
            disabled={
              drawnPolygon === null ||
              drawMode === DrawMode.DELETE ||
              drawMode === DrawMode.DRAW ||
              !areDrawControlsMounted
            }
            onClick={editClick}
          >
            <EditPolygonIcon />
            <span>{uiText.editButton.title}</span>
          </button>
          <p className="instruction-text">
            {uiText.editButton.instruction[drawMode]}
          </p>

          {drawMode === DrawMode.EDIT && (
            <div className="secondary-buttons-container">
              <button className="secondary-button" onClick={finishEdit}>
                <div className="icon-placeholder"></div>
                <span>{uiText.secondaryButtons.save}</span>
              </button>

              <button className="secondary-button" onClick={cancelChange}>
                <div className="icon-placeholder cancel"></div>
                <span>{uiText.secondaryButtons.cancel}</span>
              </button>
            </div>
          )}
        </div>

        <div className="button-section">
          <button
            className={`action-button ${drawMode === DrawMode.DELETE ? "active" : ""}`}
            disabled={
              drawnPolygon === null ||
              drawMode === DrawMode.EDIT ||
              drawMode === DrawMode.DRAW ||
              !areDrawControlsMounted
            }
            onClick={removeClick}
          >
            <RemoveIcon />
            <span>{uiText.removeButton.title}</span>
          </button>
          <p className="instruction-text">
            {uiText.removeButton.instruction[drawMode]}
          </p>

          {drawMode === DrawMode.DELETE && (
            <div className="secondary-buttons-container">
              <button className="secondary-button" onClick={finishRemove}>
                <div className="icon-placeholder"></div>
                <span>{uiText.secondaryButtons.confirmDelete}</span>
              </button>

              <button className="secondary-button" onClick={cancelChange}>
                <div className="icon-placeholder cancel"></div>
                <span>{uiText.secondaryButtons.cancelDelete}</span>
              </button>
            </div>
          )}
        </div>

        <div className="button-section">
          <button
            className={`action-button`}
            disabled={
              drawnPolygon === null ||
              drawMode === DrawMode.EDIT ||
              drawMode === DrawMode.DELETE ||
              drawMode === DrawMode.DRAW ||
              !areDrawControlsMounted
            }
            onClick={sendClick}
          >
            <Done />
            <span>{uiText.sendButton.title}</span>
          </button>
          <p className="instruction-text">
            {drawnPolygon !== null
              ? uiText.sendButton.instruction[DrawMode.DONE]
              : uiText.sendButton.instruction[drawMode]}
          </p>
        </div>
      </div>
    </div>
  );
}
