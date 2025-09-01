export type Collaborators =
  | "nasa"
  | "temple"
  | "siac"
  | "geobon"
  | "geobon"
  | "usaid"
  | "umed";

export interface LogosConfig {
  default: Collaborators[];
  monitoreo: Collaborators[];
}

export interface Names {
  parent: string;
  child: string;
}
