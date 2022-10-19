import { SmallBarsData } from "pages/search/shared_components/charts/SmallBars";
import {
  portfoliosByTarget,
  portfolioData,
} from "pages/search/types/portfolios";
import formatNumber from "utils/format";

export class TargetsController {
  constructor() {}

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<portfoliosByTarget>} rawData raw data from RestAPI
   *
   * @returns {Array<SmallBarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<portfoliosByTarget>) {
    const tooltips: Array<{
      group: string;
      category: string;
      tooltipContent: Array<string>;
    }> = [];
    const transformedData: Array<SmallBarsData> = rawData.map((element) => {
      const objectData: Array<{ category: string; value: number }> = [];
      element.portfolios_data.forEach((item: portfolioData) => {
        const percentage = (item.value / element.target_national) * 100;
        const info = {
          category: item.short_name,
          value: percentage,
        };
        objectData.push(info);

        tooltips.push({
          group: element.target_name,
          category: item.short_name,
          tooltipContent: [
            item.name,
            `${formatNumber(percentage, 2)} %`,
            `${formatNumber(item.value, 2)} c`,
          ],
        });
      });

      const object = {
        group: element.target_name,
        data: objectData,
      };
      return object;
    });

    const keys = rawData[0]
      ? rawData[0].portfolios_data.map((item) => String(item.short_name))
      : [];

    return { transformedData, keys, tooltips };
  }
}
