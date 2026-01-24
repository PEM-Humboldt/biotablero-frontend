import { SearchBar } from "pages/monitoring/outlets/initiativesMap/SearchBar";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";
import "pages/monitoring/styles/monitoring.css";
import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";

export function InitiativesMap() {
  return (
    <>
      <div className="flex flex-col h-full w-full">
        <SearchBar />
        <Browser title="" subtitle="">
          {null}
        </Browser>
        <MapFinder />
      </div>
    </>
  );
}
