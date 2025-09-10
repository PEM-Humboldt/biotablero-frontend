import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

import { SearchBar } from "pages/monitoring/searchBar";
import { SideBar } from "pages/monitoring/sideBar";
import { Map } from "pages/monitoring/Map";
import { Dashboard } from "pages/monitoring/Dashboard";
import "pages/monitoring/styles/monitoring.css";
import type { UiManager } from "app/Layout";
import { UpdatedLayout } from "app/layout/layoutReducer";

export function Monitoring() {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: UpdatedLayout.CHANGE_SECTION,
      sectionData: {
        moduleName: "Monitoreo Comunitario",
        logos: new Set(["usaid", "geobon", "umed", "temple"]),
        className: "fullgrid",
      },
    });
  }, [layoutDispatch]);

  return (
    <div className="monitoring-root">
      <div className="map-wrapper">
        <Map />
      </div>

      <div className="monitoring-body">
        <SearchBar />
        <SideBar />
        <Dashboard title="" subtitle="">
          {null}
        </Dashboard>
      </div>
    </div>
  );
}
