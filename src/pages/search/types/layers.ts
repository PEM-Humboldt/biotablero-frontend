import * as geojson from "geojson";
import { GeoJSONOptions, StyleFunction } from "leaflet";

export interface ShapeLayer {
  id: string;
  paneLevel: number;
  json: geojson.GeoJsonObject;
  onEachFeature?: GeoJSONOptions["onEachFeature"];
  layerStyle?: StyleFunction;
}

export interface RasterLayer {
  paneLevel: number;
  id: string;
  data: string;
  opacity?: number;
  selected?: boolean;
}

export interface ConnectivityFeaturePropierties {
  area: number;
  dpc_cat: string;
  id: string;
  name: string;
  value: number;
}

export interface CompensationFactorPropierties {
  gid: number;
  name_biome: string;
  id_biome: string;
  compensation_factor: number;
}

export interface MapTitle {
  name: string;
  gradientData?: {
    from: number;
    to: number;
    colors: Array<string>;
  };
}
