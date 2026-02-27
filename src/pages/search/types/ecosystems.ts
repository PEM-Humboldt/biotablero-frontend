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
