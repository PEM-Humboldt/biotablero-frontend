import { type CSSProperties, useEffect, useState } from "react";
import L, {
  type LatLngBoundsExpression,
  type LatLngBoundsLiteral,
} from "leaflet";
import { useMap } from "react-leaflet";

type CssBlendRasterOverlayProps = {
  bounds: LatLngBoundsExpression;
  source: string;
  color: string;
  opacity?: number;
  blendMode?: CSSProperties["mixBlendMode"];
};

type OverlayStyle = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function CssBlendRasterOverlay({
  bounds,
  source,
  color,
  opacity = 1,
  blendMode = "multiply",
}: CssBlendRasterOverlayProps) {
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
    <div
      aria-hidden="true"
      className="leaflet-image-layer"
      style={{
        position: "absolute",
        left: style.left,
        top: style.top,
        width: style.width,
        height: style.height,
        opacity,
        pointerEvents: "none",
        isolation: "isolate",
      }}
    >
      <img
        alt=""
        draggable={false}
        src={source}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: color,
          mixBlendMode: blendMode,
          WebkitMaskImage: `url("${source}")`,
          maskImage: `url("${source}")`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          maskMode: "alpha",
        }}
      />
    </div>
  );
}
