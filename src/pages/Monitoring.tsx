import { Outlet, useOutletContext } from "react-router";
import { useEffect } from "react";

import "pages/monitoring/styles/monitoring.css";
import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { SidebarProvider, SidebarTrigger } from "@ui/shadCN/component/sidebar";
import { MonitoringSidebar } from "./monitoring/layout/sidebar";

export function Monitoring() {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Monitoreo Comunitario",
        logos: new Set(["usaid", "geobon", "umed", "temple"]),
      },
    });
  }, [layoutDispatch]);

  return (
    <SidebarProvider>
      <div className="relative">
        <MonitoringSidebar className="pt-14" />
        <SidebarTrigger className="absolute -right-4 top-4 z-10" />
      </div>
      <Outlet />
    </SidebarProvider>
  );
}
