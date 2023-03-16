/**
 * Transform polygon to WKT format
 * @param {Polygon} polygon original polygon
 */

const toMultipolygonWKT = (polygon) => {
    if(polygon && polygon.coordinates) {
      const coordinates = polygon.coordinates.map(p => p.reverse());
      coordinates.push(coordinates[0]);
      return "MULTIPOLYGON (((" + coordinates.map((coord) => coord.join(" ")).join(",") + ")))";
    }
  }

export { toMultipolygonWKT };
