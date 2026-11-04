import { useEffect, useMemo, useState } from "react";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Polygon,
} from "geojson";

import { ErrorsList } from "@ui/LabelingWithErrors";

import type { DeptProperties } from "pages/monitoring/outlets/initiativesMap/types/mapFeatures";
import { type InitiativeByLocation } from "pages/monitoring/types/initiative";
import { getGeoJsonMap } from "pages/monitoring/api/services/location";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";
import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";
import { DataSheetAndNavigation } from "pages/monitoring/outlets/initiativesMap/DataSheetAndNavigation";
import { MapLegend } from "pages/monitoring/outlets/initiativesMap/MapLegend";
import { CardsAttachment } from "pages/monitoring/outlets/initiativesMap/CardsAttachment";
import { cn } from "@ui/shadCN/lib/utils";
import { useParams } from "react-router";

export function InitiativesMap() {
  const { departmentId } = useParams();

  const [tiles, setTiles] = useState(0);
  const [layer, setLayer] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const [nation, setNation] = useState<FeatureCollection | null>(null);
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [showDepartments, setShowDepartments] = useState(true);

  useEffect(() => {
    const fetchMapInfo = async () => {
      const mapInfo = await getGeoJsonMap();

      if (isMonitoringAPIError(mapInfo)) {
        setErrors(mapInfo.data.map((err) => err.msg));
        return;
      }
      setNation(mapInfo);

      const initiativesLocations = await getInitiativeLocations();

      if (isMonitoringAPIError(initiativesLocations)) {
        setErrors(initiativesLocations.data.map((err) => err.msg));
        setInitiatives([]);
        return;
      }
      setInitiatives(initiativesLocations);
    };

    void fetchMapInfo();
  }, []);

  const activeFeatures = useMemo<
    { feature: Feature<Geometry, GeoJsonProperties>; count: number }[]
  >(() => {
    if (!initiatives.length || !nation || !nation?.features) {
      return [];
    }

    const groupedInitiatives = initiatives.reduce<Record<number, number>>(
      (all, current) => {
        if (!all[current.mainLocationId]) {
          all[current.mainLocationId] = 0;
        }
        all[current.mainLocationId] += 1;
        return all;
      },
      {},
    );

    const results = [];

    for (const feature of nation.features as Feature<
      Polygon | MultiPolygon
    >[]) {
      if (groupedInitiatives[feature.properties?.gid as number] > 0) {
        results.push({
          feature,
          count: groupedInitiatives[feature.properties?.gid as number],
        });
      }
    }

    return results;
  }, [initiatives, nation]);

  const [leastInitiativesPerDepartment, mostInitiativesPerDepartment] =
    useMemo(() => {
      let [currentMin, currentMax] = activeFeatures.reduce(
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

      if (currentMin === Infinity) {
        currentMin = 1;
      }
      if (currentMax === 0) {
        currentMax = 2;
      }
      if (currentMin === currentMax) {
        currentMax++;
      }

      return [currentMin, currentMax];
    }, [activeFeatures]);

  const activeDepartmentsList = useMemo(
    () =>
      activeFeatures.map(({ feature }) => {
        const f = feature.properties as DeptProperties;
        return { value: String(f.gid), label: f.geofence_name };
      }),
    [activeFeatures],
  );

  return errors.length > 0 ? (
    <ErrorsList errorItems={errors} />
  ) : (
    <div className="relative h-full w-full">
      <div className="relative flex flex-col min-h-[70dvh] xl:h-full w-full">
        <MapFinder
          tiles={tiles}
          layer={layer}
          nation={nation}
          initiatives={initiatives}
          activeFeatures={showDepartments ? activeFeatures : []}
          leastInitiativesPerDepartment={leastInitiativesPerDepartment}
          mostInitiativesPerDepartment={mostInitiativesPerDepartment}
        />

        <MapLegend
          leastInitiativesPerDepartment={leastInitiativesPerDepartment}
          mostInitiativesPerDepartment={mostInitiativesPerDepartment}
          activeDepartments={activeDepartmentsList}
          tiles={tiles}
          setTiles={setTiles}
          layers={layer}
          setLayers={setLayer}
          showDepartments={showDepartments}
          setShowDepartments={setShowDepartments}
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:*:flex-1 xl:contents">
        <DataSheetAndNavigation
          initiatives={initiatives}
          className={cn(
            "relative z-10",
            "xl:absolute xl:w-106 xl:top-4 xl:left-4 xl:rounded-lg xl:shadow-md xl:overflow-hidden",
          )}
        />

        <CardsAttachment
          className={cn(
            "relative z-10 ",
            "xl:absolute xl:w-74 xl:top-16 xl:left-112 xl:rounded-lg xl:overflow-hidden xl-shadow-2xl",
            "transition-all duration-300 ease-in-out",
            !departmentId
              ? "hidden xl:block! xl:-translate-y-100 xl:opacity-0 xl:pointer-events-none"
              : "block! xl:translate-y-0 xl:opacity-100",
          )}
        />
      </div>
    </div>
  );
}
