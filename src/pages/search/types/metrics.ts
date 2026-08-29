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
  timelineHF: Array<
    MetricDataStructure<"id", "poligono" | "paramo" | "bosqueSeco" | "humedal">
  >;
  hfPersistence: Array<
    MetricDataStructure<"id", "area" | "percentage" | "key">
  >;
  paramo: MetricDataStructure<"id", "paramo">;
  tropicalDryForest: MetricDataStructure<"id", "bosqueSeco">;
  wetland: MetricDataStructure<"id", "humedal">;
  coverage_paramo: MetricDataStructure<
    "id",
    "Natural" | "Secundaria" | "Transformada"
  >;
  coverage_tropicalDryForest: MetricDataStructure<
    "id",
    "Natural" | "Secundaria" | "Transformada"
  >;
  coverage_wetland: MetricDataStructure<
    "id",
    "Natural" | "Secundaria" | "Transformada"
  >;
  protectedAreas: MetricDataStructure<"id", string>;
  protectedAreas_paramo: MetricDataStructure<"id", string>;
  protectedAreas_tropicalDryForest: MetricDataStructure<"id", string>;
  protectedAreas_wetland: MetricDataStructure<"id", string>;
  dpc: Array<{
    id: string;
    dpc: number;
    pa_id: number;
    pa_name: string;
    category: "muy_alto" | "alto" | "medio" | "bajo" | "muy_bajo";
  }>;

  // TODO: Ddescomentar cuando se actualice el endpoint
  // recordGaps: { id: string; frequency: number[]; bin_edges: number[] }[];
  // currentRecordsGaps_average: { id: string; average: number }[];
  statsOnSpecies: {
    id: string;
    total: number;
    threatened_total: number;
    threatened_cr: number;
    threatened_en: number;
    threatened_vu: number;
    invasive: number;
    endemic: number;
    endemic_threatened: number;
  };

  // TODO: Borrar cuando se actualice el endpoint
  recordGaps: { id: string; frequency: number[]; bin_edges: number[] };
  currentRecordsGaps_average: { id: string; average: number };
};

export type MetricsTypes = keyof MetricTypesMap;
export interface MetricInfoResponse {
  type: "info" | "cons" | "quote" | "meto" | "helper";
  description: string;
}
