import { useEffect } from "react";
import { useSearchDrawControlsCTX } from "pages/search/hooks/SearchContext";
import "leaflet-draw";
import type L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { matchColor } from "pages/search/utils/matchColor";
import colorPalettes from "pages/search/utils/colorPalettes";

export function DrawControl() {
  const { drawControlsRef, setAreDrawControlMounted } =
    useSearchDrawControlsCTX();

  const onMounted = (control: L.Control.Draw) => {
    if (drawControlsRef) {
      drawControlsRef.current = control;
      setAreDrawControlMounted(true);
    }
  };

  useEffect(() => {
    return () => {
      if (drawControlsRef) {
        drawControlsRef.current = null;
        setAreDrawControlMounted(false);
      }
    };
  }, [drawControlsRef, setAreDrawControlMounted]);

  return (
    <FeatureGroup>
      <EditControl
        onMounted={onMounted}
        draw={{
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e84a5f",
              message:
                "<strong>No se permite polígonos con intersecciones<strong>",
            },
            shapeOptions: {
              color: matchColor("polygon")() || colorPalettes.default[0],
              opacity: 0.8,
              clickable: true,
            },
          },
        }}
        position="topleft"
      />
    </FeatureGroup>
  );
}
