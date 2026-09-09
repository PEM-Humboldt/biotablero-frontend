import SearchAPI from "pages/search/api/searchAPI";
import type { RasterLayer } from "pages/search/types/layers";
import { type CancelTokenSource } from "axios";
import type { TimelineHF } from "pages/search/types/humanFootprint";
import { MetricsUtils } from "pages/search/utils/metrics";
import LayerAPI from "pages/search/api/layerAPI";
import type { MetricsTypes, MetricTypesMap } from "pages/search/types/metrics";
import { matchColor } from "pages/search/utils/matchColor";

export const hfTimelineLUT = [
  {
    key: "aTotal",
    label: "Área consulta",
    classId: "poligono",
    itemId: undefined,
  },
  {
    key: "paramo",
    label: "Páramo",
    classId: "paramo",
    itemId: "Paramos30",
  },
  {
    key: "tropicalDryForest",
    label: "Bosque Seco Tropical",
    classId: "bosqueSeco",
    itemId: "BosqueSeco1000",
  },
  {
    key: "wetland",
    label: "Humedal",
    classId: "humedal",
    itemId: "Humedales30",
  },
] as const;

export class TimelineFootprintController {
  areaType: string = "";
  areaId: number = 0;
  activeRequests: Map<string, CancelTokenSource> = new Map();
  seClasses = hfTimelineLUT.reduce<
    { metricId: MetricsTypes; itemId: string; classId: string }[]
  >((acc, item) => {
    if (item.itemId) {
      acc.push({
        metricId: item.key as MetricsTypes,
        itemId: item.itemId,
        classId: item.classId,
      });
    }
    return acc;
  }, []);

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

  async getSELayer(metricId: keyof MetricTypesMap): Promise<RasterLayer[]> {
    const targetSE = this.seClasses.find((se) => se.metricId === metricId);
    if (!targetSE) {
      return [];
    }

    const reqKey = `seLayer_${targetSE.metricId}`;
    const { request, source } = SearchAPI.requestMetricsLayer(
      targetSE.metricId,
      targetSE.itemId,
      targetSE.classId,
      this.areaId,
    );
    this.activeRequests.set(reqKey, source);

    const result = await Promise.allSettled([request]);
    this.activeRequests.delete(reqKey);

    const layerResult = result[0];
    if (layerResult.status !== "fulfilled" || !layerResult.value) {
      return [];
    }

    const layerObj = layerResult.value;
    const { request: dataRequest, source: dataSource } =
      LayerAPI.getLayerData(layerObj);
    this.activeRequests.set(layerObj.layer, dataSource);

    const dataResults = await Promise.allSettled([dataRequest]);
    this.activeRequests.delete(layerObj.layer);

    const blobResult = dataResults[0];
    if (blobResult.status !== "fulfilled" || !blobResult.value) {
      return [];
    }

    const base64 = await MetricsUtils.blobToBase64(blobResult.value);

    return [
      {
        id: targetSE.metricId,
        data: base64,
        selected: true,
        paneLevel: 2,
        color: matchColor("hfTimeline")(targetSE.metricId),
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
