// TODO: Eliminar

export const persistenceHFCategories = [
  "dinamica",
  "estable_natural",
  "estable_alta",
] as const;

export const timelineHFKeys = [
  "aTotal",
  "paramo",
  "dryForest",
  "wetland",
] as const;

export const timelineHFYears = [
  "1970",
  "1990",
  "2000",
  "2015",
  "2018",
] as const;

export interface hfPersistence {
  area: number;
  key: (typeof persistenceHFCategories)[number];
  percentage: number;
}

export interface hfTimeline {
  key: (typeof timelineHFKeys)[number];
  data: Array<{
    x: (typeof timelineHFYears)[number];
    y: number;
  }>;
}
