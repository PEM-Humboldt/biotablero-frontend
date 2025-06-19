import * as geojson from "geojson";
import { CancelTokenSource } from "axios";

export interface ShapeAPIObject {
  request: Promise<geojson.GeoJsonObject>;
  source: CancelTokenSource;
}

export interface RasterAPIObject {
  request: Promise<{ layer: string }>;
  source: CancelTokenSource;
}
