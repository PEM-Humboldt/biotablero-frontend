import { RoleInInitiative } from "pages/monitoring/types/catalog";

import { JoinRequests } from "pages/monitoring/outlets/initiativesManagement/JoinRequest";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";

export function InitiativesManagement() {
  const { userInitiativesAs } = useUserInMonitoringCTX();
  return (
    <main className="page-main">
      <header>
        <h3>Tablero de iniciativas</h3>
      </header>

      <JoinRequests
        InitiativesAsLeader={userInitiativesAs[RoleInInitiative.LEADER]}
      />
    </main>
  );
}
