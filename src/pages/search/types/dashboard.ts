import { LatLngExpression, LatLngBounds } from "leaflet";
import { Geometry } from "geojson";

export interface geofenceDetails {
  total_area: string;
}

export interface AreaType {
  id: string;
  label: string;
}

export interface AreaIdBasic {
  id: string | number;
  name: string;
  area_type: AreaType;
}

export interface AreaId extends AreaIdBasic {
  geometry: Geometry;
  area: number;
}

export interface polygonFeature {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
    bbox?: number[];
  };
  properties: { [key: string]: any };
}

export interface Polygon {
  coordinates: LatLngExpression[];
  bounds: LatLngBounds;
  area: number;
  color: string;
  fill: boolean;
  geojson?: polygonFeature;
}
