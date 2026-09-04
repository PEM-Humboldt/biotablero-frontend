import SearchAPI from "pages/search/api/searchAPI";
import { TextsObject } from "pages/search/types/texts";
import { MetricsTypes } from "../types/metrics";

/**
 * Gets the texts for a given metric.
 *
 * @param {MetricsTypes} metric Metric identifier
 * @returns {Promise<TextsObject>} Promise containing the metric texts
 * @throws {Error} If the metric information cannot be retrieved
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

