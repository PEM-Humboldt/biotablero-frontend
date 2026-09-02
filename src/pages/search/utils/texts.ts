import { textsObject } from "pages/search/types/texts";
import { MetricInfoResponse } from "../types/metrics";

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
