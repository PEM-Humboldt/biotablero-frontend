export type StatsType = "General" | "Ecosystems" | "Demographic" | "Indicators";

export type BarsInfo = { key: string; value: number };

export type GeneralStats = {
  enabledInitiatives: number;
  peopleInvolved: number;
  agreementsInvolved: number;
  area: number;
};

// TODO: Preguntarle a César G. por la def de este tipo
export type EcosystemsStats = {
  ecosystemsInvolved: { id: number; name: string }[];
};

export type DemographicStats = {
  gender: BarsInfo[];
  selfRecognition: BarsInfo[];
  organization: BarsInfo[];
};

export type IndicatorsStats = {
  indicatorsByScale: BarsInfo[];
};

export type StatsResponseMap = {
  General: GeneralStats;
  Ecosystems: EcosystemsStats;
  Demographic: DemographicStats;
  Indicators: IndicatorsStats;
};
