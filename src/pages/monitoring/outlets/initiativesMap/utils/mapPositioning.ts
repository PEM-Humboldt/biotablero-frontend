import L from "leaflet";

import {
  COUNTRY_BOUNDS,
  INITIATIVES_MAP_PADDING_SM,
  INITIATIVES_MAP_PADDING_LG,
} from "@config/monitoring";

const padding = {
  get south() {
    return typeof window !== "undefined" && window.innerWidth < 1024
      ? INITIATIVES_MAP_PADDING_SM.south
      : INITIATIVES_MAP_PADDING_LG.south;
  },
  get north() {
    return typeof window !== "undefined" && window.innerWidth < 1024
      ? INITIATIVES_MAP_PADDING_SM.north
      : INITIATIVES_MAP_PADDING_LG.north;
  },
  get east() {
    return typeof window !== "undefined" && window.innerWidth < 1024
      ? INITIATIVES_MAP_PADDING_SM.east
      : INITIATIVES_MAP_PADDING_LG.east;
  },
  get west() {
    return typeof window !== "undefined" && window.innerWidth < 1024
      ? INITIATIVES_MAP_PADDING_SM.west
      : INITIATIVES_MAP_PADDING_LG.west;
  },
};

// const padding = { south: 100, north: 0, east: 20, west: 20 };

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
    padding.south + padding.north,
  );

  const targetZoom = targetMap.getBoundsZoom(boundsObject, false, paddingPoint);

  const baseCenter = center || boundsObject.getCenter();
  const targetPoint = targetMap.project(baseCenter, targetZoom);

  const offsetX = (padding.east - padding.west) / 2;
  const offsetY = (padding.south - padding.north) / 2;
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
  const vcY = padding.south + (mapSize.y - padding.south - padding.north) / 2;
  const visualCenterPoint = L.point(vcX, vcY);
  const targetLatLng = targetMap.containerPointToLatLng(visualCenterPoint);

  return targetLatLng;
};
