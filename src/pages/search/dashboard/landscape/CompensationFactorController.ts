import BackendAPI from "utils/backendAPI";
import {
  shapeLayer,
  compensationFactorPropierties,
} from "pages/search/types/layers";
import matchColor from "utils/matchColor";
import { ShapeAPIObject } from "pages/search/types/api";
import { CancelTokenSource } from "axios";

export class CompensationFactorController {
  areaType: string | null = null;
  areaId: string | null = null;
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get shape layers in GeoJSON format for compensation factor component
   *
   * @returns { Promise<shapeLayer> } object with the parameters of the layer
   */
  getLayer = async (): Promise<shapeLayer> => {
    const layerId = "fc";

    const reqPromise: ShapeAPIObject = BackendAPI.requestBiomesbyEALayer(
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
        `<b>Bioma-IAvH:</b> ${feature.feature.properties.name_biome}
          <br><b>Factor de compensación:</b> ${feature.feature.properties.compensation_factor}`,
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
   * @returns {Function} function receiving a geoJsonFeature as required by leaflet
   */
  setLayerStyle =
    () => (feature?: { properties: compensationFactorPropierties }) => ({
      stroke: false,
      fillColor: matchColor("fc")(feature?.properties.compensation_factor),
      fillOpacity: 0.6,
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
