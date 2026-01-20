import { useCallback, useEffect, useState } from "react";
import { Done } from "@mui/icons-material";
import L, {
  type Polygon,
  type LeafletEvent,
  type Map,
  type Control,
} from "leaflet";
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
import "pages/search/selector/drawPolygon/layout/DrawPolygon.css";
import { DrawMode } from "pages/search/selector/drawPolygon/types/drawPolygon";
interface DrawModeHandler {
  handler: {
    enable(): void;
  };
}

interface DrawToolbar {
  _modes: {
    polygon: DrawModeHandler;
  };
}

interface EditToolbar {
  _modes: {
    edit: DrawModeHandler;
    remove: DrawModeHandler;
  };
  _actionButtons: Array<{
    button: HTMLButtonElement;
  }>;
}

interface DrawControlExtend extends Control.Draw {
  _map: Map;
  _toolbars: {
    draw: DrawToolbar;
    edit: EditToolbar;
  };
}

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

  const onPolygonDrawn = useCallback((e: LeafletEvent) => {
    const event = e as DrawEvents.Created;
    setDrawnPolygon(event.layer as Polygon);
    setDrawMode(DrawMode.DONE);
  }, []);

  const onPolygonEdited = useCallback((e: LeafletEvent) => {
    const event = e as DrawEvents.Edited;
    const layers = event.layers.getLayers();

    if (layers.length > 0) {
      setDrawnPolygon(layers[0] as Polygon);
      setDrawMode(DrawMode.DONE);
    }
  }, []);

  const onPolygonDeleted = useCallback(() => {
    setDrawnPolygon(null);
    setDrawMode(DrawMode.IDLE);
  }, []);

  useEffect(() => {
    if (!areDrawControlsMounted || !drawControlsRef?.current) return;

    const drawControl = drawControlsRef.current as DrawControlExtend;

    const map = drawControl._map;

    map.on("draw:created", onPolygonDrawn);
    map.on("draw:edited", onPolygonEdited);
    map.on("draw:deleted", onPolygonDeleted);
    map.on("draw:drawstart", onDrawStart);
    map.on("draw:drawstop", onDrawStop);

    return () => {
      map.off("draw:created", onPolygonDrawn);
      map.off("draw:edited", onPolygonEdited);
      map.off("draw:deleted", onPolygonDeleted);
      map.off("draw:drawstart", onDrawStart);
      map.off("draw:drawstop", onDrawStop);
    };
  }, [
    areDrawControlsMounted,
    drawControlsRef,
    onPolygonDrawn,
    onPolygonEdited,
    onPolygonDeleted,
    onDrawStart,
    onDrawStop,
  ]);

  const drawClick = () => {
    setDrawMode(DrawMode.DRAW);
    (
      drawControlsRef!.current as DrawControlExtend
    )._toolbars.draw._modes.polygon.handler.enable();
  };

  const editClick = () => {
    setDrawMode(DrawMode.EDIT);
    (
      drawControlsRef!.current as DrawControlExtend
    )._toolbars.edit._modes.edit.handler.enable();
  };

  const finishEdit = () => {
    setDrawMode(DrawMode.DONE);
    (
      drawControlsRef!.current as DrawControlExtend
    )._toolbars.edit._actionButtons[0].button.click();
  };

  const removeClick = () => {
    setDrawMode(DrawMode.DELETE);
    (
      drawControlsRef!.current as DrawControlExtend
    )._toolbars.edit._modes.remove.handler.enable();
  };

  const finishRemove = () => {
    if (
      drawnPolygon &&
      (drawControlsRef!.current as DrawControlExtend)._map.hasLayer(
        drawnPolygon,
      )
    ) {
      drawnPolygon.remove();
    }

    setDrawMode(DrawMode.IDLE);
    (
      drawControlsRef!.current as DrawControlExtend
    )._toolbars.edit._actionButtons[0].button.click();
  };

  const cancelChange = () => {
    setDrawMode(DrawMode.DONE);
    (
      drawControlsRef!.current as DrawControlExtend
    )._toolbars.edit._actionButtons[1].button.click();
  };

  const sendClick = () => {
    if (!drawnPolygon) return;

    const bounds = L.polygon(drawnPolygon.getLatLngs()).getBounds();
    const bbox: geojson.BBox = [
      bounds.getSouthWest().lng,
      bounds.getSouthWest().lat,
      bounds.getNorthEast().lng,
      bounds.getNorthEast().lat,
    ];

    const feature =
      drawnPolygon.toGeoJSON() as geojson.Feature<geojson.Polygon>;
    feature.geometry.bbox = bbox;

    setAreaType({ id: "custom", label: "Consulta Personalizada" });
    setAreaLayer(feature);
    setDrawnPolygon(null);
    setDrawMode(DrawMode.IDLE);
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

          {drawMode === DrawMode.EDIT && (
            <div className="secondary-buttons-container">
              <button className="secondary-button" onClick={finishEdit}>
                <span>{uiText.secondaryButtons.save}</span>
              </button>
              <button className="secondary-button" onClick={cancelChange}>
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

          {drawMode === DrawMode.DELETE && (
            <div className="secondary-buttons-container">
              <button className="secondary-button" onClick={finishRemove}>
                <span>{uiText.secondaryButtons.confirmDelete}</span>
              </button>
              <button className="secondary-button" onClick={cancelChange}>
                <span>{uiText.secondaryButtons.cancelDelete}</span>
              </button>
            </div>
          )}
        </div>

        <div className="button-section">
          <button
            className="action-button"
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
