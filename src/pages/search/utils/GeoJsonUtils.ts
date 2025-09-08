import { FeatureCollection } from "geojson";
import { ShapeLayer } from "pages/search/types/layers";

/**
 * Check if layers list has at least one invalid object
 *
 * @param {Array<ShapeLayer>} layers Layers list
 * @returns True if has at least one invalid layer. False otherwise
 */
export const hasInvalidGeoJson = (layers: Array<ShapeLayer>): boolean => {
  const listHasInvalidObject = layers.some(
    (l) => typeof l.json === "object" && Object.keys(l.json).length === 0
  );

  if (listHasInvalidObject) return true;

  const listHasInvalidFeature = layers.some(
    (l) =>
      l.json.type === "FeatureCollection" &&
      ((l.json as FeatureCollection).features === null ||
        (l.json as FeatureCollection).features === undefined)
  );

  return listHasInvalidFeature;
};

/**
 * Validate if an GeoJSON Object is not empty
 * @param {geojson} object GeoJSON to be validated
 *
 * @returns True if the GeoJSON contains information, false if it's empty
 */
export const hasValidGeoJSONData = (geojson: any): boolean => {
  return (
    geojson &&
    typeof geojson === "object" &&
    geojson.type === "FeatureCollection" &&
    Array.isArray(geojson.features) &&
    geojson.features.length > 0
  );
};
