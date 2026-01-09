import { formatNumber } from "@utils/format";
import BackendAPI from "pages/search/api/backendAPI";
import { RasterLayer } from "pages/search/types/layers";
import matchColor from "pages/search/utils/matchColor";
import { ShapeAPIObject } from "pages/search/types/api";
import { CancelTokenSource } from "axios";

import { LargeStackedBarData } from "@composites/charts/LargeStackedBar";
import { MetricTypesMap } from "pages/search/types/metrics";
import SearchAPI from "pages/search/api/searchAPI";
import { currentHFCategories } from "pages/search/types/humanFootprint";
import { MetricsUtils } from "pages/search/utils/metrics";
export class CurrentFootprintController {
  areaType: string = "";
  areaId: string = "";
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get shape layers in GeoJSON format for current human footprint component
   *
   * @returns { Promise<ShapeLayer> } object with the parameters of the layer
   */
  getCurrentHFLayers = async (period: string): Promise<Array<RasterLayer>> => {
    if (this.areaId) {
      const requests: Array<Promise<{ layer: string }>> = [];

      currentHFCategories.forEach((categoryId, index) => {
        const { request, source } = SearchAPI.requestMetricsLayer(
          "CurrentHF",
          period,
          index + 1,
          Number(this.areaId),
        );
        requests.push(request);
        this.activeRequests.set(categoryId, source);
      });

      const res = await Promise.all(requests);

      currentHFCategories.forEach((categoryId) => {
        this.activeRequests.delete(categoryId);
      });

      if (res.includes("request canceled")) throw Error("request canceled");

      const layersRequests: Array<Promise<Blob>> = [];
      res.forEach((response) => {
        const request = SearchAPI.getLayerData(response);
        layersRequests.push(request);
      });

      const layerResponses = await Promise.all(layersRequests);

      const layersBase64Promises: Array<Promise<string>> = [];

      layerResponses.forEach((response) => {
        const layerBase64 = MetricsUtils.blobToBase64(response);
        layersBase64Promises.push(layerBase64);
      });

      const layersBase64 = await Promise.all(layersBase64Promises);

      return currentHFCategories.map((category, index) => ({
        id: category,
        data: layersBase64[index],
        selected: false,
        paneLevel: 2,
      }));
    }
    throw Error("Polygon and area undefined");
  };

  /**
   * Highlight and set the tooltip
   *
   * @param {L.LeafletMouseEvent} event objet
   *
   */
  highlightShapeFeature = (event: L.LeafletMouseEvent) => {
    type TooltipLabel = Record<"natural" | "baja" | "media" | "alta", string>;

    const tooltipLabel: TooltipLabel = {
      natural: "Natural",
      baja: "Baja",
      media: "Media",
      alta: "Alta",
    };

    const feature = event.target;
    const optionsTooltip = { sticky: true };

    const key = feature.feature.properties.key as keyof TooltipLabel;

    feature
      .bindTooltip(
        `<b>${tooltipLabel[key]}:</b>
        <br>${formatNumber(feature.feature.properties.area, 0)} ha`,
        optionsTooltip,
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
    (feature?: { properties: { key: string; id: string } }) => {
      return {
        stroke: false,
        fillColor: matchColor("hfCurrent")(feature?.properties.key),
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

  transformData = (
    resData: MetricTypesMap["currentHF"],
  ): LargeStackedBarData[] => {
    if (!resData) return [];

    const { id, ...categories } = resData;

    const totalArea: number = Object.values(categories).reduce(
      (total: number, value) => total + Number(value),
      0,
    );

    /**
     * TODO: No sé si hay una mejor forma de ordenar el objeto resultado,
     * intenté sacar los valores directamente de las keys de MetricTypesMap["currentHF"]
     * pero el mismo interprete de typescript me los pasaba ya desordenados
     */
    const order: (keyof Omit<MetricTypesMap["currentHF"], "id">)[] = [
      "Natural",
      "Baja",
      "Media",
      "Alta",
      "Muy Alta",
    ];

    return order.map((key) => {
      const area = Number(categories[key]) || 0;

      return {
        key,
        area,
        percentage: totalArea ? area / totalArea : 0,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      };
    });
  };
}
