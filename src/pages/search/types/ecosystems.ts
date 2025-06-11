export type coverageType = "N" | "S" | "T" | "X";

export type coverageLabels =
  | ""
  | "Natural"
  | "Secundaria"
  | "Transformada"
  | "Sin clasificar / Nubes";
export interface Coverage {
  area: number;
  type: coverageType;
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

export const coverageKeys = ["N", "S", "T"] as const;

/**
 * Coverage data from back end
 */
export interface CoverageRawDataPolygon {
  ano: string;
  natural: number;
  secundaria: number;
  transformada: number;
}
