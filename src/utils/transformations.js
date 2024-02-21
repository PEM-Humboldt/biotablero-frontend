/**
 * Transform polygon to WKT format
 * @param {Polygon} polygon original polygon
 */

const toMultipolygonWKT = (polygon) => {
  if (polygon && polygon.coordinates) {
    const coordinates = [];
    polygon.coordinates.forEach((p) => {
      const reversedCoord = [p[1], p[0]];
      coordinates.push(reversedCoord);
    });
    coordinates.push(coordinates[0]);
    return (
      "MULTIPOLYGON (((" +
      coordinates.map((coord) => coord.join(" ")).join(",") +
      ")))"
    );
  }
};

export { toMultipolygonWKT };
