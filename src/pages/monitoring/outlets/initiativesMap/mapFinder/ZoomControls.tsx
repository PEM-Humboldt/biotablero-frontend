import { useNavigate } from "react-router";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Birdhouse, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { COLOMBIA_BOUNDS } from "pages/utils/settings";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";

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
      role="group"
      aria-label={uiText.mapControls.labelSr}
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => map.zoomIn()}
        className="pointer-events-auto"
        title={uiText.mapControls.zoomInBtn.title}
      >
        <span className="sr-only">{uiText.mapControls.zoomInBtn.sr}</span>
        <ZoomIn className="size-6" strokeWidth={1.5} aria-hidden="true" />
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
        title={uiText.mapControls.homeBtn.title}
      >
        <span className="sr-only">{uiText.mapControls.homeBtn.sr}</span>
        <Birdhouse className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => map.zoomOut()}
        className="pointer-events-auto"
        title={uiText.mapControls.zoomOutBtn.title}
      >
        <span className="sr-only">{uiText.mapControls.zoomOutBtn.sr}</span>
        <ZoomOut className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}
