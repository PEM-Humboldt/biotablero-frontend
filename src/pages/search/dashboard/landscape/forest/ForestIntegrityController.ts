import RestAPI from "utils/restAPI";
import BackendAPI from "utils/backendAPI";
import { shapeLayer } from "pages/search/types/layers";
import matchColor from "utils/matchColor";
import { ShapeAPIObject } from "pages/search/types/api";
import { CancelTokenSource } from "axios";

export class ForestIntegrityController {
  areaType: string = "";
  areaId: string = "";
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get shape layers in GeoJSON format for forest integrity component
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getLayer = async (): Promise<shapeLayer> => {
    const layerId = "forestIntegrity";

    const reqPromise: ShapeAPIObject = BackendAPI.requestSCIHFGLayer(
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
      paneLevel: 2,
      json: res,
      onEachFeature: onEachFeature,
      layerStyle: this.setLayerStyle(),
    };

    return layerData;
  };

  /**
   * Get shape layer in GeoJSON format for the geofence
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getGeofence = async (): Promise<shapeLayer> => {
    const layerId = "geofence";

    const reqPromise: ShapeAPIObject = RestAPI.requestGeofenceGeometryByArea(
      this.areaType,
      this.areaId
    );

    const layerStyle = () => ({
      stroke: false,
      fillColor: matchColor(layerId)(),
      fillOpacity: 0.6,
    });

    const { request, source } = reqPromise;
    this.activeRequests.set(layerId, source);
    const res = await request;
    this.activeRequests.delete(layerId);

    const layerData = {
      id: layerId,
      paneLevel: 1,
      json: res,
      layerStyle: layerStyle,
    };

    return layerData;
  };

  /**
   * Get shape layers in GeoJSON format for protected areas
   *
   * @param {string} selectedKey category for SCI and HF
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getPALayer = async (selectedKey: string): Promise<shapeLayer> => {
    const sciCat = selectedKey.substring(0, selectedKey.indexOf("-"));
    const hfPers = selectedKey.substring(
      selectedKey.indexOf("-") + 1,
      selectedKey.length
    );

    const reqPromise: ShapeAPIObject = BackendAPI.requestSCIHFPALayer(
      this.areaType,
      this.areaId,
      sciCat,
      hfPers
    );

    const { request, source } = reqPromise;
    this.activeRequests.set(selectedKey, source);
    const res = await request;
    this.activeRequests.delete(selectedKey);

    const layerStyle = () => ({
      stroke: true,
      color: matchColor("border")(),
      fillOpacity: 0,
      weight: 1,
      opacity: 1,
    });

    const layerData = {
      id: selectedKey,
      paneLevel: 3,
      json: res,
      layerStyle: layerStyle,
    };

    return layerData;
  };

  /**
   * Highlight and set the tooltip
   *
   * @param {L.LeafletMouseEvent} event objet
   *
   */
  highlightShapeFeature = (event: L.LeafletMouseEvent) => {
    const SCILabels: Record<string, string> = {
      alta: "Alto",
      baja_moderada: "Bajo Moderado",
    };

    const HFLabels: Record<string, string> = {
      natural: "Natural",
      dinamica: "Dinámica",
      alta: "Alta",
    };

    const feature = event.target;
    const { sci_cat, hf_pers } = feature.feature.properties;

    const tooltipContent = `SCI ${SCILabels[sci_cat]} - HH ${HFLabels[hf_pers]}`;

    feature.bindTooltip(tooltipContent, { sticky: true }).openTooltip();

    feature.setStyle({
      fillOpacity: 1,
    });
  };

  /**
   * Reset the feature style
   *
   * @param {L.LeafletMouseEvent} event objet
   *
   */
  resetShapeHighlight = (event: L.LeafletMouseEvent) => {
    const feature = event.target;
    feature.setStyle({ fillOpacity: 0.6 });
    feature.closePopup();
  };

  /**
   * Set the features style, applying an specific Highlight if necessary
   *
   * @param {string} selectedKey Id of the feature to highlight.
   *
   * @returns {Function} function receiving a geoJsonFeature as required by leaflet
   */
  setLayerStyle =
    (selectedKey = "") =>
    (feature?: { properties: { [x: string]: string } }) => {
      const keys = ["sci_cat", "hf_pers"];
      const key = keys.map((val) => feature?.properties[val]).join("-");
      return {
        stroke: false,
        fillColor: matchColor("SciHf")(key),
        fillOpacity: key === selectedKey ? 1 : 0.6,
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
