import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  center?: LatLngExpression;
}

export const Map: React.FC<MapProps> = ({ center = [4.5709, -74.2973] }) => {
  return (
    <MapContainer
      center={center}
      zoom={6}
      className="map-container"
      touchExtend={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};
