export type MapDTO = { title: string; blobUrl: string };
export type GraphDTO = {
  state: string;
  blobUrl: string;
  maps: MapDTO[];
  info?: Record<string, string>;
};
export type SectionDTO = {
  title: string;
  description: string;
  link: string;
  graphs: GraphDTO[];
};

export type SectionInfo = {
  title: string;
  description: string;
  graphInfo?: Record<string, string>;
};
