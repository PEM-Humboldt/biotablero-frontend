import { useEffect, useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L, { type LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { COLOMBIA_BOUNDS } from "pages/utils/settings";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Polygon,
} from "geojson";
import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { MapPin } from "lucide-react";

type InitiativeByLocation = {
  initiativeId: number;
  initiativeName: string;
  mainLocationId: number;
  coordinate: [number, number];
};

interface DeptProperties {
  geofence_name: string;
  id?: string | number;
}

type DeptFeature = Feature<Polygon | MultiPolygon, DeptProperties>;

const MapMarker = L.divIcon({
  html: renderToString(<MapPin color="black" size={32} />),
  className: "custom-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function ChangeView({ bounds }: { bounds: LatLngBoundsLiteral }) {
  const map = useMap();
  if (bounds) {
    map.fitBounds(bounds, { animate: true });
  }
  return null;
}

function getGradientColor(
  min: number,
  max: number,
  minColor: string,
  maxColor: string,
) {
  return function getColor(count: number) {
    if (count <= 0) {
      return "transparent";
    }

    const t = Math.min(Math.max((count - min) / (max - min), 0), 1);

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const c1 = hexToRgb(minColor);
    const c2 = hexToRgb(maxColor);

    const r = Math.round(c1.r + t * (c2.r - c1.r));
    const g = Math.round(c1.g + t * (c2.g - c1.g));
    const b = Math.round(c1.b + t * (c2.b - c1.b));

    const toHex = (n: number) => n.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
}

export function MapFinder({
  startingBounds = COLOMBIA_BOUNDS,
}: {
  startingBounds: LatLngBoundsLiteral;
}) {
  const [bounds, setBounds] = useState(startingBounds);
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [nation, setNation] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    const fetchInitiativeLocations = async () => {
      const res = await monitoringAPI<InitiativeByLocation[]>({
        type: "get",
        endpoint: "Initiative/GetByLocation",
      });

      if (isMonitoringAPIError(res)) {
        setInitiatives([]);
        return;
      }

      setInitiatives(res);
    };

    const fetchCountryMap = async () => {
      const res = await monitoringAPI<FeatureCollection>({
        type: "get",
        endpoint: "Location/Polygon/0",
      });

      if (isMonitoringAPIError(res)) {
        setInitiatives([]);
        return;
      }

      setNation(res);
    };

    void fetchInitiativeLocations();
    void fetchCountryMap();
  }, []);

  const processedData = useMemo<
    { feature: Feature<Geometry, GeoJsonProperties>; count: number }[]
  >(() => {
    if (!initiatives.length || !nation || !nation?.features) {
      return [];
    }

    let remaining = [...initiatives];
    const results = [];

    for (const feature of nation.features as Feature<
      Polygon | MultiPolygon
    >[]) {
      if (remaining.length === 0) {
        break;
      }

      const matches: InitiativeByLocation[] = [];
      const rest: InitiativeByLocation[] = [];

      for (const initiative of remaining) {
        if (initiative.mainLocationId === feature.properties?.gid) {
          matches.push(initiative);
        } else {
          rest.push(initiative);
        }
      }

      if (matches.length > 0) {
        results.push({
          feature,
          count: matches.length,
        });
      }

      remaining = rest;
    }

    return results;
  }, [initiatives, nation]);

  const getColor = getGradientColor(
    1,
    Math.max(...processedData.map((dep) => dep.count), 1),
    "#ff0000",
    "#ffff00",
  );

  return (
    <MapContainer id="map" bounds={bounds} zoom={6} maxZoom={10} minZoom={6}>
      {initiatives.map((initiative) => {
        return (
          <Marker
            key={initiative.initiativeId}
            icon={MapMarker}
            position={initiative.coordinate}
          >
            <Popup>{initiative.initiativeName}</Popup>
          </Marker>
        );
      })}
      <ChangeView bounds={bounds} />
      <GeoJSON
        key={`geojson-layer-${processedData.length}`}
        data={
          {
            type: "FeatureCollection",
            features: processedData.map((d) => d.feature),
          } as FeatureCollection<Geometry, DeptProperties>
        }
        style={(feature) => {
          const f = feature as DeptFeature;
          const dataItem = processedData.find(
            (d) =>
              d.feature.properties?.geofence_name ===
              f.properties?.geofence_name,
          );

          const count = dataItem ? dataItem.count : 0;
          return {
            fillColor: getColor(count),
            weight: 1,
            opacity: 1,
            color: "white",
            fillOpacity: 0.7,
          };
        }}
        onEachFeature={(feature, layer) => {
          const f = feature as DeptFeature;

          const dataItem = processedData.find(
            (d) =>
              d.feature.properties?.geofence_name ===
              f.properties?.geofence_name,
          );

          layer.bindPopup(
            `Departamento: ${f.properties?.geofence_name ?? "N/A"}<br/>Iniciativas: ${dataItem?.count ?? 0}`,
          );

          layer.on("click", (e) => {
            const target = e.target as L.Polygon;
            if (typeof target.getBounds === "function") {
              const bounds = target.getBounds();
              const boundsLiteral: L.LatLngBoundsLiteral = [
                [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
                [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
              ];

              setBounds(boundsLiteral);
            }
          });
        }}
      />
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
