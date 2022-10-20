export const SCICats = ["alta", "baja_moderada"] as const;
export const HFCats = ["estable_natural", "dinamica", "estable_alta"] as const;

export const ForestLPKeys = [
  "persistencia",
  "perdida",
  "ganancia",
  "no_bosque",
] as const;

export interface SCIHF {
  hf_pers: typeof HFCats[number];
  sci_cat: typeof SCICats[number];
  pa: string;
  area: number;
}

export interface ForestLP {
  id: string;
  data: Array<{
    area: number;
    key: typeof ForestLPKeys[number];
    percentage: number;
  }>;
}

export interface ForestLPExt {
  id: string;
  data: Array<{
    area: number;
    key: typeof ForestLPKeys[number];
    percentage: number;
    label: string;
  }>;
}
