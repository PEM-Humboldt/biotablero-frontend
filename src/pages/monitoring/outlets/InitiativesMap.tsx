import { SearchBar } from "pages/monitoring/outlets/initiativesMap/SearchBar";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";
import "pages/monitoring/styles/monitoring.css";
import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";
import { CurrentInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";

export function InitiativesMap() {
  return (
    <CurrentInitiativeCTX>
      <SearchBar />

      <Browser title="" subtitle="">
        {" "}
      </Browser>

      <div className="flex h-full">
        <MapFinder />
      </div>
    </CurrentInitiativeCTX>
  );
}
