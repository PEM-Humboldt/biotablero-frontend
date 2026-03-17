export type MetricDataStructure<
  MetricLabelKey extends string,
  MetricValueKeys extends string,
> = {
  [K in MetricLabelKey]: string;
} & {
  [K in MetricValueKeys]: number;
};

export type MetricTypesMap = {
  coverage: MetricDataStructure<
    "id",
    "Natural" | "Secundaria" | "Transformada"
  >;
  lossPersistence: Array<
    MetricDataStructure<"id", "Perdida" | "Persistencia" | "No Bosque">
  >;
  currentHF: MetricDataStructure<
    "id",
    "Natural" | "Baja" | "Media" | "Alta" | "Muy Alta"
  >;
  currentHF_average: MetricDataStructure<"id", "average">;
  paramo: MetricDataStructure<"id", "paramo">;
  tropicalDryForest: MetricDataStructure<"id", "bosqueSeco">;
  wetland: MetricDataStructure<"id", "humedal">;
};

export type MetricsTypes = keyof MetricTypesMap;
