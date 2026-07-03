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

export type InitiativeRelated = {
  id: number;
  name: string;
  shortName: string;
  description: string;
  creationDate: string;
  coordinate: [number, number];
  polygonArea: number;
  mainLocationId: number;
  enabled: boolean;
};

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
