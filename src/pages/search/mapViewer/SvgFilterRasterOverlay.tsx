import { useId, useEffect, useState } from "react";
import L, { type LatLngBoundsExpression } from "leaflet";
import { useMap } from "react-leaflet";

type SvgFilterRasterOverlayProps = {
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
 * Renders a raster through an SVG filter that colors the alpha channel.
 *
 * This is useful when the PNG is effectively a mask and we want to tint it
 * without doing pixel processing in JavaScript.
 */
export function SvgFilterRasterOverlay({
  bounds,
  source,
  color,
  opacity = 1,
}: SvgFilterRasterOverlayProps) {
  const map = useMap();
  const filterId = useId().replace(/:/g, "");
  const [style, setStyle] = useState<OverlayStyle | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const layerBounds = L.latLngBounds(bounds);
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
      style={{
        position: "absolute",
        left: style.left,
        top: style.top,
        width: style.width,
        height: style.height,
        pointerEvents: "none",
        opacity,
      }}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <defs>
          <filter id={filterId}>
            <feFlood floodColor={color} floodOpacity="1" result="flood" />
            <feComposite in="flood" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
      </svg>

      <img
        alt=""
        src={source}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          filter: `url(#${filterId})`,
          WebkitFilter: `url(#${filterId})`,
        }}
      />
    </div>
  );
}
