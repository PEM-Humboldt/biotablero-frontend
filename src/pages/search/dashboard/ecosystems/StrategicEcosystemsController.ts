import SearchAPI from "pages/search/api/searchAPI";
import { SEData, SETypes } from "pages/search/types/ecosystems";
import { CancelTokenSource } from "axios";

/**
 * Controller for Strategic Ecosystems Component
 * @class
 */
export class StrategicEcosystemsController {
  areaType: string = "";
  areaId: number = 0;
  activeRequests: Map<string, CancelTokenSource> = new Map();
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
    const requests = SETypes.map((key) => {
      const requestKey = `strategic-ecosystem-values-${key}`;
      const { request, source } = SearchAPI.requestMetricsValues(
        key,
        this.areaId,
      );
      this.activeRequests.set(requestKey, source);
      return request.finally(() => {
        this.activeRequests.delete(requestKey);
      });
    });

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

  /**
   * Cancel all active requests and remove them from the map
   */
  cancelActiveRequests = () => {
    this.activeRequests.forEach((value, key) => {
      value.cancel();
      this.activeRequests.delete(key);
    });
  };
}
