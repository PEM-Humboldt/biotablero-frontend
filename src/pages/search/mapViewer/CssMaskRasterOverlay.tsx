import { useEffect, useState } from "react";
import L, {
  type LatLngBoundsExpression,
  type LatLngBoundsLiteral,
} from "leaflet";
import { useMap } from "react-leaflet";

type CssMaskRasterOverlayProps = {
  bounds: LatLngBoundsExpression;
  source: string;
  color: string;
  opacity?: number;
};

type OverlayStyle = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Renders a raster as a solid-color block masked by the PNG alpha channel.
 *
 * This is the simplest approach when all we need is one color per raster.
 * The PNG is used as a mask, so only transparency matters.
 */
export function CssMaskRasterOverlay({
  bounds,
  source,
  color,
  opacity = 1,
}: CssMaskRasterOverlayProps) {
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
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
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
  );
}
