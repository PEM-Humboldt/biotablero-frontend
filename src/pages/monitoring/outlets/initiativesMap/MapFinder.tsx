import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import L, { type LatLngBoundsLiteral } from "leaflet";
import { MapContainer, TileLayer, GeoJSON, WMSTileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";

import { INITIATIVES_MAP_GRADIENT, COUNTRY_BOUNDS } from "@config/monitoring";

import { createGradientScale } from "pages/monitoring/utils/createGradientScale";
import { type InitiativeByLocation } from "pages/monitoring/types/initiative";
import { ChangeView } from "pages/monitoring/outlets/initiativesMap/mapFinder/ChangeView";
import {
  clusterCustomIcon,
  MapMarker,
} from "pages/monitoring/outlets/initiativesMap/mapFinder/MapMarker";
import { ZoomControls } from "pages/monitoring/outlets/initiativesMap/mapFinder/ZoomControls";
import {
  MAP_LAYERS,
  MAP_TILES,
} from "pages/monitoring/outlets/initiativesMap/layout/layers";
import type {
  DeptFeature,
  DeptProperties,
} from "pages/monitoring/outlets/initiativesMap/types/mapFeatures";
import { Spinner } from "@ui/shadCN/component/spinner";

export function MapFinder({
  tiles,
  layer,
  nation,
  initiatives,
  activeFeatures,
  leastInitiativesPerDepartment,
  mostInitiativesPerDepartment,
}: {
  tiles: number;
  layer: number | null;
  nation: FeatureCollection | null;
  initiatives: InitiativeByLocation[];
  activeFeatures: {
    feature: Feature<Geometry, GeoJsonProperties>;
    count: number;
  }[];
  leastInitiativesPerDepartment: number;
  mostInitiativesPerDepartment: number;
}) {
  const { departmentId, initiativeId } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState<L.LatLng | null>(null);
  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        (i) => String(i.id) === initiativeId,
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

  const getColor = useMemo(
    () =>
      createGradientScale(
        leastInitiativesPerDepartment,
        mostInitiativesPerDepartment,
        INITIATIVES_MAP_GRADIENT,
      ),
    [leastInitiativesPerDepartment, mostInitiativesPerDepartment],
  );

  const setDeptStyle = (feature?: Feature) => {
    const f = feature as DeptFeature;
    const dataItem = activeFeatures.find(
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

  const setFeatureBehavior = (feature: Feature, layer: L.Layer) => {
    const f = feature as DeptFeature;

    const dataItem = activeFeatures.find(
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

  const layerAttribution =
    layer !== null && MAP_LAYERS[layer].attribution
      ? ` || ${MAP_LAYERS[layer].attribution}`
      : "";
  const tilesAttribution = MAP_TILES[tiles].attribution;
  const mapAttribution = `${tilesAttribution}${layerAttribution}`;

  return (
    <MapContainer
      bounds={COUNTRY_BOUNDS}
      maxZoom={10}
      minZoom={5}
      className="outline-none [&_.leaflet-interactive]:outline-none"
      zoomControl={false}
    >
      <ZoomControls />

      <MarkerClusterGroup
        iconCreateFunction={clusterCustomIcon}
        maxClusterRadius={25}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={true}
      >
        {initiatives.map((initiative) => (
          <MapMarker key={`marker_${initiative.id}`} initiative={initiative} />
        ))}
      </MarkerClusterGroup>

      <ChangeView bounds={bounds ?? COUNTRY_BOUNDS} center={center} />

      <GeoJSON
        key={`geojson-layer-${activeFeatures.length}`}
        data={
          {
            type: "FeatureCollection",
            features: activeFeatures.map((d) => d.feature),
          } as FeatureCollection<Geometry, DeptProperties>
        }
        style={setDeptStyle}
        onEachFeature={setFeatureBehavior}
      />

      <TileLayer
        key={`tile-layer-${tiles}`}
        attribution={mapAttribution}
        url={MAP_TILES[tiles].url}
      />

      {layer !== null && (
        <WMSTileLayer
          key={`${MAP_LAYERS[layer].url}-${MAP_LAYERS[layer].layers}`}
          url={MAP_LAYERS[layer].url}
          layers={MAP_LAYERS[layer].layers}
          format="image/png"
          transparent={true}
          version="1.1.0"
          zIndex={10}
          eventHandlers={{
            loading: () => {
              setIsLoading(true);
            },
            load: () => {
              setIsLoading(false);
            },
            tileerror: () => {
              setIsLoading(false);
              console.error("Error loading layer");
            },
          }}
        />
      )}

      {isLoading && (
        <div className="absolute inset-0 z-1000 bg-primary/50 backdrop-blur-[5px] flex flex-col items-center justify-center gap-2">
          <Spinner className="size-10 text-primary-foreground" />
          <span className="text-primary-foreground text-2xl font-normal">
            Cargando capa geográfica...
          </span>
        </div>
      )}
    </MapContainer>
  );
}
