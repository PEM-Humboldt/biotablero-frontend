import { SmallBarsData } from "pages/search/shared_components/charts/SmallBars";
import { DPC } from "pages/search/types/connectivity";
import formatNumber from "utils/format";
import { SmallBarTooltip } from "pages/search/types/charts";

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
    const tooltips: Array<SmallBarTooltip> = [];
    const categories: Set<string> = new Set();
    const transformedData: Array<SmallBarsData> = rawData.map((pa) => {
      const object = {
        group: pa.id,
        data: [
          {
            category: pa.key,
            value: pa.value,
          },
        ],
      };

      tooltips.push({
        group: pa.id,
        category: pa.key,
        tooltipContent: [
          pa.name,
          `${formatNumber(pa.value, 2)}`,
          `${formatNumber(pa.area, 2)} ha`,
        ],
      });

      if (!categories.has(pa.key)) {
        categories.add(pa.key);
      }

      return object;
    });

    return { transformedData, keys: Array.from(categories), tooltips };
  }
}
