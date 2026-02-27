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
    MetricDataStructure<"id", "perdida" | "persistencia" | "no_bosque">
  >;
  currentHF: MetricDataStructure<
    "id",
    "Natural" | "Baja" | "Media" | "Alta" | "Muy Alta"
  >;
  currentHF_average: MetricDataStructure<"id", "average">;
};

export type MetricsTypes = keyof MetricTypesMap;
