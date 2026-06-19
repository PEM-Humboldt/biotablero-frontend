import { useEffect, useRef } from "react";
import { type LatLng, type LatLngBoundsLiteral } from "leaflet";
import { useMap } from "react-leaflet";

import { getTargetBounds } from "pages/monitoring/outlets/initiativesMap/utils/mapPositioning";

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
    const { zoomCenter, targetZoom } = getTargetBounds(map, bounds, center);

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
