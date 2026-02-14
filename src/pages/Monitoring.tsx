import { useEffect } from "react";
import { Outlet, useOutletContext } from "react-router";
import { Toaster } from "sonner";

import { SideBar } from "pages/monitoring/layout/SideBar";
import "pages/monitoring/styles/monitoring.css";
import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { UserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";

export function Monitoring() {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Monitoreo Comunitario",
        logos: new Set(["usaid", "geobon", "umed", "temple"]),
        className: "mingrid",
      },
    });
  }, [layoutDispatch]);

  return (
    <UserInMonitoringCTX>
      <div className="monitoring-root">
        <SideBar />

        <Outlet />
        <Toaster />
      </div>
    </UserInMonitoringCTX>
  );
}
