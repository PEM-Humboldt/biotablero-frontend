export interface geofenceDetails {
  total_area: string;
}

export type Polygon = {
  latLngs: Array<{ lat: number; lng: number }>;
};
