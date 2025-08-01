import { SearchBar } from "pages/monitoring/searchBar";
import { SideBar } from "pages/monitoring/sideBar";
import { Map } from "pages/monitoring/Map";
import { Dashboard } from "pages/monitoring/Dashboard";
import "pages/monitoring/styles/monitoring.css";

export const Monitoring = () => {
  return (
    <div className="monitoring-root">
      <div className="map-wrapper">
        <Map />
      </div>

      <div className="monitoring-body">
        <SearchBar />
        <SideBar />
        <Dashboard title="" subtitle="" children={null} />
      </div>
    </div>
  );
};
