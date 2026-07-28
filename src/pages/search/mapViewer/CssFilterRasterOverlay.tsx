import { useEffect, useState } from "react";
import L, {
  type LatLngBoundsExpression,
  type LatLngBoundsLiteral,
} from "leaflet";
import { useMap } from "react-leaflet";

type CssFilterRasterOverlayProps = {
  bounds: LatLngBoundsExpression;
  source: string;
  opacity?: number;
};

type OverlayStyle = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function CssFilterRasterOverlay({
  bounds,
  source,
  opacity = 1,
}: CssFilterRasterOverlayProps) {
  const map = useMap();
  const [style, setStyle] = useState<OverlayStyle | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const layerBounds =
        bounds instanceof L.LatLngBounds
          ? bounds
          : L.latLngBounds(bounds as LatLngBoundsLiteral);
      const northWest = map.latLngToLayerPoint(layerBounds.getNorthWest());
      const southEast = map.latLngToLayerPoint(layerBounds.getSouthEast());

      setStyle({
        left: Math.min(northWest.x, southEast.x),
        top: Math.min(northWest.y, southEast.y),
        width: Math.abs(southEast.x - northWest.x),
        height: Math.abs(southEast.y - northWest.y),
      });
    };

    updatePosition();
    map.on("zoom viewreset move resize", updatePosition);

    return () => {
      map.off("zoom viewreset move resize", updatePosition);
    };
  }, [bounds, map]);

  if (!style) {
    return null;
  }

  return (
    <img
      aria-hidden="true"
      alt=""
      className="leaflet-image-layer"
      draggable={false}
      src={source}
      style={{
        position: "absolute",
        left: style.left,
        top: style.top,
        width: style.width,
        height: style.height,
        opacity,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
