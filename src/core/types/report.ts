import type { LocationCompleteInfo } from "pages/monitoring/types/odataResponse";

export type MapDTO = {
  id: string;
  mapUrl: string;
};

export type GraphDTO = {
  state: string;
  blobUrl: string;
};

export type SectionDTO = {
  title: string;
  description: string;
  link: string;
  graphs: GraphDTO[];
};

type Graph = {
  id: string;
  blobUrl: string;
  creatorNote?: string;
};

// Consultas
export type SearchSection = {
  title: string;
  description: string;
  graphInfo?: Record<string, string>;
  graphs: Graph[];
  mapUrl?: string;
};

type SearchContext = {
  location: {
    type: string;
    name: string;
    id: number;
  };
  customPolygon: boolean;
  searchUrl: string;
};

// Indicadores
type IndicatorTag = {
  name: string;
  fullName?: string;
  url: string;
};

type IndicatorSection = {
  title: string;
  type: string;
  creationDate: string;
  lastUpdate: string;
  version: number;
  BiologicalGroupTag: IndicatorTag[];
  EcosystemTag: IndicatorTag[];
  mapUrl?: string;
  graphs: Graph[];
  explanation: string;
  card: {
    methodology: string;
    interpretation: string;
    considerations: string;
    authorship: string;
  };
};

export type IndicatorContext = {
  initiativeName: string;
  initiativeShortName?: string;
  initiativeLocation: LocationCompleteInfo[];
  initiativeCreationDate: string;
  initiativeDescription: string;
  initiativeStats: {
    area: number;
    areaUnit: string;
    localitiesUnderMonitoring: number;
    monitoringEvents: number;
  };
  initiativeUrl: string;
  politicalTags: IndicatorTag[];
  socialTags: IndicatorTag[];
};

// General
export type ReportMetadata = {
  creationDate: string;
  madeBy: { name: string; username?: string; mail: string };
};

export type ReportInfo = {
  metadata: ReportMetadata;
} & (
  | {
      type: "Indicator";
      context: IndicatorContext;
      sections: IndicatorSection[];
    }
  | {
      type: "Search";
      context: SearchContext;
      sections: SearchSection[];
    }
);
