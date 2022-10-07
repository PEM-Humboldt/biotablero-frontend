import { MultiSmallBarsData } from "pages/search/shared_components/charts/MultiSmallBars";
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
   * @returns {Array<MultiSmallBarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<portfoliosByTarget>) {
    const transformedData: Array<MultiSmallBarsData> = rawData.map(
      (element) => {
        const objectData: Array<{
          area: number;
          key: string;
          percentage: number;
          label: string;
        }> = [];
        element.portfolios_data.forEach((item: portfolioData) => {
          const info = {
            key: item.short_name,
            area: item.value,
            label: item.name,
            percentage: (item.value / element.target_national) * 100,
          };
          objectData.push(info);
        });

        const object = {
          id: element.target_name,
          data: objectData,
        };
        return object;
      }
    );

    return transformedData;
  }
}
