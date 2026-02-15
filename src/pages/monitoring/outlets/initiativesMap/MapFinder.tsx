import { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { type Map, type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { COLOMBIA_BOUNDS } from "pages/utils/settings";

const config = {
  params: {
    colombia: COLOMBIA_BOUNDS,
  },
};

export function MapFinder({
  bounds = [4.5709, -74.2973],
}: {
  bounds?: LatLngTuple;
}) {
  const mapRef = useRef<Map>(null);

  return (
    <MapContainer
      id="map"
      ref={mapRef}
      center={bounds}
      zoom={6}
      className="bg-accent"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
