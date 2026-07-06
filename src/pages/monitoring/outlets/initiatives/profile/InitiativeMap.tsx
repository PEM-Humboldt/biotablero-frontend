import { renderToString } from "react-dom/server";
import { MapContainer, Marker, Tooltip, TileLayer } from "react-leaflet";
import L from "leaflet";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { MAP_TILES } from "pages/monitoring/outlets/initiativesMap/layout/layers";
import { InitiativeIcon } from "pages/monitoring/outlets/initiativesMap/mapFinder/InitiativeIcon";

export function InitiativeMap() {
  const { initiativeInfo } = useInitiativeCTX();

  return !initiativeInfo ? null : (
    <div className="lg:flex-1 w-full md:w-[400px] lg:w-[500px] md:shrink-0 md:sticky md:top-0 md:h-screen bg-accent z-10">
      <div className="relative flex-col w-full h-[300px] md:h-full flex">
        <MapContainer
          center={initiativeInfo.coordinate}
          zoom={10}
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

          <TileLayer
            attribution={MAP_TILES[0].attribution}
            url={MAP_TILES[0].url}
          />
        </MapContainer>
      </div>
    </div>
  );
}
