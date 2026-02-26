import { useEffect, useState } from "react";

import { useUserCTX } from "@hooks/UserContext";
import { getUserInitiativesInfo } from "pages/monitoring/api/monitoringAPI";
import type { UserInitiatives } from "pages/monitoring/types/requestParams";

import { InitiativeInvitationForm } from "pages/monitoring/outlets/initiativeJoinInvitation/InitiativeJoinInvitationForm";

enum Role {
  LEADER = 1,
}

export function InitiativeJoinInvitation() {
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
    <main className="page-main">
      <header>
        <h3>Invitación a unirse a una iniciativa</h3>
      </header>

      <InitiativeInvitationForm
        initiativesAsLeader={userInitiatives[Role.LEADER]}
      />
    </main>
  );
}
