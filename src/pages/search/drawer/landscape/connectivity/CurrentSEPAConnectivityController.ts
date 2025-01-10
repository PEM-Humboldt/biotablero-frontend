import BackendAPI from "utils/backendAPI";
import RestAPI from "utils/restAPI";
import {
  shapeLayer,
  connectivityFeaturePropierties,
} from "pages/search/types/layers";
import matchColor from "utils/matchColor";
import { RestAPIObject } from "pages/search/types/api";
import formatNumber from "utils/format";

export class CurrentSEPAConnectivityController {
  areaType: string | null = null;
  areaId: string | null = null;
  activeRequests: Map<any, any> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get shape layers in GeoJSON format for a connectivity component
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getLayer = async (): Promise<shapeLayer> => {
    const layerId = "CurrentSEPAConn";

    const reqPromise: RestAPIObject = BackendAPI.requestDPCLayer(
      this.areaType ?? "",
      this.areaId ?? ""
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
   * Get shape layers in GeoJSON format for a connectivity component
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getGeofence = async (): Promise<shapeLayer> => {
    const layerId = "geofence";

    const reqPromise: RestAPIObject = RestAPI.requestGeofenceGeometryByArea(
      this.areaType ?? "",
      this.areaId ?? ""
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
   * Highlight and set the tooltip
   *
   * @param {L.LeafletMouseEvent} event objet
   *
   */
  highlightShapeFeature = (event: L.LeafletMouseEvent) => {
    const feature = event.target;
    const optionsTooltip = { sticky: true };

    feature
      .bindTooltip(
        `<b>${feature.feature.properties.name}:</b>
          <br>dPC ${formatNumber(feature.feature.properties.value, 2)}
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
   *
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
    (feature?: { properties: connectivityFeaturePropierties }) => ({
      stroke: false,
      fillColor: matchColor("dpc")(feature?.properties.dpc_cat),
      fillOpacity: feature?.properties.id === selectedKey ? 1 : 0.6,
    });

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
