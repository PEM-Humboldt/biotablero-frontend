import SearchAPI from "pages/search/api/searchAPI";
import type { TextsObject } from "pages/search/types/texts";
import { MetricsTypes } from "pages/search/types/metrics";

/**
 * Gets the texts for a given metric.
 *
 * @param metric - The metric whose texts should be retrieved.
 * @returns The texts associated with the metric.
 * @throws If the metric information cannot be retrieved.
 */
export const getMetricTexts = (metric: MetricsTypes): Promise<TextsObject> =>
  SearchAPI.requestMetricsInfo(metric)
    .then((res) => {
      const value: TextsObject = {
        info: "",
        cons: "",
        meto: "",
        quote: "",
        helper: "",
      };
      res.forEach(({ type, description }) => {
        value[type] = description;
      });
      return value;
    })
    .catch(() => {
      throw new Error("Error getting data");
    });
