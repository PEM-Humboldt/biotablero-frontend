import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";
import L from "leaflet";

export const MapMarker = L.divIcon({
  html: renderToString(<MapPin color="black" size={32} />),
  className: "custom-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
