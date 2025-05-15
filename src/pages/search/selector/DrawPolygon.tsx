import { useContext, useEffect, useState } from "react";
import { Done } from "@mui/icons-material";
import L, { Polygon } from "leaflet";
import type { DrawEvents } from "leaflet";
import * as geojson from "geojson";

import EditPolygonIcon from "pages/search/selector/EditIcon";
import PolygonIcon from "pages/search/selector/PolygonIcon";
import RemoveIcon from "pages/search/selector/RemoveIcon";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";

const DrawPolygon = () => {
  const context = useContext(SearchContext);
  const { setOnEditControlMounted } = context as SearchContextValues;
  const [drawControl, setDrawControl] = useState<any>();
  const [drawnPolygon, setDrawnPolygon] =
    useState<Polygon<geojson.Polygon> | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  useEffect(() => {
    setOnEditControlMounted(onEditControlMounted);
  }, []);

  const onEditControlMounted = (control: any) => {
    const newDrawControl = control;
    setDrawControl(newDrawControl);
    newDrawControl._map.on("draw:created", onPolygonDrawn);
    newDrawControl._map.on("draw:edited", onPolygonEdited);
    newDrawControl._map.on("draw:deleted ", onPolygoDeleted);
  };

  /**
   * Listens for the polygon created event
   *
   * @param {DrawEvents.Created} e LeafletDraw created event
   */
  const onPolygonDrawn = (e: DrawEvents.Created) => {
    setDrawnPolygon(e.layer as Polygon);
  };

  /**
   * Listens for the polygon edited event
   *
   * @param {Object} e LeafletDraw event
   */
  const onPolygonEdited = (e: DrawEvents.Edited) => {
    const editedLayers = e.layers.getLayers();
    if (editedLayers.length > 0) {
      setDrawnPolygon(editedLayers[0] as Polygon);
    }
  };

  /**
   * Listens for the polygon deleted event
   *
   * @param {Object} e LeafletDraw event
   */
  const onPolygoDeleted = (e: DrawEvents.Deleted) => {
    setDrawnPolygon(null);
  };

  /**
   * Handles draw button click
   */
  const drawClick = () => {
    drawControl!._toolbars.draw._modes.polygon.handler.enable();
  };

  /**
   * Handles edit button click
   */
  const editClick = () => {
    setIsEditing(true);
    drawControl!._toolbars.edit._modes.edit.handler.enable();
  };

  /**
   * Handles finishEdit button click
   */
  const finishEdit = () => {
    setIsEditing(false);
    drawControl!._toolbars.edit._actionButtons[0].button.click();
  };

  /**
   * Handles remove button click
   */
  const removeClick = () => {
    setIsRemoving(true);
    drawControl!._toolbars.edit._modes.remove.handler.enable();
  };

  /**
   * Handles finishRemove button click
   */
  const finishRemove = () => {
    setIsRemoving(false);
    drawControl!._toolbars.edit._actionButtons[0].button.click();
  };

  /**
   * Handles cancelEdit and cancelRemove buttons click
   */
  const cancelChange = () => {
    setIsEditing(false);
    setIsRemoving(false);
    drawControl!._toolbars.edit._actionButtons[1].button.click();
  }

  /**
   * Handles send button click. Set the drawn polygon as the area layer in context to be consulted.
   */
  const sendClick = () => {
    const polygonBounds = L.polygon(drawnPolygon!.getLatLngs()).getBounds();
    const bbox: geojson.BBox = [
      polygonBounds.getSouthWest().lng,
      polygonBounds.getSouthWest().lat,
      polygonBounds.getNorthEast().lng,
      polygonBounds.getNorthEast().lat,
    ];
    const geojson =
      drawnPolygon!.toGeoJSON() as geojson.Feature<geojson.Polygon>;
    geojson.geometry.bbox = bbox;

    const { setAreaType, setAreaLayer } = context as SearchContextValues;
    setAreaType({ id: "custom", label: "Consulta Personalizada" });
    setAreaLayer(geojson);
    setDrawnPolygon(null);
  };

  return (
    <div className="drawPAcc">
      <div style={{ paddingBottom: 15 }}>
        Seleccione cada una de las opciones...
      </div>
      <div>
        <button id="draw" disabled={drawnPolygon !== null}>
          <div style={{ display: "flex" }} onClick={drawClick}>
            <PolygonIcon />
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>
              Dibujar
            </span>
          </div>
        </button>
        <p>instrucciones crear...</p>
      </div>
      <div>
        <button id="edit" disabled={drawnPolygon === null || isRemoving}>
          <div style={{ display: "flex" }} onClick={editClick}>
            <EditPolygonIcon />
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>Editar</span>
          </div>
        </button>
        <p>instrucciones editar ..</p>
        <button id="finishEdit" disabled={!isEditing}>
          <div style={{ display: "flex" }} onClick={finishEdit}>
            Poner un icono
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>
              Finalizar edición
            </span>
          </div>
        </button>
        <button id="cancelEdit" disabled={!isEditing}>
          <div style={{ display: "flex" }} onClick={cancelChange}>
            Poner un icono
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>
              Cancelar edición
            </span>
          </div>
        </button>
      </div>
      <div>
        <button id="remove" disabled={drawnPolygon === null || isEditing}>
          <div style={{ display: "flex" }} onClick={removeClick}>
            <RemoveIcon />
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>Borrar</span>
          </div>
        </button>
        <p>instrucciones borrar ..</p>
        <button id="finishRemove" disabled={!isRemoving}>
          <div style={{ display: "flex" }} onClick={finishRemove}>
            Poner un icono
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>
              Finalizar borrado de polígono
            </span>
          </div>
        </button>
        <button id="cancelRemove" disabled={!isRemoving}>
          <div style={{ display: "flex" }} onClick={cancelChange}>
            Poner un icono
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>
              Cancelar edición
            </span>
          </div>
        </button>
      </div>
      <div>
        <button
          id="send"
          disabled={drawnPolygon === null || isEditing || isRemoving}
        >
          <div style={{ display: "flex" }} onClick={sendClick}>
            <Done />
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>
              Enviar polygono
            </span>
          </div>
        </button>
        <p>instrucciones enviar...</p>
      </div>
    </div>
  );
};

export default DrawPolygon;
