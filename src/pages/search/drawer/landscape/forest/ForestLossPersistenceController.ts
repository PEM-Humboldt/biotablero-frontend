import { SmallStackedBarsData } from "pages/search/shared_components/charts/SmallStackedBars";
import SearchAPI from "utils/searchAPI";
import { textsObject } from "pages/search/types/texts";

const getLabel = {
  persistencia: "Persistencia",
  perdida: "Pérdida",
  ganancia: "Ganancia",
  no_bosque: "No bosque",
};

interface ForestLPData {
  forestLP: Array<SmallStackedBarsData>;
  forestPersistenceValue: number;
};

export class ForestLossPersistenceController {
  constructor() {}

  /**
   * Returns forest LP data and persistence value in a given area
   *
   * @param {String} areaType area type
   * @param {String | Number} areaId area id
   * @param {String} latestPeriod string with range of years for latest period
   *
   * @returns {Object} Object with forest LP data and persistence value
   */
  getForestLPData = (areaType: string, areaId: string | number, latestPeriod: string): Promise<ForestLPData>  =>
    SearchAPI.requestForestLP(areaType, areaId)
      .then((data) => {

        const forestLP = data.map((item) => ({
          ...item,
          data: item.data.map((element) => ({
            ...element,
            label: getLabel[element.key],
          })),
        }));

        const periodData = data.find((item) => item.id === latestPeriod)?.data;
        const persistenceData = periodData
          ? periodData.find((item) => item.key === "persistencia")
          : null;
        const forestPersistenceValue = persistenceData ? persistenceData.area : 0

        return {
          forestLP,
          forestPersistenceValue,
        };
      })
      .catch(() => {
        throw new Error('Error getting data');
      });

  /**
   * Returns texts of the forestLP section
   *
   * @param {String} sectionName section name
   *
   * @returns {Object} texts of forestLP section
   */
  getForestLPTexts = (sectionName: string): Promise<textsObject>  =>
    SearchAPI.requestSectionTexts(sectionName)
    .then((res) => res)
    .catch(() => {
      throw new Error('Error getting data');
    });

  /**
   * Returns data transformed to be downloaded in the csv file
   *
   * @param {SmallStackedBarsData[]} data data array for SmallStackedBars graph in forest loss persistence tab
   *
   * @returns {Object[]} persistenceData graph data transformed to be downloaded in a csv file
   */
  getDownloadData(data: Array<SmallStackedBarsData>) {
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
