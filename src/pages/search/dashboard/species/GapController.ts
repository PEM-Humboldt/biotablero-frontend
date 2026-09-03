import type { CancelTokenSource } from "axios";
import SearchAPI from "pages/search/api/searchAPI";
import type { GapSerieData } from "pages/search/types/species";
// TODO: descomentar la importación cuando el endpoint de grupos esté
// import axios from "axios";
import LayerAPI from "pages/search/api/layerAPI";
import { MetricsUtils } from "pages/search/utils/metrics";
import type { RasterLayer } from "pages/search/types/layers";

export class GapController {
  areaType: string = "";
  areaId: number = 0;
  classes: string[] = ["recordGaps"];
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
  async getGapTaxonomicGroups(): Promise<string[]> {
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
   * Fetch the gap values of the available years for a specified taxonomicGroup
   *
   * @param taxonomicGroup - Optional. the taxonomic group used for the metric, if undefined, returns the overall value
   *
   * @returns a Promise resolving into an Object { series: GapSerieData[]; years: number[] }, which contains the series data, and the years in the series
   */
  async getGapData(
    taxonomicGroup?: string,
  ): Promise<{ series: GapSerieData[]; years: number[] }> {
    const requestKey = `gaps_data-${taxonomicGroup ?? "all"}`;

    const { request, source } = SearchAPI.requestMetricsValues(
      "recordGaps",
      this.areaId,
      { params: taxonomicGroup ? { group: taxonomicGroup } : {} },
    );
    this.activeRequests.set(requestKey, source);

    return (
      request
        // TODO: borrar todo el then cuando el endpoint esté actualizado
        .then((res) => {
          const pairedData = res.bin_edges.map((edge, idx) => ({
            x: Number(edge.toFixed(2)),
            y: res.frequency[idx] ?? res.frequency[idx - 1],
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
   * Fetch the gap average values of the available years for the specified taxonomicGroup
   *
   * @param taxonomicGroup - Optional. the taxonomic group used for the metric, if undefined, returns the overall value
   *
   * @returns a Promise resolving into an Object {"year": value }
   */
  async getGapAverage(taxonomicGroup: string): Promise<Record<string, number>> {
    const requestKey = `gaps_average-${taxonomicGroup ?? "all"}`;

    const { request, source } = SearchAPI.requestMetricsValues(
      "currentRecordsGaps_average",
      this.areaId,
      { params: taxonomicGroup ? { group: taxonomicGroup } : {} },
    );
    this.activeRequests.set(requestKey, source);

    return request
      .then(
        // TODO: borrar cuando el endpoint esté actualizado
        (res) => ({ [res.id]: Number(res.average.toFixed(2)) }),

        // TODO: descomentar cuando el endpoint esté actualizado
        // res.reduce<Record<string, number>>((all, current) => {
        //   all[current.id] = Number(current.average.toFixed(2));
        //   return all;
        // }, {}),
      )
      .catch((err) => {
        console.error("Error original:", err);
        throw new Error("Error getting data");
      })
      .finally(() => {
        this.activeRequests.delete(requestKey);
      });
  }

  /**
   * Transforms the graph data into an object to for the CSV download
   *
   * @param series - data array for recordsGaps graph
   *
   * @returns recordsGaps graph data transformed into an array to be downloaded in a csv file
   */
  getDownloadData(series: { id: string; data: { x: number; y: number }[] }[]) {
    const result: { period: string; edge: number; value: number }[] = [];
    series.forEach((serie) =>
      serie.data.forEach((point) => {
        result.push({ period: serie.id, edge: point.x, value: point.y });
      }),
    );
    return result;
  }

  /**
   * Gets the raster layers required for the requested period and taxonomic group
   *
   * @param period - the year of the metric
   * @param taxonomicGroup - Optional. the taxonomic group used for the metric, if undefined, returns the overall value
   *
   * @returns a Promise resolving into RasterLayer[], for the categories in the indicated year and taxonomicgroup
   */
  async getGapLayer(
    period: string,
    taxonomicGroup?: string,
  ): Promise<RasterLayer[]> {
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
        taxonomicGroup,
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
   * Send the cancel signal to all active requests and remove them from the map
   */
  cancelActiveRequests = () => {
    this.activeRequests.forEach((value, key) => {
      value.cancel();
      this.activeRequests.delete(key);
    });
  };
}
