import formatNumber from "pages/search/utils/format";
import BackendAPI from "pages/search/utils/backendAPI";
import { shapeLayer } from "pages/search/types/layers";
import matchColor from "pages/search/utils/matchColor";
import { ShapeAPIObject } from "pages/search/types/api";
import { CancelTokenSource } from "axios";
import { hasValidGeoJSONData } from "pages/search/utils/GeoJsonUtils";

type SEKeys = Record<"paramo" | "dryForest" | "wetland", string>;

export class TimelineFootprintController {
  areaType: string = "";
  areaId: string = "";
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get shape layers in GeoJSON format for timeline human footprint component
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getLayer = async (): Promise<shapeLayer> => {
    const layerId = "hfPersistence";

    const reqPromise: ShapeAPIObject = BackendAPI.requestHFPersistenceLayer(
      this.areaType,
      this.areaId
    );

    const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
      layer.on({
        mouseover: (event) => this.highlightShapeFeature(event),
        mouseout: (event) => this.resetShapeHighlight(event),
      });
    };

    const { request, source } = reqPromise;
    this.activeRequests.set(layerId, source);
    const res = await request;
    this.activeRequests.delete(layerId);

    const layerData = {
      id: layerId,
      paneLevel: 1,
      json: res,
      onEachFeature: onEachFeature,
      layerStyle: this.setLayerStyle(),
    };

    return layerData;
  };

  /**
   * Get shape layers in GeoJSON format for special ecosystems
   *
   * @param {string} selectedKey category for special ecosystems
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getSELayer = async (selectedKey: keyof SEKeys): Promise<shapeLayer> => {
    try {
      const seType: SEKeys = {
        paramo: "Páramo",
        dryForest: "Bosque Seco Tropical",
        wetland: "Humedal",
      };

      const reqPromise: ShapeAPIObject =
        BackendAPI.requestHFLayerBySEInGeofence(
          this.areaType,
          this.areaId,
          seType[selectedKey]
        );

      const { request, source } = reqPromise;
      this.activeRequests.set(selectedKey, source);
      const res = await request;
      this.activeRequests.delete(selectedKey);

      if (hasValidGeoJSONData(res)) {
        const layerStyle = () => ({
          stroke: false,
          color: matchColor("hfTimeline")(selectedKey),
          fillOpacity: 0.6,
          weight: 1,
        });

        return {
          id: selectedKey,
          paneLevel: 3,
          json: res,
          layerStyle: layerStyle,
        };
      } else {
        throw new Error("Invalid GeoJSON");
      }
    } catch (error: any) {
      if (error != "Error: Invalid GeoJSON") {
        throw new Error(
          error instanceof Error ? error.message : "Error al obtener la capa"
        );
      } else {
        return { id: "", paneLevel: 0, json: { type: "FeatureCollection" } };
      }
    }
  };

  /**
   * Highlight and set the tooltip
   *
   * @param {L.LeafletMouseEvent} event objet
   */
  highlightShapeFeature = (event: L.LeafletMouseEvent) => {
    type TooltipLabel = Record<
      "estable_natural" | "dinamica" | "estable_alta",
      string
    >;

    const tooltipLabel: TooltipLabel = {
      estable_natural: "Estable Natural",
      dinamica: "Dinámica",
      estable_alta: "Estable Alta",
    };

    const feature = event.target;
    const optionsTooltip = { sticky: true };

    const key = feature.feature.properties.key as keyof TooltipLabel;

    feature
      .bindTooltip(
        `<b>${tooltipLabel[key]}:</b>
        <br>${formatNumber(feature.feature.properties.area, 0)} ha`,
        optionsTooltip
      )
      .openTooltip();

    feature.setStyle({
      fillOpacity: 1,
    });
  };

  /**
   * Reset the feature style
   *
   * @param {L.LeafletMouseEvent} event objet
   */
  resetShapeHighlight = (event: L.LeafletMouseEvent) => {
    const feature = event.target;
    feature.setStyle({ fillOpacity: 0.6 });
    feature.closePopup();
  };

  /**
   * Set the features style, applying an specific Highlight if neccesary
   *
   * @param {string} selectedKey Id of the feature to highlight.
   *
   * @returns {Function} function receiving a geoJsonFeature as required by leaflet
   */
  setLayerStyle =
    (selectedKey = "") =>
    (feature?: { properties: { key: string; id: string } }) => {
      return {
        stroke: false,
        fillColor: matchColor("hfPersistence")(feature?.properties.key),
        fillOpacity: feature?.properties.key === selectedKey ? 1 : 0.6,
      };
    };

  /**
   * Send the cancel signal to all active requests and remove them from the map
   */
  cancelActiveRequests = () => {
    this.activeRequests.forEach((value, key) => {
      value.cancel();
      this.activeRequests.delete(key);
    });
  };
}
