import {
  SmallBarsData,
  SmallBarsDataDetails,
} from "pages/search/shared_components/charts/SmallBars";
import BackendAPI from "utils/backendAPI";
import SearchAPI from "utils/searchAPI";
import {
  ForestLPExt,
  ForestLPRawDataPolygon,
  ForestLPKeys,
  ForestLPCategories,
} from "pages/search/types/forest";
import { textsObject } from "pages/search/types/texts";
import formatNumber from "utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";
import { polygonFeature } from "pages/search/types/drawer";
import RestAPI from "utils/restAPI";
import base64 from "pages/search/utils/base64ArrayBuffer";
import { rasterLayer } from "pages/search/SearchContext";
import { CancelTokenSource } from "axios";

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
  getForestLPData = (
    latestPeriod: string,
    searchType: "definedArea" | "drawPolygon"
  ): Promise<ForestLPData> => {
    if (searchType === "drawPolygon") {
      return SearchAPI.requestForestLPData(this.polygon)
        .then((data: ForestLPRawDataPolygon[]) => {
          const rawData: Array<ForestLPRawDataPolygon> = data;
          const {
            perdida = 0,
            persistencia = 0,
            no_bosque = 0,
          } = rawData[0] || {};
          const forestLPArea = perdida + persistencia + no_bosque;
          const forestLP = rawData.map((item) => ({
            id: item.periodo,
            data: ForestLPKeys.map((category) => ({
              area: item[category],
              key: category,
              percentage: (item[category] / forestLPArea) * 100,
              label: ForestLossPersistenceController.getLabel(category),
            })),
          }));

          const latestPeriodData = rawData.find(
            (item) => item.periodo === latestPeriod
          );
          const forestPersistenceValue = latestPeriodData
            ? latestPeriodData.persistencia
            : rawData[rawData.length - 1].persistencia;

          // There is no logical reason to do this, but if you don't, only in this case (I don't
          // know if it's when drawing a polygon or when using the new backend and response
          // structure) the periods are reversed after being passed to the nivo component
          forestLP.reverse();
          return {
            forestLP,
            forestPersistenceValue,
            forestLPArea,
          };
        })
        .catch(() => {
          throw new Error("Error getting data");
        });
    } else {
      return BackendAPI.requestForestLP(this.areaType, this.areaId)
        .then((data) => {
          const forestLP = data.map((item) => ({
            ...item,
            data: item.data.map((element) => ({
              ...element,
              label: ForestLossPersistenceController.getLabel(element.key),
            })),
          }));

          const periodData = data.find(({ id }) => id === latestPeriod)?.data;
          const persistenceData = periodData?.find(
            ({ key }) => key === "persistencia"
          );
          const forestPersistenceValue = persistenceData?.area ?? 0;

          return {
            forestLP,
            forestPersistenceValue,
          };
        })
        .catch(() => {
          throw new Error("Error getting data");
        });
    }
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

  async getLayers(period: string): Promise<Array<rasterLayer>> {
    if (this.areaType && this.areaId) {
      const requests: Array<Promise<any>> = [];
      ForestLPKeys.forEach((category) => {
        const { request, source } = RestAPI.requestForestLPLayer(
          this.areaType ?? "",
          this.areaId ?? "",
          period,
          category
        );
        requests.push(request);
        this.activeRequests.set(`${period}-${category}`, source);
      });

      const res = await Promise.all(requests);

      ForestLPKeys.forEach((category) => {
        this.activeRequests.delete(`${period}-${category}`);
      });

      if (res.includes("request canceled")) throw Error("request canceled");

      return ForestLPKeys.map((category, idx) => ({
        id: category,
        data: `data:${res[idx].headers["content-type"]};base64, ${base64(
          res[idx].data
        )}`,
        selected: false,
        paneLevel: 2,
      }));
    } else if (this.polygon) {
      const requests: Array<Promise<{ layer: string }>> = [];
      ForestLPKeys.forEach((category) => {
        const { request, source } = SearchAPI.requestForestLPLayer(
          period,
          ForestLPCategories[category],
          this.polygon!
        );
        requests.push(request);
        this.activeRequests.set(`${period}-${category}`, source);
      });
      const res = await Promise.all(requests);

      return res.map((response, idx) => {
        const base64Image = response.layer;
        return {
          id: `${period}-${ForestLPKeys[idx]}`,
          data: `data:image/png;base64,${base64Image}`,
          selected: false,
          paneLevel: 2,
        };
      });
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
