import SearchAPI from "pages/search/api/searchAPI";
import { textsObject } from "pages/search/types/texts";
import { MetricInfoResponse } from "../types/metrics";
import { MetricsTypes } from "../types/metrics";

export const mapMetricInfoToTexts = (
  metricInfoList: Array<MetricInfoResponse> = [],
): textsObject => {
  const value: textsObject = {
    info: "",
    cons: "",
    meto: "",
    quote: "",
    helper: "",
  };

  metricInfoList.forEach(({ type, description }) => {
    value[type] = description;
  });

  return value;
};

export const getMetricTexts = (metric: MetricsTypes): Promise<textsObject> =>
  SearchAPI.requestMetricsInfo(metric)
    .then(mapMetricInfoToTexts)
    .catch(() => {
      throw new Error("Error getting data");
    });
