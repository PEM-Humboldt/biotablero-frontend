import { RoleInInitiative } from "@appTypes/user";

import { JoinRequests } from "pages/monitoring/outlets/initiativesManagement/JoinRequest";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";

export function InitiativesManagement() {
  const { userInitiativesAs } = useUserInMonitoringCTX();
  return (
    <div className="ml-[60px] bg-[#f5f5f5] p-4 flex flex-col gap-4 items-center min-h-screen">
      <div className="p-6 pb-0 w-full flex justify-between">
        <h3 className="h1 text-primary">Tablero de iniciativas</h3>
      </div>

      <JoinRequests
        InitiativesAsLeader={userInitiativesAs[RoleInInitiative.LEADER]}
      />
    </div>
  );
}
