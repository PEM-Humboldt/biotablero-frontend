export type KEYS =
  | "nasa"
  | "temple"
  | "siac"
  | "geobon"
  | "geobon"
  | "usaid"
  | "umed";

export interface LogosConfig {
  default: Array<KEYS>;
  monitoreo: Array<KEYS>;
}
