import { LatLngExpression, LatLngBounds } from "leaflet";

export interface geofenceDetails {
  total_area: string;
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
