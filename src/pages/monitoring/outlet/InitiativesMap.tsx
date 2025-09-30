import { SearchBar } from "pages/monitoring/outlet/initiativesMap/SearchBar";
import { Browser } from "pages/monitoring/outlet/initiativesMap/Browser";
import "pages/monitoring/styles/monitoring.css";
import { MapFinder } from "pages/monitoring/outlet/initiativesMap/MapFinder";

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
