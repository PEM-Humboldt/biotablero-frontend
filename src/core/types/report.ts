import type { LocationCompleteInfo } from "pages/monitoring/types/odataResponse";

export type GraphDTO = {
  id: string;
  blobUrl: string;
  mapUrl?: string;
  userNote?: string;
};

// Consultas
export type SearchSection = {
  title: string;
  description: string;
  graphInfo?: Record<string, string>;
  graphs: GraphDTO[];
};

export type SearchContext = {
  location: {
    type: string;
    name: string;
    id: number;
  };
  customPolygon: boolean;
  searchUrl: string;
};

// Indicadores
export type IndicatorTag = {
  name: string;
  fullName?: string;
  url?: string;
};

export type IndicatorSection = {
  title: string;
  type: string;
  creationDate: string;
  lastUpdate: string;
  version: number;
  BiologicalGroupTag: IndicatorTag[];
  EcosystemTag: IndicatorTag[];
  graphs: GraphDTO[];
  singleMap: boolean;
  description: string;
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
  initiativeLocation: string;
  initiativeCreationDate: string;
  initiativeDescription: string;
  initiativeStats?: {
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
  madeBy: {
    name: string;
    username: string;
    email: string;
  };
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
