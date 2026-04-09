export interface Coverage {
  area: number;
  percentage: number;
}

export interface SEPAData {
  area: number;
  type: string;
}

export interface SEPADataExt extends SEPAData {
  percentage: number;
}
export interface seDetails {
  national_percentage: number;
  total_area: string;
}

export const SETypes = ["paramo", "tropicalDryForest", "wetland"] as const;

export type SEKey = (typeof SETypes)[number];

export const SELabels: Record<SEKey, string> = {
  paramo: "Páramo",
  tropicalDryForest: "Bosque Seco Tropical",
  wetland: "Humedal",
};

export interface SEData {
  type: SEKey;
  area: number;
  values: Record<string, number>;
  percentage: number;
}
