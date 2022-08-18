export const coverageLabels = [
  "Natural",
  "Secundaria",
  "Transformada",
] as const;
export const coverageType = ["N", "S", "T", "X"] as const;

export interface SEValues {
  area: number;
  percentage?: number;
  type: string;
}

export interface CoverageData {
  area: number;
  type: typeof coverageType[number];
  percentage: number;
  key: typeof coverageType[number];
  label: typeof coverageLabels[number];
}

export interface PAData {
  area: number;
  label: string;
  key: string;
  percentage: number;
}
