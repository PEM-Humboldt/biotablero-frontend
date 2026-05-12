import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L, { type LatLng, type LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";

export function ChangeView({
  bounds,
  center,
}: {
  bounds: LatLngBoundsLiteral;
  center: LatLng | null;
}) {
  const map = useMap();
  const lastStateRef = useRef("");

  useEffect(() => {
    const boundsObject = L.latLngBounds(bounds);
    const targetZoom = map.getBoundsZoom(boundsObject);
    const zoomCenter = center || boundsObject.getCenter();

    const currentStateKey = `${zoomCenter.toString()}-${targetZoom}`;

    if (lastStateRef.current !== currentStateKey) {
      lastStateRef.current = currentStateKey;

      const currentZoom = map.getZoom();
      const animationOptions = {
        duration: 1,
        easeLinearity: 0.25,
        noMoveStart: true,
      };

      if (Math.abs(currentZoom - targetZoom) < 0.1) {
        map.panTo(zoomCenter, animationOptions);
        return;
      }

      map.flyTo(zoomCenter, targetZoom, animationOptions);
    }
  }, [bounds, center, map]);

  return null;
}
