import BackendAPI from "pages/search/utils/backendAPI";
import {
  ShapeLayer,
  ConnectivityFeaturePropierties,
} from "pages/search/types/layers";
import matchColor from "pages/search/utils/matchColor";
import { ShapeAPIObject } from "pages/search/types/api";
import formatNumber from "pages/search/utils/format";
import { CancelTokenSource } from "axios";

export class CurrentSEPAConnectivityController {
  areaType: string | null = null;
  areaId: string | null = null;
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get shape layers in GeoJSON format for a connectivity component
   *
   * @returns { Promise<ShapeLayer> } object with the parameters of the layer
   */
  getLayer = async (): Promise<ShapeLayer> => {
    const layerId = "currentSEPAConn";

    const reqPromise: ShapeAPIObject = BackendAPI.requestDPCLayer(
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

  getSELayer = async (
    layerId: string,
    layerName: string
  ): Promise<ShapeLayer> => {
    try {
      const reqPromise: ShapeAPIObject = BackendAPI.requestPAConnSELayer(
        this.areaType ?? "",
        this.areaId ?? "",
        layerName
      );

      const { request, source } = reqPromise;
      this.activeRequests.set(layerId, source);

      const res = await request;
      this.activeRequests.delete(layerId);

      const layerStyle = () => ({
        stroke: false,
        fillColor: matchColor(layerId)(),
        fillOpacity: 0.6,
      });

      const layerData: ShapeLayer = {
        id: layerId,
        paneLevel: 2,
        json: res,
        layerStyle: layerStyle,
      };

      return layerData;
    } catch (error) {
      this.activeRequests.delete(layerId);
      throw new Error(
        error instanceof Error ? error.message : "Error al obtener la capa"
      );
    }
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
    (feature?: { properties: ConnectivityFeaturePropierties }) => ({
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
