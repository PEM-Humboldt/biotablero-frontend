import type { CancelTokenSource } from "axios";
import SearchAPI from "pages/search/api/searchAPI";
import type { textsObject } from "pages/search/types/texts";

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

const CONTEXT_AREA_ID_VALUE = 1;

export class ObservedRichnessController {
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
  async getTaxonomicGroups(): Promise<string[]> {
    // TODO: Eliminar este retorno cuando el endpoint de grupos esté
    return Promise.resolve([]);

    // TODO: descomentar la función cuando el endpoint de grupos esté
    // const request = SearchAPI.makeGetRequest("/metrics/recordGaps/groups");
    // const source = axios.CancelToken.source();
    // this.activeRequests.set("recordGaps-groups", source);
    //
    // return request
    //   .then((res) => res as string[])
    //   .catch((err) => {
    //     console.error("Error original:", err);
    //     throw new Error("Error getting data");
    //   })
    //   .finally(() => {
    //     this.activeRequests.delete("recordGaps-groups");
    //   });
  }

  /**
   * Fetch the observed richness values for a specified taxonomicGroup
   *
   * @param taxonomicGroup - Optional. the taxonomic group used for the metric, if undefined, returns the overall value
   *
   * @returns a Promise resolving into a ObservedRichnessDataType
   */
  private async getData(
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
  async getCurrentData(taxonomicGroup?: string) {
    return this.getData(this.areaId, taxonomicGroup);
  }

  /**
   * Fetch the observed richness values for a specified taxonomicGroup of the context area
   *
   * @param taxonomicGroup - Optional. the taxonomic group used for the metric, if undefined, returns the overall value
   *
   * @returns a Promise resolving into a ObservedRichnessDataType
   */
  async getContextData(taxonomicGroup?: string) {
    return this.getData(CONTEXT_AREA_ID_VALUE, taxonomicGroup);
  }

  /**
   * Returns texts for the observed richness section
   *
   * @param {String} sectionName section name
   *
   * @returns {Object} texts of forestLP section
   */
  async getTexts(sectionName: string): Promise<textsObject> {
    // TODO: Eliminar este retorno cuando el back con los textos esté al día y actualizar el método
    return Promise.resolve({
      info: "",
      cons: "",
      meto: "",
      quote: "",
    });

    // TODO: Actualizar funcion cuando el back con los textos esté al día
    // BackendAPI.requestSectionTexts(sectionName)
    //   .then((res) => res)
    //   .catch(() => {
    //     throw new Error("Error getting data");
    //   });
  }

  /**
   * Transforms the graph data into an object to for the CSV download
   *
   * @param series - data array for recordsGaps graph
   *
   * @returns recordsGaps graph data transformed into an array to be downloaded in a csv file
   */
  getDownloadData(data: {
    current: ObservedRichnessDataType | null;
    context: ObservedRichnessDataType | null;
  }) {
    return [data.current, data.context]
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
