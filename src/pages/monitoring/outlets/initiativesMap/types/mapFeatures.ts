import type { Feature, MultiPolygon, Polygon } from "geojson";

export interface DeptProperties {
  geofence_name: string;
  gid: number;
}

export type DeptFeature = Feature<Polygon | MultiPolygon, DeptProperties>;
