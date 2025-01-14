import * as geojson from "geojson";
import { CancelTokenSource } from "axios";

export interface RestAPIObject {
  request: Promise<geojson.GeoJsonObject | geojson.GeoJsonObject[]>;
  source: CancelTokenSource;
}
