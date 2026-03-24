import SearchAPI from "pages/search/api/searchAPI";
import { CancelTokenSource } from "axios";
import { SEData } from "pages/search/types/ecosystems";

/**
 * Controller for Strategic Ecosystems Component
 * @class
 */
export class StrategicEcosystemsController {
  areaType: string = "";
  areaId: number = 0;
  constructor() {}

  /**
   * Set area values for the controller
   *  @param {string} areaType Value for the type of area selected
   *  @param {number} areaId Value for the id of area selected
   */
  setArea(areaType: string, areaId: number) {
    this.areaType = areaType;
    this.areaId = areaId;
  }

  /**
   * Get the metric values ​​of strategic ecosystems in coverages for the current area.
   *
   * @returns { Promise<SmallStackedBarData[]>}
   */
  async getStrategicEcosystemsValues(): Promise<SEData[]> {
    const keys = ["paramo", "tropicalDryForest", "wetland"] as const;

    const requests = keys.map((key) =>
      SearchAPI.requestMetricsValues<typeof key>(key, this.areaId),
    );

    const responses = await Promise.all(requests);

    const result: SEData[] = responses.map((res, index) => {
      const { id, ...values } = res;

      const totalArea = Object.values(values).reduce(
        (acc, value) => acc + value,
        0,
      );

      return {
        type: keys[index],
        area: Number(totalArea),
        values,
      };
    });

    return result;
  }
}
