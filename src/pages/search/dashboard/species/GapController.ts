import type { polygonFeature } from "pages/search/types/dashboard";
import type { CancelTokenSource } from "axios";
import SearchAPI from "pages/search/api/searchAPI";
import type { GapSerieData } from "pages/search/types/species";
import axios from "axios";

// NOTE: ???
import type { textsObject } from "pages/search/types/texts";
import LayerAPI from "pages/search/api/layerAPI";
import { MetricsUtils } from "pages/search/utils/metrics";
import { RasterLayer, ShapeLayer } from "pages/search/types/layers";

export class GapContoller {
  areaType: string = "";
  areaId: number = 0;
  classes: string[] = ["recordGaps"];
  // polygon: polygonFeature | null = null;
  activeRequests: Map<string, CancelTokenSource> = new Map();
  // allClasses: Map<string, Set<string>> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: number) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  setPolygon(polygon: polygonFeature) {
    this.polygon = polygon;
  }

  // /**
  //  * Defines the label for a given data
  //  * @param {string} type data identifier
  //  *
  //  * @returns {string} label to be used for tooltips, legends, etc.
  //  * Max. length = 16 characters
  //  */
  // static getLabel = (type: string): string => {
  //   switch (type) {
  //     case "persistencia":
  //       return "Persistencia";
  //     case "perdida":
  //       return "Pérdida";
  //     case "no_bosque":
  //       return "No bosque";
  //     default:
  //       return "";
  //   }
  // };

  async getGapTaxonomicGroups(): Promise<string[]> {
    // TODO: Eliminar este retorno y descomentar la función cuando el endpoint de grupos esté
    return ["mammals", "birds", "reptiles", "amphibians", "fish", "plants"];

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
   * Returns gap values in a given area
   *
   * @returns Object with forest LP data and persistence value
   */
  async getGapData(
    taxonomicGroup?: string,
  ): Promise<{ series: GapSerieData[]; years: number[] }> {
    const requestKey = taxonomicGroup ?? "all";

    const { request, source } = SearchAPI.requestMetricsValues(
      "recordGaps",
      this.areaId,
      { params: taxonomicGroup ? { group: taxonomicGroup } : {} },
    );
    this.activeRequests.set(requestKey, source);

    return (
      request
        .then((res) => {
          const pairedData = res.bin_edges.map((edge, idx) => ({
            x: Number(edge.toFixed(2)),
            y: res.frequency[idx] ?? 0,
          }));

          return {
            series: [{ id: String(res.id), data: pairedData }],
            years: [Number(res.id)],
          };
        })
        // TODO: descomentar cuando el endpoint esté actualizado
        // .then((res: MetricTypesMap["recordGaps"]) => {
        //   const series = res.reduce<GapSerieData[]>((all, current) => {
        //     const pairedData = current.bin_edges.map((edge, idx) => ({
        //       x: edge,
        //       y: current.frecuency[idx] ?? 0,
        //     }));
        //
        //     const serie = { id: String(current.id), data: pairedData };
        //     all.push(serie);
        //
        //     return all;
        //   }, []);
        //   const years = [...new Set(res.map((r) => Number(r.id)).sort())];
        //   return { series, years };
        // })
        .catch((err) => {
          console.error("Error original:", err);
          throw new Error("Error getting data");
        })
        .finally(() => {
          this.activeRequests.delete(requestKey);
        })
    );
  }

  /**
   * Returns texts for the Gap section
   *
   * @param {String} sectionName section name
   *
   * @returns {Object} texts of forestLP section
   */
  getGapTexts = (sectionName: string): Promise<textsObject> =>
    BackendAPI.requestSectionTexts(sectionName)
      .then((res) => res)
      .catch(() => {
        throw new Error("Error getting data");
      });

  /**
   * Returns data transformed to be downloaded in the csv file
   *
   * @param {ForestLPExt[]} data data array for SmallStackedBars graph in forest loss persistence tab
   *
   * @returns {Object[]} persistenceData graph data transformed to be downloaded in a csv file
   */
  getDownloadData(data: Array<ForestLPExt>) {
    const result: Array<{
      period: string;
      category: string;
      area: number;
      percentage: number;
    }> = [];
    data.forEach((period) =>
      period.data.forEach((obj) => {
        result.push({
          period: period.id,
          category: obj.label,
          area: obj.area,
          percentage: obj.percentage,
        });
      }),
    );
    return result;
  }

  /**
   * Get the raster layers required for a Forest Loss Persistence period
   *
   * @returns { Promise<Array<RasterLayer>> } layers for the categories in the indicated period
   */
  async getGapLayer(
    period: string,
    taxonomicGroup?: string,
  ): Promise<Array<RasterLayer>> {
    if (this.areaId === 0) {
      throw Error("Polygon and area undefined");
    }

    const requests: Array<Promise<{ layer: string }>> = [];

    this.classes.forEach((classId) => {
      const { request, source } = SearchAPI.requestMetricsLayer(
        "recordGaps",
        period,
        classId,
        this.areaId,
        { params: taxonomicGroup ? { group: taxonomicGroup } : {} },
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
