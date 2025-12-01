export type MetricDataStructure<
  MetricLabelKey extends string,
  MetricValueKeys extends string
> = {
  [K in MetricLabelKey]: string;
} & {
    [K in MetricValueKeys]: number;
  };

export type MetricTypesMap = {
  Coverage: MetricDataStructure<
    "ano",
    "natural" | "secundaria" | "transformada"
  >;
  LossPersistence: MetricDataStructure<
    "periodo",
    "perdida" | "persistencia" | "no_bosque"
  >;
};

export type MetricsTypes = keyof MetricTypesMap;
