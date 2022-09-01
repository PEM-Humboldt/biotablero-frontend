export type NOSGroups = "total" | "endemic" | "invasive" | "threatened";

export interface numberOfSpecies {
  id: NOSGroups;
  inferred: number;
  observed: number;
  region_observed: number;
  region_inferred: number;
  region_name: string | null;
}

export interface NOSThresholds {
  id: NOSGroups;
  min_inferred: number;
  min_observed: number;
  max_inferred: number;
  max_observed: number;
}

export interface NOSNational {
  id: NOSGroups;
  max_inferred: number;
  max_observed: number;
}

export const gapLimitKeys = [
  "min_threshold",
  "max_threshold",
  "min",
  "max",
  "min_region",
  "max_region",
] as const;

export type gaps_limits = {
  [Property in typeof gapLimitKeys[number]]: number;
};

export interface concentration extends gaps_limits {
  id: string;
  avg: number;
}

export interface gaps extends gaps_limits {
  id: string;
  avg: number;
  region_name: string;
}

export function isGaps(
  toBeDetermined: gaps | concentration
): toBeDetermined is gaps {
  if ((toBeDetermined as gaps).region_name) return true;
  return false;
}
