import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";
import { CurrentInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import { getLocationsList } from "pages/monitoring/api/services/location";
import { PageTitleUpdater } from "@ui/PageTitleUpdater";

export function InitiativesMap() {
  const [locations, setLocations] = useState<Record<number, string>>({});
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);

  const { departmentId, initiativeId } = useParams();

  useEffect(() => {
    const fetchLocations = async () => {
      const locationList = await getLocationsList();
      if (isMonitoringAPIError(locationList)) {
        return {};
      }
      setLocations(
        locationList.reduce<Record<number, string>>((all, current) => {
          all[current.id] = current.name;
          return all;
        }, {}),
      );
    };

    const fetchInitiativeLocations = async () => {
      const res = await getInitiativeLocations();

      if (isMonitoringAPIError(res)) {
        setInitiatives([]);
        return;
      }
      setInitiatives(res);
    };

    void fetchLocations();
    void fetchInitiativeLocations();
  }, []);

  const title = useMemo(
    () =>
      departmentId && locations[Number(departmentId)] !== undefined
        ? locations[Number(departmentId)]
        : "Colombia",
    [departmentId, locations],
  );

  const subtitle = useMemo(() => {
    if (!initiativeId) {
      return "";
    }

    const initiative = initiatives.find(
      (i) => i.initiativeId === Number(initiativeId),
    );

    if (!initiative) {
      return "";
    }

    return initiative.initiativeName;
  }, [initiativeId, initiatives]);

  return (
    <CurrentInitiativeCTX>
      <PageTitleUpdater title={title} subtitle={subtitle} />
      <div className="relative flex flex-col h-full w-full">
        <Browser locationsById={locations} />
        <MapFinder initiatives={initiatives} />
      </div>
    </CurrentInitiativeCTX>
  );
}
