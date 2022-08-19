export const coverageType = ["N", "S", "T", "X"] as const;
export interface SECoverage {
  area: number;
  type: typeof coverageType[number];
  percentage: number;
}
export interface SEPAData {
  area: number;
  type: string;
}

export interface EDValues extends SEPAData {
  percentage: number;
}
