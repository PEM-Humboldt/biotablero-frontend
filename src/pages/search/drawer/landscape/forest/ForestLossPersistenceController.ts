import { SmallStackedBarsData } from "pages/search/shared_components/charts/SmallStackedBars";
import { ForestLP } from "pages/search/types/forest";

export class ForestLossPersistenceController {
  constructor() {}

  /**
   * Returns a persistence value from data and latest period
   *
   * @param {ForestLP[]} data array of the response data for forest loss persistence
   * @param {String} latestPeriod string with range of years for latest period
   *
   * @returns {Number} persistenceData forest persistence value
   */
  getPersistenceValue(data: Array<ForestLP>, latestPeriod: string): number {
    const periodData = data.find((item) => item.id === latestPeriod)?.data;
    const persistenceData = periodData
      ? periodData.find((item) => item.key === "persistencia")
      : null;
    return persistenceData ? persistenceData.area : 0;
  }

 /**
   * Returns data transformed to be downloaded in the csv file
   *
   * @param {SmallStackedBarsData[]} data array of data for nivo bar graph of forest loss persistence
   *
   * @returns {Object} persistenceData graph data transformed to be downloaded in a csv file
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
