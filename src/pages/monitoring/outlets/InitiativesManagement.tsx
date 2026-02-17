import { useEffect, useState } from "react";

import { useUserCTX } from "@hooks/UserContext";

import { getUserInitiativesInfo } from "pages/monitoring/api/monitoringAPI";
import type { UserInitiatives } from "pages/monitoring/types/requestParams";
import { JoinRequests } from "pages/monitoring/outlets/initiativesManagement/JoinRequest";
import { InitiativeUpdater } from "./initiativesManagement/InitiativeUpdater";

export enum RoleInInitiative {
  LEADER = 1,
  USER = 2,
  VIEWER = 3,
}

export function InitiativesManagement() {
  const { user } = useUserCTX();
  const [userInitiatives, setUserInitiatives] = useState<
    Partial<Record<RoleInInitiative, UserInitiatives[]>>
  >({});

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    const fetchInitiatives = async () => {
      const initiatives = await getUserInitiativesInfo();

      const initiativesByRole = initiatives.reduce<
        Partial<Record<RoleInInitiative, UserInitiatives[]>>
      >((groups, initiative) => {
        const userInInitiative = initiative.users.find(
          (u) => u.userName === user?.username,
        );
        const roleId = userInInitiative?.level.id ?? 0;

        if (!roleId || !(roleId in RoleInInitiative)) {
          return groups;
        }

        const role = roleId as RoleInInitiative;
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
    <main className="page-main">
      <header>
        <h3>Tablero de iniciativas</h3>
      </header>

      <JoinRequests
        InitiativesAsLeader={userInitiatives[RoleInInitiative.LEADER]}
      />
      <InitiativeUpdater
        initiativesAsLeader={userInitiatives[RoleInInitiative.LEADER]}
      />
    </main>
  );
}
