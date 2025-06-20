import { AreaId } from "pages/search/types/dashboard";
import { Feature, FeatureCollection, Geometry } from "geojson";
import { shapeLayer } from "pages/search/types/layers";

class GeoJsonUtils {
  /**
   * Cast AreaId to FeatureCollection object
   *
   * @param {AreaId} areaData Area data
   *
   * @returns {FeatureCollection<Geometry, any>} FeatureCollection object
   */
  static castAreaIdToFeatureCollection(
    areaData: AreaId
  ): FeatureCollection<Geometry, any> {
    const featureJson: Feature<Geometry, any> = {
      type: "Feature",
      properties: {
        id: areaData.id,
        key: areaData.name,
      },
      geometry: areaData.geometry,
    };

    return { type: "FeatureCollection", features: [featureJson] };
  }

  /**
   * Check if layers list has at least one invalid object
   *
   * @param {Array<shapeLayer>} layers Layers list
   *
   * @returns True if has at least one invalid layer. False otherwise
   */
  static hasInvalidGeoJson(layers: Array<shapeLayer>): boolean {
    let listHasInvalidObject = layers.some(
      (l) => typeof l.json === "object" && Object.keys(l.json).length === 0
    );

    if (listHasInvalidObject) return true;

    let listHasInvalidFeature = layers.some(
      (l) =>
        l.json.type == "FeatureCollection" &&
        ((l.json as FeatureCollection).features === null ||
          (l.json as FeatureCollection).features === undefined)
    );

    if (listHasInvalidFeature) return true;

    return false;
  }

  /**
   * Validate if an GeoJSON Object is not empty
   * @param {geojson} geojson GeoJSON to be validated
   *
   * @returns True if the GeoJSON contains information, false if it's empty
   */
  static hasValidGeoJSONData = (geojson: any): boolean => {
    return (
      geojson &&
      typeof geojson === "object" &&
      geojson.type === "FeatureCollection" &&
      Array.isArray(geojson.features) &&
      geojson.features.length > 0
    );
  };
}

export default GeoJsonUtils;
