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
