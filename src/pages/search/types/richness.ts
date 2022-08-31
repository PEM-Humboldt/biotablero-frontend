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
