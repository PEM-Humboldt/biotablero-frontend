import L from "leaflet";

import { COUNTRY_BOUNDS } from "@config/monitoring";

const padding = { north: 0, south: 0, east: 100, west: 400 };

/**
 * Calculates the optimal center and zoom level to fit specific bounds within
 * the asymmetric effective viewing area of the map.
 *
 * @param targetMap - The active Leaflet map instance.
 * @param baseBounds - The geographical bounds to fit or null.
 * @param center - An explicit center coordinate to prioritize over the bounds center or Null.
 *
 * @returns An object containing the offset geographical center and the target zoom level.
 */
export const getTargetBounds = (
  targetMap: L.Map,
  baseBounds: L.LatLngBoundsLiteral = COUNTRY_BOUNDS,
  center: L.LatLng | null,
) => {
  const boundsObject = L.latLngBounds(baseBounds);
  const paddingPoint = L.point(
    padding.east + padding.west,
    padding.north + padding.south,
  );

  const targetZoom = targetMap.getBoundsZoom(boundsObject, false, paddingPoint);

  const baseCenter = center || boundsObject.getCenter();
  const targetPoint = targetMap.project(baseCenter, targetZoom);

  const offsetX = (padding.east - padding.west) / 2;
  const offsetY = (padding.north - padding.south) / 2;
  const offsetPoint = targetPoint.add([offsetX, offsetY]);

  const zoomCenter = targetMap.unproject(offsetPoint, targetZoom);

  return { zoomCenter, targetZoom };
};

/**
 * Translates the current screen-space pixel center of the asymmetric
 * effective viewing area into geographical coordinates.
 *
 * @param targetMap - The active Leaflet map instance.
 *
 * @returns The LatLng coordinate currently positioned at the visual center of the clear layout area.
 */
export const getTargetLatLng = (targetMap: L.Map): L.LatLng => {
  const mapSize = targetMap.getSize();

  const vcX = padding.west + (mapSize.x - padding.east - padding.west) / 2;
  const vcY = padding.north + (mapSize.y - padding.north - padding.south) / 2;
  const visualCenterPoint = L.point(vcX, vcY);
  const targetLatLng = targetMap.containerPointToLatLng(visualCenterPoint);

  return targetLatLng;
};
