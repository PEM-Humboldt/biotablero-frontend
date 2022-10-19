import { SmallBarsData } from "pages/search/shared_components/charts/SmallBars";
import { DPC } from "pages/search/types/connectivity";
import formatNumber from "utils/format";

export class CurrentPAConnectivityController {
  constructor() {}

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {Array<DPC>} rawData raw data from RestAPI
   *
   * @returns {Array<SmallBarsData>} transformed data ready to be used by graph component
   */
  getGraphData(rawData: Array<DPC>) {
    const tooltips: Array<{
      group: string;
      category: string;
      tooltipContent: Array<string>;
    }> = [];
    const transformedData: Array<SmallBarsData> = rawData.map((element) => {
      const object = {
        group: element.id,
        data: [
          {
            category: element.key,
            value: element.value,
          },
        ],
      };

      tooltips.push({
        group: element.id,
        category: element.key,
        tooltipContent: [
          element.name,
          `${formatNumber(element.value, 2)}`,
          `${formatNumber(element.area, 2)} ha`,
        ],
      });

      return object;
    });

    const keys = rawData
      ? [...new Set(rawData.map((item) => String(item.key)))]
      : [];

    return { transformedData, keys, tooltips };
  }
}
