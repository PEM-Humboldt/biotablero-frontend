export type StatsType = "General" | "Ecosystems" | "Demographic" | "Indicators";

export type BarsInfo = { key: string; value: number };

export interface GeneralStatsType {
  enabledInitiatives: number;
  peopleInvolved: number;
  agreementsInvolved: number;
  area: number;
}

export interface InitiativeStats {
  totalMunicipalities: number;
  totalIndicators: number;
}

export interface InitiativeStatsComplete
  extends InitiativeStats,
    GeneralStatsType {}

export type InitiativeMonitoringEvent = {
  groupNumber: number;
  groupName: string;
  value: number;
};

// TODO: Preguntarle a César G. por la def de este tipo
export type EcosystemsStatsType = {
  ecosystemsInvolved: { id: number; name: string }[];
};

export type DemographicStatsType = {
  gender: BarsInfo[];
  selfRecognition: BarsInfo[];
  organization: BarsInfo[];
};

export type IndicatorsStatsType = {
  indicatorsByScale: BarsInfo[];
};

export type StatsResponseMap = {
  General: GeneralStatsType;
  Ecosystems: EcosystemsStatsType;
  Demographic: DemographicStatsType;
  Indicators: IndicatorsStatsType;
};
