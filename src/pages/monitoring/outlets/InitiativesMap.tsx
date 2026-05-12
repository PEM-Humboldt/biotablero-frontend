import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";
import { CurrentInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useEffect, useState } from "react";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { getInitiativeLocations } from "pages/monitoring/api/services/initiatives";
import { type InitiativeByLocation } from "pages/monitoring/types/initiative";

export function InitiativesMap() {
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);

  useEffect(() => {
    const fetchInitiativeLocations = async () => {
      const res = await getInitiativeLocations();

      if (isMonitoringAPIError(res)) {
        setInitiatives([]);
        return;
      }
      setInitiatives(res);
    };

    void fetchInitiativeLocations();
  }, []);

  return (
    <CurrentInitiativeCTX>
      <div className="relative flex flex-col h-full w-full">
        <Browser />
        <MapFinder initiatives={initiatives} />
        {/* <MapLegend initiatives={initiatives} /> */}
      </div>
    </CurrentInitiativeCTX>
  );
}
