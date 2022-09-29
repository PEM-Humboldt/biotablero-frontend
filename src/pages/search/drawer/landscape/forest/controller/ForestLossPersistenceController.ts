import { SmallStackedBarsData } from "pages/search/shared_components/charts/SmallStackedBars";
import { ForestLP } from "pages/search/types/forest";

export class ForestLossPersistenceController {
  public constructor() {}

  /**
   * Returns a persistence value from data and latest period
   *
   **/
  getPersistenceValue(data: Array<ForestLP>, latestPeriod: string) {
    const periodData = data.find((item) => item.id === latestPeriod)?.data;
    const persistenceData = periodData
      ? periodData.find((item) => item.key === "persistencia")
      : null;
    return persistenceData ? persistenceData.area : 0;
  }

 /**
   * Returns data to be downloaded in the csv file
   *
   **/
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
