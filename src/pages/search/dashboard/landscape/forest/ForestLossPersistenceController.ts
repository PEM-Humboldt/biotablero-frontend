import {
  SmallBarsData,
  SmallBarsDataDetails,
} from "pages/search/shared_components/charts/SmallBars";
import BackendAPI from "pages/search/utils/backendAPI";
import SearchAPI from "pages/search/utils/searchAPI";
import {
  ForestLPExt,
  ForestLPRawDataPolygon,
  ForestLPKeys,
  ForestLPCategories,
} from "pages/search/types/forest";
import { textsObject } from "pages/search/types/texts";
import formatNumber from "pages/search/utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";
import { polygonFeature } from "pages/search/types/dashboard";
import { rasterLayer } from "pages/search/types/layers";
import { CancelTokenSource } from "axios";
import { MetricsUtils } from "pages/search/utils/metrics";

interface ForestLPData {
  forestLP: Array<ForestLPExt>;
  forestPersistenceValue: number;
  forestLPArea?: number;
}

export class ForestLossPersistenceController {
  areaType: string = "";
  areaId: string = "";
  polygon: polygonFeature | null = null;
  activeRequests: Map<string, CancelTokenSource> = new Map();

  constructor() {}

  setArea(areaType: string, areaId: string) {
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
   * @param latestPeriod string with range of years for latest period
   * @param searchType string to identify the type of search
   *
   * @returns Object with forest LP data and persistence value
   */
  getForestLPData = (latestPeriod: string): Promise<ForestLPData> => {
    if (this.areaId === "") {
      throw Error("Area undefined");
    }

    return SearchAPI.requestMetricsValues(
      "LossPersistence",
      Number(this.areaId)
    )
      .then((data: ForestLPRawDataPolygon[]) => {
        const mappedData = data.map((item) => {
          const itemMapped = MetricsUtils.mapLPResponse(item);
          return MetricsUtils.calcLPAreas(itemMapped);
        });

        const forestLP: Array<ForestLPExt> = mappedData.map((item) => ({
          id: item.period,
          data: [
            {
              label: "Pérdida",
              key: "perdida",
              area: item.loss,
              percentage: item.percentagesLoss,
            },
            {
              label: "Persistencia",
              key: "persistencia",
              area: item.persistence,
              percentage: item.percentagesPersistence,
            },
            {
              label: "No bosque",
              key: "no_bosque",
              area: item.noForest,
              percentage: item.percentagesNoForest,
            },
          ],
        }));

        const periodData = mappedData.find(
          ({ period }) => period === latestPeriod
        );
        const forestPersistenceValue = periodData?.persistence ?? 0;

        forestLP.sort((pA, pB) => {
          const yearA = parseInt(pA.id.substring(0, pA.id.indexOf("-")));
          const yearB = parseInt(pB.id.substring(0, pB.id.indexOf("-")));
          return yearA - yearB;
        });
        return {
          forestLP,
          forestPersistenceValue,
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
      })
    );
    return result;
  }

  /**
   * Get the raster layers required for a Forest Loss Persistence period
   *
   * @returns { Promise<Array<rasterLayer>> } layers for the categories in the indicated period
   */
  async getLayers(period: string): Promise<Array<rasterLayer>> {
    if (this.areaId) {
      const requests: Array<Promise<any>> = [];

      Object.values(ForestLPCategories).forEach((value) => {
        const { request, source } = SearchAPI.requestMetricsLayer(
          "LossPersistence",
          period,
          value,
          Number(this.areaId)
        );
        requests.push(request);
        this.activeRequests.set(`${period}-${value}`, source);
      });

      const res = await Promise.all(requests);

      ForestLPKeys.forEach((category) => {
        this.activeRequests.delete(`${period}-${category}`);
      });

      if (res.includes("request canceled")) throw Error("request canceled");

      const layersRequests: Array<Promise<Blob>> = [];
      res.forEach((response) => {
        const request = SearchAPI.getLayerData(response);
        layersRequests.push(request);
      });

      const layerResponses = await Promise.all(layersRequests);

      const layersBase64Promises: Array<Promise<string>> = [];

      layerResponses.forEach((response) => {
        const layerBase64 = MetricsUtils.blobToBase64(response);
        layersBase64Promises.push(layerBase64);
      });

      const layersBase64 = await Promise.all(layersBase64Promises);

      let response = ForestLPKeys.map((category, index) => ({
        id: category,
        data: layersBase64[index],
        selected: false,
        paneLevel: 2,
      }));

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
