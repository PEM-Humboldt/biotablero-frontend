import { SearchBar } from "pages/monitoring/outlets/initiativesMap/SearchBar";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";
import "pages/monitoring/styles/monitoring.css";
import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";

export function InitiativesMap() {
  return (
    <>
      <SearchBar />
      <Browser title="" subtitle="">
        {null}
      </Browser>
      <div className="flex h-full">
        <MapFinder />
      </div>
    </>
  );
}
