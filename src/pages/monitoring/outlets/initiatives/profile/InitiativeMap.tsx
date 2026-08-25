import { renderToString } from "react-dom/server";
import {
  MapContainer,
  Marker,
  Tooltip,
  TileLayer,
  GeoJSON,
} from "react-leaflet";
import type { Geometry } from "geojson";
import L from "leaflet";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { MAP_TILES } from "pages/monitoring/outlets/initiativesMap/layout/layers";
import { InitiativeIcon } from "pages/monitoring/outlets/initiativesMap/mapFinder/InitiativeIcon";
import { useEffect, useState } from "react";
import { getInitiativePolygon } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { GRAPHS_GRADIENT_COLOR_PALETTE } from "@config/color";
import { INITIATIVE_MAP_DEFAULT_ZOOM } from "@config/monitoring";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";

export function InitiativeMap() {
  const { initiativeInfo } = useInitiativeCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [initiativePolygon, setInitiativePolygon] = useState<Geometry | null>(
    null,
  );

  useEffect(() => {
    if (!initiativeInfo?.hasPolygon) {
      return;
    }

    const fetchPolygon = async () => {
      setIsLoading(true);
      setErrors([]);

      const res = await getInitiativePolygon(initiativeInfo.id);
      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setInitiativePolygon(null);
        setErrors(res.data.map((err) => err.msg));

        return;
      }

      setInitiativePolygon(res);
    };

    void fetchPolygon();
  }, [initiativeInfo]);

  if (!initiativeInfo) {
    return null;
  }

  let mapBounds: L.LatLngBoundsExpression | undefined = undefined;

  if (initiativePolygon) {
    try {
      const geoJsonLayer = L.geoJSON(initiativePolygon);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        mapBounds = bounds;
      }
    } catch (e) {
      console.error("Error calculando el mapa:", e);
    }
  }
  return (
    <div className="lg:flex-1 w-full h-[300px] lg:shrink-0 md:sticky md:top-0 lg:h-screen z-10">
      <div className="relative flex-col w-full h-[300px] lg:h-full flex">
        {isLoading && (
          <LoadingDiv className="absolute z-10 m-2 p-4 bg-muted/90 w-[150px]" />
        )}

        <ErrorsList
          errorItems={errors}
          className="absolute z-10 m-2 p-4 bg-accent/90 [&_span]:text-accent-foreground! [&_svg]:text-accent-foreground! border border-primary rounded-lg"
        />
        <MapContainer
          key={`map-initiative-${initiativeInfo.id}-${initiativePolygon ? "with-bounds" : "with-center"}`}
          bounds={mapBounds}
          center={mapBounds ? undefined : initiativeInfo.coordinate}
          zoom={mapBounds ? undefined : INITIATIVE_MAP_DEFAULT_ZOOM}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
        >
          <Marker
            icon={L.divIcon({
              html: renderToString(<InitiativeIcon />),
              iconSize: [28, 28],
              iconAnchor: [14, 14],
              className: "bg-transparent border-none",
            })}
            position={initiativeInfo.coordinate}
          >
            <Tooltip
              direction="top"
              offset={[0, -14]}
              opacity={1}
              permanent={false}
              className="bg-background! text-primary! px-4! py-2! rounded-lg! shadow-none!"
            >
              {initiativeInfo.name}
            </Tooltip>
          </Marker>

          {initiativePolygon && (
            <GeoJSON
              key={`geojson-layer-${initiativeInfo.id}`}
              data={initiativePolygon}
              style={{
                fillColor: GRAPHS_GRADIENT_COLOR_PALETTE[1],
                weight: 2,
                opacity: 1,
                color: GRAPHS_GRADIENT_COLOR_PALETTE[9],
                fillOpacity: 0.7,
              }}
            />
          )}

          <TileLayer
            attribution={MAP_TILES[0].attribution}
            url={MAP_TILES[0].url}
          />
        </MapContainer>
      </div>
    </div>
  );
}
