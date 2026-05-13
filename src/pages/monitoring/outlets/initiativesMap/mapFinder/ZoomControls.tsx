import { useNavigate } from "react-router";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Birdhouse, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { COLOMBIA_BOUNDS } from "pages/utils/settings";

export function ZoomControls() {
  const map = useMap();
  const navigate = useNavigate();

  const boundsObject = L.latLngBounds(COLOMBIA_BOUNDS);
  const targetZoom = map.getBoundsZoom(boundsObject);
  const zoomCenter = boundsObject.getCenter();

  return (
    <ButtonGroup
      orientation="vertical"
      className="leaflet-top leaflet-right m-2"
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => map.zoomIn()}
        className="pointer-events-auto"
        title="Acercarse"
      >
        <ZoomIn className="size-6" strokeWidth={1.5} />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => {
          void navigate(`/Monitoreo`);
          map.flyTo(zoomCenter, targetZoom, {
            duration: 1,
            easeLinearity: 0.25,
            noMoveStart: true,
          });
        }}
        className="pointer-events-auto"
        title="Volver al inicio"
      >
        <Birdhouse className="size-6" strokeWidth={1.5} />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => map.zoomOut()}
        className="pointer-events-auto"
        title="Alejarse"
      >
        <ZoomOut className="size-6" strokeWidth={1.5} />
      </Button>
    </ButtonGroup>
  );
}
