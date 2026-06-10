import SearchAPI from "pages/search/api/searchAPI";
import { CancelTokenSource } from "axios";
import { SmallStackedBarData } from "@composites/charts/SmallStackedBar";
import { SEKey } from "pages/search/types/ecosystems";

/**
 * Controller for Protected Areas Distribution Component
 * @class
 */
export class ProtectedAreasDistributionController {
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
   * Get the protected areas values for the selected strategic ecosystem
   *
   * @returns { Promise<SmallStackedBarData[]>}
   */
  getProtectedAreasDistributionValues(
    SEType: SEKey,
    totalArea: number,
  ): Promise<SmallStackedBarData[]> {
    const metricId = `protectedAreas_${SEType}` as const;
    const requestKey = `protected-areas-distribution-values-${SEType}`;
    const { request, source } = SearchAPI.requestMetricsValues(
      metricId,
      this.areaId,
    );
    this.activeRequests.set(requestKey, source);

    return request
      .then((response) => {
        const { id, ...rawValues } = response;
        const items = Object.entries(rawValues)
          .filter(([, value]) => value > 0)
          .map(([key, area]) => ({
            key,
            label: key,
            area,
          }));

        const isNoProtected = (value: string) =>
          value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s|_/g, "") === "noprotegida";

        const hasNoProtected = items.some((item) => isNoProtected(item.key));
        const PATotalArea = items.reduce(
          (acc, item) => (isNoProtected(item.key) ? acc : acc + item.area),
          0,
        );

        if (!hasNoProtected) {
          const noProtectedArea = Math.max(totalArea - PATotalArea, 0);
          items.push({
            area: noProtectedArea,
            label: "No Protegida",
            key: "No Protegida",
          });
        }

        return items.map((item) => ({
          ...item,
          percentage: totalArea > 0 ? item.area / totalArea : 0,
        }));
      })
      .finally(() => {
        this.activeRequests.delete(requestKey);
      });
  }

  /**
   * Send the cancel signal to all active requests and remove them from the map
   */
  cancelActiveRequests = () => {
    this.activeRequests.forEach((value, key) => {
      value.cancel();
      this.activeRequests.delete(key);
    });
  };
}
