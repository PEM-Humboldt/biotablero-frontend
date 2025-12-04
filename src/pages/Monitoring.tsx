import { Outlet, useOutletContext } from "react-router";
import { useEffect } from "react";

import { SideBar } from "pages/monitoring/layout/SideBar";
import "pages/monitoring/styles/monitoring.css";
import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";

export function Monitoring() {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Monitoreo Comunitario",
        logos: new Set(["usaid", "geobon", "umed", "temple"]),
        className: "",
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
