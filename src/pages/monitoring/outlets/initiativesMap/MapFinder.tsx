import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import L, { type LatLngBoundsLiteral } from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Polygon,
} from "geojson";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { INITIAVIVES_MAP_GRADIENT, COUNTRY_BOUNDS } from "@config/monitoring";

import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { createGradientScale } from "pages/monitoring/utils/createGradientScale";
import { type InitiativeByLocation } from "pages/monitoring/types/initiative";
import { ChangeView } from "pages/monitoring/outlets/initiativesMap/mapFinder/ChangeView";
import {
  clusterCustomIcon,
  MapMarker,
} from "pages/monitoring/outlets/initiativesMap/mapFinder/MapMarker";
import { ZoomControls } from "pages/monitoring/outlets/initiativesMap/mapFinder/ZoomControls";
import { MapLegend } from "pages/monitoring/outlets/initiativesMap/mapFinder/MapLegend";
import { MAP_LAYERS } from "pages/monitoring/outlets/initiativesMap/layout/layers";
import { getGeoJsonMap } from "pages/monitoring/api/services/location";

interface DeptProperties {
  geofence_name: string;
  gid: number;
}

type DeptFeature = Feature<Polygon | MultiPolygon, DeptProperties>;

export function MapFinder({
  initiatives,
}: {
  initiatives: InitiativeByLocation[];
}) {
  const { departmentId, initiativeId } = useParams();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<string[]>([]);
  const [center, setCenter] = useState<L.LatLng | null>(null);
  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null);
  const [nation, setNation] = useState<FeatureCollection | null>(null);
  const [layer, setLayer] = useState<keyof typeof MAP_LAYERS>(0);

  useEffect(() => {
    const fetchCountryMap = async () => {
      const res = await getGeoJsonMap();

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }
      setNation(res);
    };

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

  const depstWithInitiatives = useMemo(
    () =>
      processedData.map(({ feature }) => {
        const f = feature.properties as DeptProperties;
        return { value: String(f.gid), label: f.geofence_name };
      }),
    [processedData],
  );

  const [min, max] = useMemo(
    () =>
      processedData.reduce(
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
      ),
    [processedData],
  );

  const getColor = useMemo(
    () => createGradientScale(min, max, INITIAVIVES_MAP_GRADIENT),
    [min, max],
  );

  const setDeptStyle = (feature?: Feature) => {
    const f = feature as DeptFeature;
    const dataItem = processedData.find(
      (d) =>
        d.feature.properties?.geofence_name === f.properties?.geofence_name,
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
  };

  const setFeatureBeahviour = (feature: Feature, layer: L.Layer) => {
    const f = feature as DeptFeature;

    const dataItem = processedData.find(
      (d) =>
        d.feature.properties?.geofence_name === f.properties?.geofence_name,
    );

    layer.bindTooltip(
      `<strong>${f.properties?.geofence_name ?? "N/A"}</strong><br />${dataItem?.count ?? 0} iniciativas`,
      {
        sticky: true,
        direction: "top",
        offset: [0, -10],
        opacity: 1,
        className: "bg-primary! before:border-t-primary! px-4! py-2!",
      },
    );

    layer.on("click", () => {
      const f = feature as DeptFeature;
      void navigate(`/Monitoreo/Departamento/${f.properties.gid}`);
    });
  };

  return errors.length > 0 ? (
    <ErrorsList errorItems={errors} />
  ) : (
    <MapContainer
      bounds={bounds ?? COUNTRY_BOUNDS}
      zoom={6}
      maxZoom={10}
      minZoom={6}
      className="outline-none [&_.leaflet-interactive]:outline-none"
      zoomControl={false}
    >
      <ZoomControls />
      <MapLegend
        lowInitiativePerDepartment={min}
        highInitiativePerDepartment={max}
        departments={depstWithInitiatives}
        layer={layer}
        setLayer={setLayer}
      />
      <MarkerClusterGroup
        iconCreateFunction={clusterCustomIcon}
        maxClusterRadius={50}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={true}
      >
        {initiatives.map((initiative) => (
          <MapMarker
            key={`marker_${initiative.initiativeId}`}
            initiative={initiative}
          />
        ))}
      </MarkerClusterGroup>

      <ChangeView bounds={bounds ?? COUNTRY_BOUNDS} center={center} />

      <GeoJSON
        key={`geojson-layer-${processedData.length}`}
        data={
          {
            type: "FeatureCollection",
            features: processedData.map((d) => d.feature),
          } as FeatureCollection<Geometry, DeptProperties>
        }
        style={setDeptStyle}
        onEachFeature={setFeatureBeahviour}
      />

      <TileLayer
        key={`tile-layer-${layer}`}
        attribution={MAP_LAYERS[layer].attribution}
        url={MAP_LAYERS[layer].url}
      />
    </MapContainer>
  );
}
