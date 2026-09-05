import SearchAPI from "pages/search/api/searchAPI";
import type { RasterLayer } from "pages/search/types/layers";
import { type CancelTokenSource } from "axios";
import type { TimelineHF } from "pages/search/types/humanFootprint";
import { MetricsUtils } from "pages/search/utils/metrics";
import LayerAPI from "pages/search/api/layerAPI";

type SEKeys = Record<"paramo" | "dryForest" | "wetland", string>;

export class TimelineFootprintController {
  areaType: string = "";
  areaId: number = 0;
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: number) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  async getTimelineData(): Promise<TimelineHF[]> {
    const { request, source } = SearchAPI.requestMetricsValues<"timelineHF">(
      "timelineHF",
      Number(this.areaId),
    );
    this.activeRequests.set("timelineData", source);

    return request
      .catch((err) => {
        console.error("Error original:", err);
        throw new Error("Error getting data");
      })
      .finally(() => {
        this.activeRequests.delete("timelineData");
      });
  }

  async getSEData(): Promise<Record<string, number>> {
    const wetlandReq = SearchAPI.requestMetricsValues<"wetland">(
      "wetland",
      this.areaId,
    );
    const dryForestReq = SearchAPI.requestMetricsValues<"tropicalDryForest">(
      "tropicalDryForest",
      this.areaId,
    );
    const paramoReq = SearchAPI.requestMetricsValues<"paramo">(
      "paramo",
      this.areaId,
    );

    this.activeRequests.set("se_wetland", wetlandReq.source);
    this.activeRequests.set("se_dryForest", dryForestReq.source);
    this.activeRequests.set("se_paramo", paramoReq.source);

    return Promise.all([
      wetlandReq.request,
      dryForestReq.request,
      paramoReq.request,
    ])
      .then(([wetlandRes, dryForestRes, paramoRes]) => {
        const { id: _id1, ...wetlandData } = wetlandRes;
        const { id: _id2, ...dryForestData } = dryForestRes;
        const { id: _id3, ...paramoData } = paramoRes;

        return {
          ...wetlandData,
          ...dryForestData,
          ...paramoData,
        };
      })
      .catch((err) => {
        console.error("Error fetching SE data:", err);
        throw new Error("Error getting ecosystem details");
      })
      .finally(() => {
        this.activeRequests.delete("se_wetland");
        this.activeRequests.delete("se_dryForest");
        this.activeRequests.delete("se_paramo");
      });
  }

  /**
   * Get shape layers in GeoJSON format for special ecosystems
   *
   * @param {string} selectedKey category for special ecosystems
   *
   * @returns { Promise<ShapeLayer> } object with the parameters of the layer
   */
  async getSELayer(selectedKey: keyof SEKeys): Promise<Array<RasterLayer>> {
    const { request, source } = SearchAPI.requestMetricsLayer(
      "timelineHF",
      String(this.areaId),
      selectedKey,
      this.areaId,
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
  }

  /**
   * Send the cancel signal to all active requests and remove them from the map
   */
  cancelActiveRequests = () => {
    this.activeRequests.forEach((value) => {
      value.cancel();
    });

    this.activeRequests.clear();
  };
}
