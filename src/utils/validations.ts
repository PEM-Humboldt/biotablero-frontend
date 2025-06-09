/**
 * Validate if a variable is undefined or null
 * @param {any} variable variable to be validated
 */

export const isUndefinedOrNull = (variable: any) =>
  typeof variable === "undefined" || variable === null;

/**
 * Validate if an GeoJSON Object is not empty
 * @param {geojson} objet GeoJSON to be validated
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
