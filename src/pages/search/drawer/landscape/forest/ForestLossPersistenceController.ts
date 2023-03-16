import {
  SmallBarsData,
  SmallBarsDataDetails,
} from "pages/search/shared_components/charts/SmallBars";
import SearchAPI from "utils/searchAPI";
import biabAPI from "utils/biabAPI";
import { ForestLPExt } from "pages/search/types/forest";
import { textsObject } from "pages/search/types/texts";
import formatNumber from "utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";
import { Polygon } from "pages/search/types/drawer";

interface ForestLPData {
  forestLP: Array<ForestLPExt>;
  forestPersistenceValue: number;
}

export class ForestLossPersistenceController {
  constructor() {}

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
      case "ganancia":
        return "Ganancia";
      case "no_bosque":
        return "No bosque";
      default:
        return "";
    }
  };

  /**
   * Returns forest LP data and persistence value in a given area
   *
   * @param areaType area type
   * @param areaId area id
   * @param latestPeriod string with range of years for latest period
   * @param searchType string to identify the type of search
   * @param polygon Coordinates of polygon
   *
   * @returns Object with forest LP data and persistence value
   */
  getForestLPData = (
    areaType: string,
    areaId: string | number,
    latestPeriod: string,
    searchType: "definedArea" | "drawPolygon",
    polygon: Polygon | null
  ): Promise<ForestLPData> => {
    if (searchType === "drawPolygon") {
      return biabAPI
        .requestForestLPData(polygon)
        .then((data) => {
          const periods = ["2000-2005", "2006-2010", "2011-2015", "2016-2021"];
          const rawData = eval(data.files.table_pp);
          const forestLP: Array<ForestLPExt> = periods.map((period) => ({
            id: period,
            data: rawData
              .filter((d: { period: string }) => d.period === period)
              .map(
                (o: {
                  area: number;
                  key: string;
                  percentage: number;
                  label: string;
                }) => ({
                  area: o.area,
                  key: o.key,
                  percentage: o.percentage,
                  label: ForestLossPersistenceController.getLabel(o.key),
                })
              ),
          }));
          const periodData = rawData.find(
            (item: { period: string; key: string }) =>
              item.period === latestPeriod && item.key === "persistencia"
          ).area;
          return {
            forestLP,
            forestPersistenceValue: periodData ? periodData : 0,
          };
        })
        .catch(() => {
          throw new Error("Error getting data");
        });
    }

    return SearchAPI.requestForestLP(areaType, areaId)
      .then((data) => {
        const forestLP = data.map((item) => ({
          ...item,
          data: item.data.map((element) => ({
            ...element,
            label: ForestLossPersistenceController.getLabel(element.key),
          })),
        }));

        const periodData = data.find((item) => item.id === latestPeriod)?.data;
        const persistenceData = periodData
          ? periodData.find((item) => item.key === "persistencia")
          : null;
        const forestPersistenceValue = persistenceData
          ? persistenceData.area
          : 0;

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
    SearchAPI.requestSectionTexts(sectionName)
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
}
