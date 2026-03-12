import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";

export type VideoObjectTS = {
  id: number;
  territoryStoryId: number;
  fileUrl: string;
};

export type ImageObjectTS = {
  id: number;
  fileUrl: string;
  description: string;
  featuredContent: boolean;
};

export interface TerritoryStoryFull extends TerritoryStoryShort {
  keywords: string;
  images?: ImageObjectTS[];
  videos?: Omit<VideoObjectTS, "territoryStoryId">[];
}

export type TerritoryStoryForm = {
  title: string;
  text: string;
  restricted: boolean;
  enabled: boolean;
  keywords: string[];
  images: ImageObjectTS[];
  videos: Omit<VideoObjectTS, "territoryStoryId">[];
};
