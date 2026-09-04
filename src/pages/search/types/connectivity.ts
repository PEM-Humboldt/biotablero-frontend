import { MetricTypesMap } from "pages/search/types/metrics";

export const currentPAConnKeys = [
  "prot_conn",
  "prot_unconn",
  "unprot",
] as const;
export const timelinePAConnKeys = ["prot", "prot_conn"] as const;
export const currentSEPAConnKeys = [
  "prot_conn",
  "prot_unconn",
  "unprot",
] as const;
export const SEPAEcosystems = ["paramo", "wetland", "dryForest"] as const;

export interface currentPAConn {
  key: (typeof currentPAConnKeys)[number];
  area: number;
  percentage: number;
}

export type DPC = MetricTypesMap["dpc"][0];

export interface timeLinePAConnValues {
  x: string;
  y: number;
}

export interface timelinePAConn {
  key: (typeof timelinePAConnKeys)[number];
  data: Array<timeLinePAConnValues>;
}

export interface currentSEPAConn {
  area: number;
  percentage: number;
  label: string;
  key: (typeof currentSEPAConnKeys)[number];
}
