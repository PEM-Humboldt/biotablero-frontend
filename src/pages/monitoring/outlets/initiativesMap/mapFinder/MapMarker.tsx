import { renderToString } from "react-dom/server";
import L from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { useNavigate } from "react-router";
import { InitiativeIcon } from "pages/monitoring/outlets/initiativesMap/mapFinder/InitiativeIcon";

const markerIcon = L.divIcon({
  html: renderToString(<InitiativeIcon />),
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  className: "bg-transparent border-none",
});

export function MapMarker({
  initiative,
}: {
  initiative: InitiativeByLocation;
}) {
  const navigate = useNavigate();

  return (
    <Marker
      key={initiative.initiativeId}
      icon={markerIcon}
      position={initiative.coordinate}
      eventHandlers={{
        click: () => {
          void navigate(
            `/Monitoreo/Dept/${initiative.mainLocationId}/${initiative.initiativeId}`,
          );
        },
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -14]}
        opacity={1}
        permanent={false}
        className="bg-background! text-primary! px-4! py-2! rounded-lg! shadow-none!"
      >
        {initiative.initiativeName}
      </Tooltip>
    </Marker>
  );
}
