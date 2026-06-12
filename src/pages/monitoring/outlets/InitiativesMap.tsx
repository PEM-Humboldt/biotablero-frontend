import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";
import { CurrentInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";

export function InitiativesMap() {
  return (
    <CurrentInitiativeCTX>
      <div className="relative flex flex-col h-full w-full">
        <Browser />
        <MapFinder />
      </div>
    </CurrentInitiativeCTX>
  );
}
