import { type BBox } from "geojson";
import { type SrchType } from "pages/search/hooks/SearchContext";

import { type ReactElement, type Dispatch, type SetStateAction } from "react";

import type { InitiativeCompleteInfo } from "pages/monitoring/types/initiative";
import { type SearchState } from "pages/search/hooks/SearchReducer";

export type SectionInfo = {
  sectionId: string;
  graphId: string;
  sectionInfo:
    | Omit<SearchSection, "graphs" | "mapUrl">
    | Omit<TopicSection, "graphs" | "mapUrl">;
  graphComponent: ReactElement;
  mapUrl: string | null;
  mapElementId: string | null;
  sectionUrl: string;
};

export enum ReportType {
  NONE,
  SEARCH_INDICATORS,
  MONITORING_TOPICS,
}

export type MCReportModelProps = {
  metadata: ReportMetadata;
  context: TopicContext;
  sections: Map<string, TopicSection>;
};
export type SearchReportModelProps = {
  metadata: ReportMetadata;
  context: SearchContext;
  sections: Map<string, SearchSection>;
};

export type ReportModelProps = MCReportModelProps | SearchReportModelProps;

export type ReportContextType = {
  isLoading: boolean;
  errors: string[];
  reportContextResolver: (
    context: InitiativeCompleteInfo | SearchState,
  ) => void;
  reportDownloaded: boolean;
  setCurrentSectionPool: (section: SectionInfo | null) => void;
  hasSections: boolean;
  addSection: (userNote?: string) => Promise<void>;

  addSectionToRegistry: (id: string, info: SectionInfo) => void;
  removeSectionFromRegistry: (id: string) => void;
  addSectionFromRegistryToReport: (
    id: string,
    userNote: string,
  ) => Promise<void>;
  removeGraph: (sectionId: string, graphId: string) => void;
  removeSection: (sectionId: string) => void;
  removeReport: () => void;
  updateNote: (sectionId: string, graphId: string, newNote?: string) => void;
  toggleEditor: (forceState?: boolean) => void;
  whyDownload: string;
  setWhyDownload: Dispatch<SetStateAction<string>>;
  moveElement: (
    direction: "prev" | "next",
    sectionId: string,
    graphStateId?: string,
  ) => void;
  downloadReport: () => Promise<void>;
  documentSections: Map<string, SearchSection | TopicSection>;
  addLeaveCallback: (callback: () => void) => void;
};

export type GraphDTO = {
  id: string;
  blobUrl: string;
  mapUrl?: string;
  userNote?: string;
};

// Consultas
type CsvCell = string | number | boolean | null | undefined;
export type CsvRow = Record<string, CsvCell>;

export type SearchSection = {
  title: string;
  description: string;
  graphInfo?: Record<string, string>;
  graphs: GraphDTO[];
  rawData?: CsvRow[];
  url: string;
};

export type SearchContext = {
  searchType: SrchType;
  area: {
    type: string;
    name?: string;
    polygonId: number;
    size: number;
    bbox?: BBox;
  };
  searchUrl: string;
};

// Indicadores
export type TopicTag = {
  name: string;
  fullName?: string;
  url?: string;
};

export type TopicSection = {
  title: string;
  type: string;
  creationDate: string;
  lastUpdate: string;
  version: number;
  BiologicalGroupTag: TopicTag[];
  EcosystemTag: TopicTag[];
  graphs: GraphDTO[];
  singleMap: boolean;
  description: string;
  url: string;
  card: {
    methodology: string;
    interpretation: string;
    considerations: string;
    authorship: string;
  };
};

export type TopicContext = {
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
  politicalTags: TopicTag[];
  socialTags: TopicTag[];
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

export type FetchReportContext = {
  data: TopicContext | SearchContext | null;
  errors: string[];
};
