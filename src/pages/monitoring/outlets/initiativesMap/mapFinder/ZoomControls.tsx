import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { House, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { COUNTRY_BOUNDS } from "@config/monitoring";

import {
  getTargetLatLng,
  getTargetBounds,
} from "pages/monitoring/outlets/initiativesMap/utils/mapPositioning";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";

export function ZoomControls() {
  const map = useMap();
  const navigate = useNavigate();

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

  const handleZoomIn = () => {
    const currentZoom = map.getZoom();
    if (currentZoom >= map.getMaxZoom()) {
      return;
    }

    map.setView(getTargetLatLng(map), currentZoom + 1, { animate: true });
  };

  const handleZoomOut = () => {
    const currentZoom = map.getZoom();
    if (currentZoom <= map.getMinZoom()) {
      return;
    }

    map.setView(getTargetLatLng(map), currentZoom - 1, { animate: true });
  };

  const handleHome = () => {
    void navigate(`/Monitoreo`);

    const { zoomCenter, targetZoom } = getTargetBounds(
      map,
      COUNTRY_BOUNDS,
      null,
    );

    map.flyTo(zoomCenter, targetZoom, {
      duration: 1,
      easeLinearity: 0.25,
      noMoveStart: true,
    });
  };

  return (
    <ButtonGroup
      orientation="vertical"
      className="leaflet-top leaflet-right m-4 *:border-primary/50"
      role="group"
      aria-label={uiText.mapControls.labelSr}
    >
      <Button
        ref={zoomInBtnRef}
        variant="outline"
        size="icon-sm"
        onClick={handleZoomIn}
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
        onClick={handleHome}
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
        onClick={handleZoomOut}
        className="pointer-events-auto"
        title={uiText.mapControls.zoomOutBtn.title}
        aria-label={uiText.mapControls.zoomOutBtn.sr}
      >
        <ZoomOut className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}
