import {
  portfoliosByTarget,
  portfolioData,
} from "pages/search/types/portfolios";

export class TargetsController {
  constructor() {}

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<portfoliosByTarget>} rawData raw data from RestAPI
   *
   * @returns {Array<BarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<portfoliosByTarget>) {
    const transformedData = rawData.map((element) => {
      const object: Record<string, string | number> = {};
      element.portfolios_data.map((item: portfolioData) => {
        object["id"] = String(element.target_name);
        object[String(item.short_name)] = item.value;
        object[`${String(item.short_name)}Label`] = item.name;
        object[`${String(item.short_name)}Percentage`] =
          (item.value / element.target_national) * 100;
      });
      return object;
    });
    const keys = rawData[0]
      ? rawData[0].portfolios_data.map((item) => String(item.short_name))
      : [];

    return { transformedData, keys };
  }
}
