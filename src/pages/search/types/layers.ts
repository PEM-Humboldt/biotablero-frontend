import * as geojson from "geojson";
import { GeoJSONOptions, PathOptions, StyleFunction } from "leaflet";

export interface shapeLayer {
  id: string;
  paneLevel: number;
  json: geojson.GeoJsonObject | Array<geojson.GeoJsonObject>;
  active?: boolean;
  onEachFeature?: GeoJSONOptions["onEachFeature"];
  layerStyle?: StyleFunction;
}

export interface connectivityFeaturePropierties {
  area: number;
  dpc_cat: string;
  id: string;
  name: string;
  value: number;
}
