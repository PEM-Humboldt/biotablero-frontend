import { SmallBarsData, SmallBarsDataDetails } from "pages/search/shared_components/charts/SmallBars";
import {
  portfoliosByTarget,
  portfolioData,
} from "pages/search/types/portfolios";
import { SmallBarTooltip } from "pages/search/types/charts";
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
    const tooltips: Array<SmallBarTooltip> = [];
    const transformedData: Array<SmallBarsData> = rawData.map((target) => {
      const objectData: Array<SmallBarsDataDetails> = [];
      target.portfolios_data.forEach((portfolio: portfolioData) => {
        const percentage = (portfolio.value / target.target_national) * 100;
        const info = {
          category: portfolio.short_name,
          value: percentage,
        };
        objectData.push(info);

        tooltips.push({
          group: target.target_name,
          category: portfolio.short_name,
          tooltipContent: [
            portfolio.name,
            `${formatNumber(percentage, 2)} %`,
            `${formatNumber(portfolio.value, 2)} c`,
          ],
        });
      });

      const object = {
        group: target.target_name,
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
