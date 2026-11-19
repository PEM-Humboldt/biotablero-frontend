import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router";

import { MonitoringBackendUnavailable } from "@ui/MonitoringBackendUnavailable";
import { checkMonitoringBackend } from "pages/monitoring/api/services/health";

import { SidebarProvider } from "@ui/shadCN/component/sidebar";

import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { UserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { MonitoringMenu } from "pages/monitoring/layout/MonitoringMenu";
import { CurrentInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { Glosary } from "pages/monitoring/layout/Glosary";

export function Monitoring() {
  const { layoutDispatch, layoutState } = useOutletContext<UiManager>();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkBackend() {
      const available = await checkMonitoringBackend(controller.signal);
      if (!controller.signal.aborted) {
        setIsAvailable(available);
      }
    }

    void checkBackend();
    return () => controller.abort();
  }, [layoutState]);

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleInfo: { name: "Monitoreo Comunitario", icon: "monitoring" },
        logos: new Set(["monitoreoAmazonia", "fondoParaLaVida", "minAmbiente"]),
      },
    });
  }, [layoutDispatch]);

  if (isAvailable === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted text-primary">
        Comprobando conexión...
      </div>
    );
  }

  return !isAvailable ? (
    <MonitoringBackendUnavailable />
  ) : (
    <UserInMonitoringCTX>
      <CurrentInitiativeCTX>
        <SidebarProvider defaultOpen={false} className="flex-col xl:flex-row">
          <MonitoringMenu />

          <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr] w-full h-full">
            <Glosary />
            <Outlet context={{ layoutState, layoutDispatch }} />
          </div>
        </SidebarProvider>
      </CurrentInitiativeCTX>
    </UserInMonitoringCTX>
  );
}
