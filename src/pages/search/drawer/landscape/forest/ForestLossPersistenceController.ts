import {
  SmallBarsData,
  SmallBarsDataDetails,
} from "pages/search/shared_components/charts/SmallBars";
import BackendAPI from "utils/backendAPI";
import BackendStacAPI from "utils/backendStacAPI";
import {
  ForestLPExt,
  ForestLPRawDataPolygon,
  ForestLPKeys,
  ForestLPValues,
} from "pages/search/types/forest";
import { textsObject } from "pages/search/types/texts";
import formatNumber from "utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";
import { polygonFeature } from "pages/search/types/drawer";

interface ForestLPData {
  forestLP: Array<ForestLPExt>;
  forestPersistenceValue: number;
  forestLPArea?: number;
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
    polygon: polygonFeature | null
  ): Promise<ForestLPData> => {
    if (searchType === "drawPolygon") {
      return BackendStacAPI.requestForestLPData(polygon)
        .then((data: ForestLPRawDataPolygon[]) => {
          const rawData: Array<ForestLPRawDataPolygon> = data;
          const periods: Array<string> = [
            ...new Set(
              rawData.map((item: { periodo: string }) => {
                return item.periodo;
              })
            ),
          ];
          const forestLPArea =
            Object.values(rawData[0])
              .filter((value) => typeof value === "number")
              .reduce((acc, value) => acc + value, 0) ?? 0;
          const forestLP: Array<ForestLPExt> = periods.map((period) => ({
            id: period,
            data: rawData
              .filter((d) => d.periodo === period)
              .reduce((acc, o) => {
                ForestLPKeys.forEach((itemKey) => {
                  if (o[itemKey]) {
                    acc.push({
                      area: o[itemKey],
                      key: itemKey,
                      percentage: (o[itemKey] / forestLPArea) * 100,
                      label: ForestLossPersistenceController.getLabel(itemKey),
                    });
                  }
                });
                return acc;
              }, [] as Array<ForestLPValues>),
          }));

          let forestPersistenceValue =
            forestLP
              .find((item) => item.id === "2016-2021")
              ?.data.find((category) => category.key === "persistencia")
              ?.area ?? 0;

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
      return BackendAPI.requestForestLP(areaType, areaId)
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
}
