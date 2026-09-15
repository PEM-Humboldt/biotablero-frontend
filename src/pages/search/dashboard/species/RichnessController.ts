import type { CancelTokenSource } from "axios";
import LayerAPI from "pages/search/api/layerAPI";
import SearchAPI from "pages/search/api/searchAPI";
import { MetricsUtils } from "pages/search/utils/metrics";

export type ObservedRichnessDataType = {
  total: number;
  threatenedTotal: number;
  invasive: number;
  endemic: number;
  endemicThreatened: number;
  barValues: {
    CR: number;
    EN: number;
    VU: number;
  };
};

const NATIONAL_AREA_ID_VALUE = 1;

export class RichnessController {
  areaType: string = "";
  areaId: number = 0;
  classes: string[] = ["recordGaps"];
  taxonomicGroup: string = "";
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: number) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Fetch the available taxonomic groups for the metric
   *
   * @returns a Promise resolving into a list of groups
   */
  async getRichnessTaxonomicGroups(): Promise<string[]> {
    const { request, source } = SearchAPI.requestMetricGroups("statsOnSpecies");
    this.activeRequests.set("ORichness-groups", source);

    return request
      .catch((err) => {
        console.error("Error original:", err);
        throw new Error("Error getting data");
      })
      .finally(() => {
        this.activeRequests.delete("ORichness-groups");
      });
  }

  /**
   * Fetch the observed richness values for a specified taxonomicGroup
   *
   * @param taxonomicGroup - Optional. the taxonomic group used for the metric, if undefined, returns the overall value
   *
   * @returns a Promise resolving into a ObservedRichnessDataType
   */
  private async getTableData(
    areaId: number,
    taxonomicGroup?: string,
  ): Promise<ObservedRichnessDataType> {
    const requestKey = `gaps_data-${taxonomicGroup ?? "all"}`;
    const { request, source } = SearchAPI.requestMetricsValues(
      "statsOnSpecies",
      areaId,
      { params: taxonomicGroup ? { group: taxonomicGroup } : {} },
    );
    this.activeRequests.set(requestKey, source);

    return request
      .then((res) => {
        return {
          total: res.total,
          threatenedTotal: res.threatened_total,
          invasive: res.invasive,
          endemic: res.endemic,
          endemicThreatened: res.endemic_threatened,
          barValues: {
            CR: res.threatened_cr,
            EN: res.threatened_en,
            VU: res.threatened_vu,
          },
        };
      })
      .catch((err) => {
        console.error("Error original:", err);
        throw new Error("Error getting data");
      })
      .finally(() => {
        this.activeRequests.delete(requestKey);
      });
  }

  /**
   * Fetch the observed richness values for a specified taxonomicGroup in the current area
   *
   * @param taxonomicGroup - Optional. the taxonomic group used for the metric, if undefined, returns the overall value
   *
   * @returns a Promise resolving into a ObservedRichnessDataType
   */
  async getAreaRichnessData(taxonomicGroup?: string) {
    return this.getTableData(this.areaId, taxonomicGroup);
  }

  /**
   * Fetch the observed richness values for a specified taxonomicGroup from the national area
   *
   * @param taxonomicGroup - Optional. the taxonomic group used for the metric, if undefined, returns the overall value
   *
   * @returns a Promise resolving into a ObservedRichnessDataType
   */
  async getNationalRichnessData(taxonomicGroup?: string) {
    return this.getTableData(NATIONAL_AREA_ID_VALUE, taxonomicGroup);
  }

  async getRichnessGraphSerie(taxonomicGroup?: string) {
    const requestKey = "richnessSerie";
    const { request, source } = SearchAPI.requestMetricsValues(
      "richness",
      this.areaId,
      { params: taxonomicGroup ? { group: taxonomicGroup } : {} },
    );
    this.activeRequests.set(requestKey, source);

    return request
      .catch((err) => {
        console.error("Error original:", err);
        throw new Error("Error getting data");
      })
      .finally(() => {
        this.activeRequests.delete(requestKey);
      });
  }

  async getRichnessLayer(taxonomicGroup?: string) {
    if (this.areaId === 0) {
      throw Error("Polygon and area undefined");
    }

    const { request, source } = SearchAPI.requestMetricsLayer(
      "richness",
      "2026",
      "richness",
      this.areaId,
      taxonomicGroup,
    );

    this.activeRequests.set("2026", source);

    const res = await Promise.all([request]);

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

    if (layersRequests.some((result) => typeof result === "string")) {
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

  /**
   * Transforms the graph data into an object to for the CSV download
   *
   * @param series - data array for recordsGaps graph
   *
   * @returns recordsGaps graph data transformed into an array to be downloaded in a csv file
   */
  makeDownloadRichnessData(data: {
    current: ObservedRichnessDataType | null;
    national: ObservedRichnessDataType | null;
  }) {
    return [data.current, data.national]
      .filter((item): item is ObservedRichnessDataType => item !== null)
      .map((item: ObservedRichnessDataType) => ({
        total: item.total,
        threatened_total: item.threatenedTotal,
        endemic: item.endemic,
        endemic_threatened: item.endemicThreatened,
        invasive: item.invasive,
        threatened_cr: item.barValues.CR,
        threatened_en: item.barValues.EN,
        threatened_vu: item.barValues.VU,
      }));
  }

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
