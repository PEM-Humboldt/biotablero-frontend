export const SCICats = ["alta", "baja_moderada"] as const;
export const HFCats = ["estable_natural", "dinamica", "estable_alta"] as const;

export const ForestLPKeys = ["perdida", "persistencia", "no_bosque"] as const;
export const ForestLPCategories = {
  perdida: 0,
  persistencia: 1,
  no_bosque: 2,
} as const;

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

export interface ForestLPRawDataPolygon {
  periodo: string;
  perdida: number;
  persistencia: number;
  no_bosque: number;
}

/**
 * Loss Persistence data
 */
export interface LPResponse {
  period: string;
  loss: number;
  persistence: number;
  noForest: number;
}

/**
 * Loss Persistence data with percents
 */
export interface LPAreas extends LPResponse {
  percentagesLoss: number;
  percentagesPersistence: number;
  percentagesNoForest: number;
}
