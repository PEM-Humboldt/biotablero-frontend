import { AreaId } from "pages/search/types/dashboard";
import { Feature, FeatureCollection, Geometry } from "geojson";

class GeoJsonUtils {

  /**
   * Cast AreaId to FeatureCollection object
   * 
   * @param {AreaId} areaData Area data
   * 
   * @returns {FeatureCollection<Geometry, any>} FeatureCollection object
   */
  static castAreaIdToFeatureCollection(areaData: AreaId): FeatureCollection<Geometry, any> {
    const featureJson: Feature<Geometry, any> = {
      type: "Feature",
      properties: {
        id: areaData.id,
        key: areaData.name,
      },
      geometry: areaData.geometry
    };

    return { type: "FeatureCollection", features: [featureJson] };
  }
}

export default GeoJsonUtils;