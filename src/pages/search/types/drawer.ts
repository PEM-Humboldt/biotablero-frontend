import { LatLngExpression, LatLngBounds } from "leaflet";

export interface geofenceDetails {
  total_area: string;
}

export interface Polygon {
  coordinates: LatLngExpression[];
  bounds: LatLngBounds;
  folder: string;
  area: number;
  color: string;
  fill: boolean;
}
