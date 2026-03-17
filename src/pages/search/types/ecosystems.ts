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

export type SEKey = "paramo" | "tropicalDryForest" | "wetland";

export const SE_LABELS: Record<SEKey, string> = {
  paramo: "Páramo",
  tropicalDryForest: "Bosque Seco Tropical",
  wetland: "Humedal",
};

export interface SEData {
  type: SEKey;
  area: number;
  values: Record<string, number>;
}

export interface SEDataExtended extends SEData {
  percentage: number;
}
