import SearchAPI from "pages/search/api/searchAPI";
import type { RasterLayer } from "pages/search/types/layers";
import { type CancelTokenSource } from "axios";
import type { TimelineHF } from "pages/search/types/humanFootprint";
import { MetricsUtils } from "pages/search/utils/metrics";
import LayerAPI from "pages/search/api/layerAPI";
import type { RasterAPIObject } from "pages/search/types/api";
import type { MetricsTypes } from "pages/search/types/metrics";
import { matchColor } from "pages/search/utils/matchColor";

export class TimelineFootprintController {
  areaType: string = "";
  areaId: number = 0;
  seClasses: { metricId: MetricsTypes; itemId: string; classId: string }[] = [
    {
      metricId: "wetland",
      itemId: "Humedales30",
      classId: "humedal",
    },
    {
      metricId: "tropicalDryForest",
      itemId: "BosqueSeco1000",
      classId: "bosqueSeco",
    },
    {
      metricId: "paramo",
      itemId: "Paramos30",
      classId: "paramo",
    },
  ];
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
    const requests: ReturnType<
      typeof SearchAPI.requestMetricsValues<MetricsTypes>
    >["request"][] = [];

    const requestKeys: string[] = [];

    this.seClasses.forEach((se) => {
      const reqKey = `seData_${se.metricId}`;
      const { request, source } = SearchAPI.requestMetricsValues<
        typeof se.metricId
      >(se.metricId, this.areaId);

      this.activeRequests.set(reqKey, source);
      requestKeys.push(reqKey);
      requests.push(request);
    });

    return Promise.all(requests)
      .then((res) =>
        res.reduce<Record<string, number>>((all, cur) => {
          const dataObj = Array.isArray(cur) ? cur[0] : cur;
          if (!dataObj || typeof dataObj !== "object") {
            return all;
          }

          const { id: _, ...rest } = dataObj as Record<string, number>;
          return { ...all, ...rest };
        }, {}),
      )
      .catch((err) => {
        console.error("Error fetching SE data:", err);
        throw new Error("Error getting ecosystem details");
      })
      .finally(() => {
        requestKeys.forEach((key) => {
          this.activeRequests.delete(key);
        });
      });
  }

  async getSELayer(): Promise<Array<RasterLayer>> {
    const requests: RasterAPIObject["request"][] = [];
    const requestKeys: string[] = [];

    this.seClasses.forEach((se) => {
      const reqKey = `seLayer_${se.metricId}`;
      const { request, source } = SearchAPI.requestMetricsLayer(
        se.metricId,
        se.itemId,
        se.classId,
        this.areaId,
      );
      requests.push(request);
      requestKeys.push(reqKey);
      this.activeRequests.set(reqKey, source);
    });

    const res = await Promise.all(requests);
    requestKeys.forEach((key) => {
      this.activeRequests.delete(key);
    });

    if (res.some((response) => typeof response === "string")) {
      throw new Error("request canceled");
    }

    const layersRequests: Promise<Blob>[] = [];
    res.forEach((layerObj) => {
      const { request, source } = LayerAPI.getLayerData(layerObj);
      layersRequests.push(request);
      this.activeRequests.set(layerObj.layer, source);
    });

    const layerResponses = await Promise.all(layersRequests);
    res.forEach((layerObj) => {
      this.activeRequests.delete(layerObj.layer);
    });

    if (res.some((result) => typeof result === "string")) {
      throw new Error("request canceled");
    }

    const layersBase64Promises: Promise<string>[] = [];

    layerResponses.forEach((response) => {
      const layerBase64 = MetricsUtils.blobToBase64(response);
      layersBase64Promises.push(layerBase64);
    });

    const layersBase64 = await Promise.all(layersBase64Promises);

    return this.seClasses.map(({ metricId }, index) => ({
      id: metricId,
      data: layersBase64[index],
      selected: false,
      paneLevel: 2,
      color: matchColor("hfTimeline")(metricId),
    }));
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
