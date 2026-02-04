import { useEffect, useState } from "react";

import { useUserCTX } from "@hooks/UserContext";

import { getUserInitiativesInfo } from "pages/monitoring/api/monitoringAPI";
import type { UserInitiatives } from "pages/monitoring/types/requestParams";
import { JoinRequests } from "pages/monitoring/outlets/initiativesManagement/JoinRequest";

enum Role {
  LEADER = 1,
  USER = 2,
  VIEWER = 3,
}

export function InitiativesManagement() {
  const { user } = useUserCTX();
  const [userInitiatives, setUserInitiatives] = useState<
    Partial<Record<Role, UserInitiatives[]>>
  >({});

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    const fetchInitiatives = async () => {
      const initiatives = await getUserInitiativesInfo();

      const initiativesByRole = initiatives.reduce<
        Partial<Record<Role, UserInitiatives[]>>
      >((groups, initiative) => {
        const userInInitiative = initiative.users.find(
          (u) => u.userName === user?.username,
        );
        const roleId = userInInitiative?.level.id ?? 0;

        if (!roleId || !(roleId in Role)) {
          return groups;
        }

        const role = roleId as Role;
        if (!groups[role]) {
          groups[role] = [];
        }
        groups[role].push(initiative);

        return groups;
      }, {});

      setUserInitiatives(initiativesByRole);
    };

    void fetchInitiatives();
  }, [user?.username]);

  return (
    <div className="ml-[60px] bg-[#f5f5f5] p-4 flex flex-col gap-4 items-center min-h-screen">
      <div className="p-6 pb-0 w-full flex justify-between">
        <h3 className="h1 text-primary">Tablero de iniciativas</h3>
      </div>

      <JoinRequests InitiativesAsLeader={userInitiatives[Role.LEADER]} />
    </div>
  );
}
