import { formatNumber } from "@utils/format";
import { RasterLayer } from "pages/search/types/layers";
import { matchColor } from "pages/search/utils/matchColor";
import { CancelTokenSource } from "axios";

import { LargeStackedBarData } from "@composites/charts/LargeStackedBar";
import { MetricTypesMap } from "pages/search/types/metrics";
import SearchAPI from "pages/search/api/searchAPI";
import { MetricsUtils } from "pages/search/utils/metrics";
import LayerAPI from "pages/search/api/layerAPI";

type HFCategory = keyof Omit<MetricTypesMap["currentHF"], "id">;

type HFRange = {
  max: number;
  label: HFCategory;
};

const HFCategoriesRanges: HFRange[] = [
  { max: 0, label: "Natural" },
  { max: 15, label: "Baja" },
  { max: 30, label: "Media" },
  { max: 50, label: "Alta" },
  { max: Infinity, label: "Muy Alta" },
];

export class CurrentFootprintController {
  areaType: string = "";
  areaId: number = 0;
  activeRequests: Map<string, CancelTokenSource> = new Map();
  classes: Set<string> = new Set();
  itemId: string = "";

  constructor() {}

  setArea(areaType: string, areaId: number) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get the average of the current human footprint for the current area
   *
   * @returns { Promise<{ id: string; average: number, category: string }> }
   */
  getCurrentHFAverage() {
    return SearchAPI.requestMetricsValues<"currentHF_average">(
      "currentHF_average",
      this.areaId,
    ).then((averageValues) => {
      const average = Number(averageValues.average);

      return {
        ...averageValues,
        category: this.getHFCategory(average),
      };
    });
  }

  private getHFCategory(value: number): HFCategory {
    if (Number.isNaN(value)) return "Natural";

    for (const range of HFCategoriesRanges) {
      if (value <= range.max) {
        return range.label;
      }
    }

    return "Natural";
  }

  /**
   * Get the current human footprint values for the current area
   *
   * @returns { Promise<SmallStackedBarData[]>}
   */
  getCurrentHFValues() {
    return SearchAPI.requestMetricsValues<"currentHF">(
      "currentHF",
      this.areaId,
    ).then((res) => {
      const { id, ...classes } = res;
      this.itemId = id;
      this.classes = new Set(
        Object.keys(classes).filter(
          (classId) => classes[classId as keyof typeof classes] != 0.0,
        ),
      );
      return this.transformData(res);
    });
  }

  /**
   * Get layers for current human footprint component
   *
   * @returns { Promise<RasterLayer> } layers for the classes in the current area
   */
  getCurrentHFLayers = async (): Promise<Array<RasterLayer>> => {
    if (this.areaId) {
      const requests: Array<Promise<{ layer: string }>> = [];

      this.classes.forEach((classId) => {
        const { request, source } = SearchAPI.requestMetricsLayer(
          "currentHF",
          this.itemId,
          classId,
          Number(this.areaId),
        );
        requests.push(request);
        this.activeRequests.set(classId, source);
      });

      const res = await Promise.all(requests);

      this.classes.forEach((classId) => {
        this.activeRequests.delete(classId);
      });

      if (res.some((result) => typeof result === "string")) {
        throw new Error("request canceled");
      }
      const layersRequests: Array<Promise<Blob>> = [];
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

      const layersBase64Promises: Array<Promise<string>> = [];

      layerResponses.forEach((response) => {
        const layerBase64 = MetricsUtils.blobToBase64(response);
        layersBase64Promises.push(layerBase64);
      });

      const layersBase64 = await Promise.all(layersBase64Promises);

      return [...this.classes].map((classId, index) => ({
        id: classId,
        data: layersBase64[index],
        selected: false,
        paneLevel: 2,
      }));
    }
    throw Error("Polygon and area undefined");
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
     * No sé si hay una mejor forma de ordenar el objeto resultado,
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
