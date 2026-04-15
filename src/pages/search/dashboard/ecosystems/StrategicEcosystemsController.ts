import SearchAPI from "pages/search/api/searchAPI";
import { SEData, SETypes } from "pages/search/types/ecosystems";

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
  async getStrategicEcosystemsValues(areaHa: number): Promise<SEData[]> {
    const requests = SETypes.map((key) =>
      SearchAPI.requestMetricsValues(key, this.areaId),
    );

    const responses = await Promise.all(requests);

    return responses.map((res, index) => {
      const { id, ...values } = res;

      const SEArea = Object.values(values).reduce(
        (acc, value) => acc + value,
        0,
      );

      const percentage = areaHa > 0 ? SEArea / areaHa : 0;

      return {
        type: SETypes[index],
        area: Number(SEArea),
        percentage,
        values,
      };
    });
  }
}
