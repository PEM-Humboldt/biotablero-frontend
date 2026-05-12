import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import L, { type LatLngBoundsLiteral } from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Tooltip,
} from "react-leaflet";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Polygon,
} from "geojson";

import { INITIAVIVES_MAP_GRADIENT, COUNTRY_BOUNDS } from "@config/monitoring";

import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { createGradientScale } from "pages/monitoring/utils/createGradientScale";
import { type InitiativeByLocation } from "pages/monitoring/types/initiative";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";
import { ChangeView } from "pages/monitoring/outlets/initiativesMap/mapFinder/ChangeView";
import { MapMarker } from "pages/monitoring/outlets/initiativesMap/mapFinder/MapMarker";

// import "leaflet/dist/leaflet.css";

interface DeptProperties {
  geofence_name: string;
  gid: number;
}

type DeptFeature = Feature<Polygon | MultiPolygon, DeptProperties>;

export function MapFinder() {
  const [center, setCenter] = useState<L.LatLng | null>(null);
  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null);
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [nation, setNation] = useState<FeatureCollection | null>(null);
  const { departmentId, initiativeId } = useParams();
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

  useEffect(() => {
    if (!nation || !nation.features) {
      return;
    }

    setCenter(null);
    if (departmentId === undefined) {
      setBounds(COUNTRY_BOUNDS);
      return;
    }

    const selectedDept = nation.features.find(
      (f) => String(f.properties?.gid) === departmentId,
    );

    if (selectedDept) {
      const layer = L.geoJSON(selectedDept);
      const gBounds = layer.getBounds();
      const boundsLiteral: LatLngBoundsLiteral = [
        [gBounds.getSouthWest().lat, gBounds.getSouthWest().lng],
        [gBounds.getNorthEast().lat, gBounds.getNorthEast().lng],
      ];

      setBounds(boundsLiteral);
    }

    if (initiativeId && initiatives.length > 0) {
      const selectedInitiative = initiatives.find(
        (i) => String(i.initiativeId) === initiativeId,
      );

      if (selectedInitiative) {
        const latLng = L.latLng(
          selectedInitiative.coordinate[0],
          selectedInitiative.coordinate[1],
        );

        setCenter(latLng);
      }
    }
  }, [departmentId, nation, initiativeId, initiatives]);

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
    <MapContainer
      bounds={bounds ?? COUNTRY_BOUNDS}
      zoom={6}
      maxZoom={10}
      minZoom={6}
    >
      {initiatives.map((initiative) => {
        return (
          <Marker
            key={initiative.initiativeId}
            icon={MapMarker}
            position={initiative.coordinate}
            eventHandlers={{
              click: () => {
                void navigate(
                  `/Monitoreo/Dept/${initiative.mainLocationId}/${initiative.initiativeId}`,
                );
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              {initiative.initiativeName}
            </Tooltip>
          </Marker>
        );
      })}

      <ChangeView bounds={bounds ?? COUNTRY_BOUNDS} center={center} />

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
            weight: 2,
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

          layer.on("click", () => {
            const f = feature as DeptFeature;
            void navigate(`/Monitoreo/Dept/${f.properties.gid}`);
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
