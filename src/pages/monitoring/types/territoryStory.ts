import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";

export type VideoObjectTS = {
  id?: number;
  territoryStoryId?: number;
  fileUrl: string;
};

export type ImageObjectTS = {
  id?: number;
  fileUrl: string;
  description: string;
  featuredContent?: boolean;
  file?: File;
};

// NOTE: En este momento tiene el mismo shape que TerritoryStoryShort mientras se decide como se acota el tamaño de la respuesta
export type TerritoryStoryFull = TerritoryStoryShort;

export type TerritoryStoryForm = {
  title: string;
  text: string;
  restricted: boolean;
  enabled: boolean;
  keywords: string[];
  images: ImageObjectTS[];
  videos: Omit<VideoObjectTS, "territoryStoryId">[];
};
