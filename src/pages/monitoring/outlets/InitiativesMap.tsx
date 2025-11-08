import { SearchBar } from "pages/monitoring/outlets/initiativesMap/SearchBar";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";
import "pages/monitoring/styles/monitoring.css";
import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";

export function InitiativesMap() {
  return (
    <>
      <SearchBar />
      <div className="monitoring-body">
        <Browser title="" subtitle="">
          {null}
        </Browser>
      </div>

      <div className="map-wrapper">
        <MapFinder />
      </div>
    </>
  );
}
