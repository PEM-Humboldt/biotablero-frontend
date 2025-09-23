import { useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { COLOMBIA_BOUNDS } from "pages/utils/settings";

const config = {
  params: {
    colombia: COLOMBIA_BOUNDS,
  },
};

export function MapFinder({ bounds = [4.5709, -74.2973] }) {
  const mapRef = useRef<Map>(null);

  return (
    <MapContainer
      ref={mapRef}
      center={bounds}
      zoom={6}
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
