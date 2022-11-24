import { LatLngExpression } from "leaflet";

export interface geofenceDetails {
  total_area: string;
}

export interface Polygon {
  copordinates: LatLngExpression[][];
}
