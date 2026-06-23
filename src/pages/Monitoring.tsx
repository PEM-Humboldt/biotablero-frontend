import { useEffect } from "react";
import { Outlet, useOutletContext } from "react-router";

import { SidebarProvider } from "@ui/shadCN/component/sidebar";

import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { UserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { MonitoringSidebar } from "pages/monitoring/layout/MonitoringSidebar";
import { CurrentInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { Glosary } from "pages/monitoring/layout/Glosary";

export function Monitoring() {
  const { layoutDispatch, layoutState } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleInfo: { name: "Monitoreo Comunitario", icon: "monitoring" },
        logos: new Set(),
      },
    });
  }, [layoutDispatch]);

  return (
    <UserInMonitoringCTX>
      <CurrentInitiativeCTX>
        <SidebarProvider defaultOpen={false}>
          <MonitoringSidebar />
          <Glosary />

          <Outlet context={{ layoutState, layoutDispatch }} />
        </SidebarProvider>
      </CurrentInitiativeCTX>
    </UserInMonitoringCTX>
  );
}
