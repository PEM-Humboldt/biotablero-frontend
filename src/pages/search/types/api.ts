import * as geojson from "geojson";
import { CancelTokenSource } from "axios";

export interface RestAPIObject {
  request: Promise<geojson.GeoJsonObject | geojson.GeoJsonObject[]>;
  source?: CancelTokenSource;
}

export interface RasterAPIObject {
  request: Promise<{ layer: string }>;
  source: CancelTokenSource;
}
