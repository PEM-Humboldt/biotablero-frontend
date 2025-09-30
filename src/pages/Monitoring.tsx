import { Outlet, useOutletContext } from "react-router";
import { useEffect } from "react";

import { SideBar } from "pages/monitoring/layout/SideBar";
import "pages/monitoring/styles/monitoring.css";
import type { UiManager } from "app/Layout";
import { LayoutUpdated } from "app/layout/layoutReducer";

export function Monitoring() {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Monitoreo Comunitario",
        logos: new Set(["usaid", "geobon", "umed", "temple"]),
        className: "fullgrid",
      },
    });
  }, [layoutDispatch]);

  return (
    <div className="monitoring-root">
      <SideBar />

      <Outlet />
    </div>
  );
}
