import { useNavigate } from "react-router";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { House, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { COLOMBIA_BOUNDS } from "pages/utils/settings";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";
import { useEffect, useRef } from "react";

export function ZoomControls() {
  const map = useMap();
  const navigate = useNavigate();

  const boundsObject = L.latLngBounds(COLOMBIA_BOUNDS);
  const targetZoom = map.getBoundsZoom(boundsObject);
  const zoomCenter = boundsObject.getCenter();
  const zoomInBtnRef = useRef(null);
  const homeBtnRef = useRef(null);
  const zoomOutBtnRef = useRef(null);

  useEffect(() => {
    [zoomInBtnRef, homeBtnRef, zoomOutBtnRef].forEach((reference) => {
      if (!reference.current) {
        return;
      }
      const element = reference.current;

      L.DomEvent.disableClickPropagation(element);
      L.DomEvent.disableScrollPropagation(element);
    });
  }, []);

  return (
    <ButtonGroup
      orientation="vertical"
      className="leaflet-top leaflet-right m-2"
      role="group"
      aria-label={uiText.mapControls.labelSr}
    >
      <Button
        ref={zoomInBtnRef}
        variant="outline"
        size="icon-sm"
        onClick={() => map.zoomIn()}
        className="pointer-events-auto"
        title={uiText.mapControls.zoomInBtn.title}
        aria-label={uiText.mapControls.zoomInBtn.sr}
      >
        <ZoomIn className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </Button>

      <Button
        ref={homeBtnRef}
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
        aria-label={uiText.mapControls.homeBtn.sr}
      >
        <House className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </Button>

      <Button
        ref={zoomOutBtnRef}
        variant="outline"
        size="icon-sm"
        onClick={() => map.zoomOut()}
        className="pointer-events-auto"
        title={uiText.mapControls.zoomOutBtn.title}
        aria-label={uiText.mapControls.zoomOutBtn.sr}
      >
        <ZoomOut className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}
