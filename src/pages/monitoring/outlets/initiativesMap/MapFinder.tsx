import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

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
import L, { type LatLngExpression, type LatLngBoundsLiteral } from "leaflet";
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
  coordinate: [number, number];
};

interface DeptProperties {
  geofence_name: string;
  id?: string | number;
}

type DeptFeature = Feature<Polygon | MultiPolygon, DeptProperties>;

const MOCK_MORE_INITIATIVES: InitiativeByLocation[] = [
  { initiativeId: 10, initiativeName: "Ama 1", coordinate: [-69.94, -4.215] },
  { initiativeId: 11, initiativeName: "Ama 2", coordinate: [-70.15, -3.85] },
  { initiativeId: 12, initiativeName: "Ama 3", coordinate: [-70.35, -3.5] },
  { initiativeId: 13, initiativeName: "Ama 4", coordinate: [-69.8, -3.2] },
  { initiativeId: 14, initiativeName: "Ama 5", coordinate: [-70.5, -1.2] },
  { initiativeId: 15, initiativeName: "Ama 6", coordinate: [-71.2, -1.5] },
  { initiativeId: 16, initiativeName: "Ama 7", coordinate: [-69.85, -2.0] },
  { initiativeId: 17, initiativeName: "Ama 8", coordinate: [-72.0, -0.5] },

  { initiativeId: 18, initiativeName: "Cho 1", coordinate: [-76.658, 5.692] },
  { initiativeId: 19, initiativeName: "Cho 2", coordinate: [-77.2, 5.2] },
  { initiativeId: 20, initiativeName: "Cho 3", coordinate: [-77.404, 6.226] },
  { initiativeId: 21, initiativeName: "Cho 4", coordinate: [-76.8, 7.1] },
  { initiativeId: 22, initiativeName: "Cho 5", coordinate: [-77.6, 4.8] },

  { initiativeId: 26, initiativeName: "Mag 1", coordinate: [-74.199, 11.2408] },
  { initiativeId: 27, initiativeName: "Mag 2", coordinate: [-73.95, 10.8] },
  { initiativeId: 28, initiativeName: "Mag 3", coordinate: [-74.4, 10.2] },
  { initiativeId: 29, initiativeName: "Mag 4", coordinate: [-74.15, 9.5] },

  { initiativeId: 30, initiativeName: "Gua 1", coordinate: [-72.909, 11.544] },
  { initiativeId: 31, initiativeName: "Gua 2", coordinate: [-72.5, 11.8] },
  { initiativeId: 32, initiativeName: "Gua 3", coordinate: [-71.9, 12.1] },

  { initiativeId: 34, initiativeName: "Nar 1", coordinate: [-78.815, 1.806] },
  { initiativeId: 35, initiativeName: "Nar 2", coordinate: [-78.3, 1.5] },

  { initiativeId: 37, initiativeName: "Vau 1", coordinate: [-70.1733, 1.1983] },
];

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

      setInitiatives([...res, ...MOCK_MORE_INITIATIVES]);
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
        const pt = point([initiative.coordinate[0], initiative.coordinate[1]]);

        if (booleanPointInPolygon(pt, feature)) {
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
        // NOTE: el endpoint está retornando [LNG, LAT] y deberia ser al revés
        const translatedCoorsenates = [
          initiative.coordinate[1],
          initiative.coordinate[0],
        ] as LatLngExpression;

        return (
          <Marker
            key={initiative.initiativeId}
            icon={MapMarker}
            position={translatedCoorsenates}
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
