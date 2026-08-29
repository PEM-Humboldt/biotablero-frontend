import SearchAPI from "pages/search/api/searchAPI";
import { RasterLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import { timelineHF } from "pages/search/types/humanFootprint";
import { MetricsUtils } from "pages/search/utils/metrics";
import LayerAPI from "pages/search/api/layerAPI";

type SEKeys = Record<"paramo" | "dryForest" | "wetland", string>;
type TimelineMetricKey = "timelineHF";

export class TimelineFootprintController {
  areaType: string = "";
  areaId: string = "";
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  getTimelineData = async (): Promise<Array<timelineHF>> => {
    const { request } = SearchAPI.requestMetricsValues<"timelineHF">(
      "timelineHF",
      Number(this.areaId),
    );

    return request;
  };

  /**
   * Get shape layers in GeoJSON format for timeline human footprint component
   *
   * @returns { Promise<ShapeLayer> } object with the parameters of the layer
   */
  getLayer = async (
    selectedKey: TimelineMetricKey = "timelineHF",
  ): Promise<Array<RasterLayer>> => {
    const { request, source } = SearchAPI.requestMetricsLayer(
      "timelineHF",
      this.areaId,
      selectedKey,
      Number(this.areaId),
    );
    this.activeRequests.set(selectedKey, source);
    const res = await request;
    this.activeRequests.delete(selectedKey);

    if (typeof res === "string") {
      throw new Error("request canceled");
    }

    const { request: layerRequest, source: layerSource } =
      LayerAPI.getLayerData(res);
    this.activeRequests.set(`${selectedKey}-blob`, layerSource);
    const blob = await layerRequest;
    this.activeRequests.delete(`${selectedKey}-blob`);
    const data = await MetricsUtils.blobToBase64(blob);

    return [
      {
        id: selectedKey,
        paneLevel: 1,
        data,
        selected: false,
      },
    ];
  };

  /**
   * Get shape layers in GeoJSON format for special ecosystems
   *
   * @param {string} selectedKey category for special ecosystems
   *
   * @returns { Promise<ShapeLayer> } object with the parameters of the layer
   */
  getSELayer = async (
    selectedKey: keyof SEKeys,
  ): Promise<Array<RasterLayer>> => {
    const { request, source } = SearchAPI.requestMetricsLayer(
      "timelineHF",
      this.areaId,
      selectedKey,
      Number(this.areaId),
    );
    this.activeRequests.set(selectedKey, source);
    const res = await request;
    this.activeRequests.delete(selectedKey);

    if (typeof res === "string") {
      throw new Error("request canceled");
    }

    const { request: layerRequest, source: layerSource } =
      LayerAPI.getLayerData(res);
    this.activeRequests.set(`${selectedKey}-blob`, layerSource);
    const blob = await layerRequest;
    this.activeRequests.delete(`${selectedKey}-blob`);
    const data = await MetricsUtils.blobToBase64(blob);

    return [
      {
        id: selectedKey,
        paneLevel: 2,
        data,
        selected: false,
      },
    ];
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
