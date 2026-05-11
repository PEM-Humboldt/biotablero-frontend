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
import { createGradientScale } from "pages/monitoring/utils/createGradientScale";
import { useNavigate, useParams } from "react-router";
import { type InitiativeByLocation } from "pages/monitoring/types/initiative";
import { INITIAVIVES_MAP_GRADIENT } from "@config/monitoring";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";

interface DeptProperties {
  geofence_name: string;
  gid: number;
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

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, {
        animate: true,
        duration: 2,
      });
    }
  }, [bounds, map]);

  return null;
}

export function MapFinder({
  startingBounds = COLOMBIA_BOUNDS,
}: {
  startingBounds: LatLngBoundsLiteral;
}) {
  const [bounds, setBounds] = useState(startingBounds);
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [nation, setNation] = useState<FeatureCollection | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitiativeLocations = async () => {
      const res = await getInitiativeLocations();

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

  const getColor = useMemo(() => {
    const [min, max] = processedData.reduce(
      (result, current) => {
        if (current.count <= result[0]) {
          result[0] = current.count;
        }
        if (current.count >= result[1]) {
          result[1] = current.count;
        }
        return result;
      },
      [Infinity, 0],
    );
    return createGradientScale(min, max, INITIAVIVES_MAP_GRADIENT);
  }, [processedData]);

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
          const color = getColor(count);

          return {
            fillColor: color,
            weight: 10,
            opacity: 1,
            color: color,
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
            const f = feature as DeptFeature;

            if (typeof target.getBounds === "function") {
              const bounds = target.getBounds();
              const boundsLiteral: L.LatLngBoundsLiteral = [
                [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
                [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
              ];

              setBounds(boundsLiteral);

              // NOTE: Delay para que la animación empalme con la actualizción
              // de info en el recuadro
              if (!("gid" in f.properties)) {
                return;
              }

              setTimeout(() => {
                void navigate(`/Monitoreo/Departamento/${f.properties.gid}`);
              }, 800);
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
