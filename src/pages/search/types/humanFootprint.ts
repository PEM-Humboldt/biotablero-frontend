export const currentHFCategories = [
  "natural",
  "baja",
  "media",
  "alta",
] as const;

export const persistenceHFCategories = [
  "dinamica",
  "estable_natural",
  "estable_alta",
] as const;

export interface currentHFValue {
  value: number;
  category: typeof currentHFCategories[number];
}

export interface currentHFCategories {
  area: number;
  key: typeof currentHFCategories[number];
  percentage: number;
}

export interface hfPersistence {
  area: number;
  key: typeof persistenceHFCategories[number];
  percentage: number;
}
