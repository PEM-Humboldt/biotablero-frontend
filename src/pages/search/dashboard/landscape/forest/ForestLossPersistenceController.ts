import {
  SmallBarsData,
  SmallBarsDataDetails,
} from "@composites/charts/SmallBars";
import BackendAPI from "pages/search/api/backendAPI";
import SearchAPI from "pages/search/api/searchAPI";
import LayerAPI from "pages/search/api/layerAPI";
import { ForestLPExt } from "pages/search/types/forest";
import { textsObject } from "pages/search/types/texts";
import { formatNumber } from "@utils/format";
import { type SmallBarTooltip } from "@composites/charts/SmallBars";
import { polygonFeature } from "pages/search/types/dashboard";
import { RasterLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import { MetricsUtils } from "pages/search/utils/metrics";
import { MetricTypesMap } from "pages/search/types/metrics";

interface ForestLPData {
  forestLP: Array<ForestLPExt>;
  currentPersistence: number;
}

export class ForestLossPersistenceController {
  areaType: string = "";
  areaId: number = 0;
  polygon: polygonFeature | null = null;
  activeRequests: Map<string, CancelTokenSource> = new Map();
  allClasses: Map<string, Set<string>> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: number) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  setPolygon(polygon: polygonFeature) {
    this.polygon = polygon;
  }

  /**
   * Defines the label for a given data
   * @param {string} type data identifier
   *
   * @returns {string} label to be used for tooltips, legends, etc.
   * Max. length = 16 characters
   */
  static getLabel = (type: string): string => {
    switch (type) {
      case "persistencia":
        return "Persistencia";
      case "perdida":
        return "Pérdida";
      case "no_bosque":
        return "No bosque";
      default:
        return "";
    }
  };

  /**
   * Returns forest LP data and persistence value in a given area
   *
   * @returns Object with forest LP data and persistence value
   */
  getForestLPData = (): Promise<ForestLPData> => {
    return SearchAPI.requestMetricsValues<"lossPersistence">(
      "lossPersistence",
      this.areaId,
    )
      .then((data: MetricTypesMap["lossPersistence"]) => {
        const mappedData = data.map((periodObj) => {
          const { id, ...classes } = periodObj;
          this.allClasses.set(
            id,
            new Set(
              Object.keys(classes).filter(
                (classId) => classes[classId as keyof typeof classes] != 0.0,
              ),
            ),
          );
          const totalHa = Object.values(classes).reduce(
            (prev, curr) => prev + curr,
            0,
          );
          return {
            id,
            data: Object.keys(classes).map((classId) => ({
              area: periodObj[classId as keyof typeof classes],
              key: classId,
              percentage:
                (periodObj[classId as keyof typeof classes] * 100) / totalHa,
              label: classId,
            })),
          };
        });

        mappedData.sort((pA, pB) => {
          const yearA = parseInt(pA.id.substring(0, pA.id.indexOf("-")));
          const yearB = parseInt(pB.id.substring(0, pB.id.indexOf("-")));
          return yearA - yearB;
        });
        // Ni modo, tocó quemar el Persistencia aquí
        const currentPersistence =
          data.find(
            (period) => period.id === mappedData[mappedData.length - 1].id,
          )?.Persistencia || 0;

        return {
          forestLP: mappedData,
          currentPersistence,
        };
      })
      .catch(() => {
        throw new Error("Error getting data");
      });
  };

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<ForestLPExt>} rawData raw data from RestAPI
   *
   * @returns {Array<SmallBarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<ForestLPExt>) {
    const tooltips: Array<SmallBarTooltip> = [];
    const categories: Set<string> = new Set();
    const transformedData: Array<SmallBarsData> = rawData.map((period) => {
      const objectData: Array<SmallBarsDataDetails> = [];
      period.data.forEach((category) => {
        const info = {
          category: category.key,
          value: category.area,
        };
        objectData.push(info);

        tooltips.push({
          group: period.id,
          category: category.key,
          tooltipContent: [
            category.label,
            `${formatNumber(category.area, 2)} ha`,
            `${formatNumber(category.percentage, 3)} %`,
          ],
        });

        if (!categories.has(category.key)) {
          categories.add(category.key);
        }
      });

      const object = {
        group: period.id,
        data: objectData,
      };
      return object;
    });

    return { transformedData, keys: Array.from(categories), tooltips };
  }

  /**
   * Returns texts of the forestLP section
   *
   * @param {String} sectionName section name
   *
   * @returns {Object} texts of forestLP section
   */
  getForestLPTexts = (sectionName: string): Promise<textsObject> =>
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
  async getLayers(period: string): Promise<Array<RasterLayer>> {
    if (this.areaId) {
      const requests: Array<Promise<{ layer: string }>> = [];

      this.allClasses.get(period)!.forEach((classId) => {
        const { request, source } = SearchAPI.requestMetricsLayer(
          "lossPersistence",
          period,
          classId,
          this.areaId,
        );
        requests.push(request);
        this.activeRequests.set(`${period}-${classId}`, source);
      });

      const res = await Promise.all(requests);

      this.allClasses.get(period)!.forEach((classId) => {
        this.activeRequests.delete(`${period}-${classId}`);
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

      let response = [...this.allClasses.get(period)!].map(
        (classId, index) => ({
          id: classId,
          data: layersBase64[index],
          selected: false,
          paneLevel: 2,
        }),
      );

      return response;
    }
    throw Error("Polygon and area undefined");
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
