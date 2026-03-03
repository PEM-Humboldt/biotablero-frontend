import { useEffect, useState } from "react";

import { useUserCTX } from "@hooks/UserContext";
import { getUserInitiativesInfo } from "pages/monitoring/api/monitoringAPI";
import type { UserInInitiative } from "pages/monitoring/types/odataResponse";

import { InitiativeInvitationForm } from "pages/monitoring/outlets/initiativeJoinInvitation/InitiativeInvitationForm";
import { RoleInInitiative } from "../types/catalog";

export function InitiativeInvitation() {
  const { user } = useUserCTX();
  const [userInitiatives, setUserInitiatives] = useState<
    Partial<Record<RoleInInitiative, UserInInitiative[]>>
  >({});

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    const fetchInitiatives = async () => {
      const initiatives = await getUserInitiativesInfo();
      const initiativesByRole = initiatives.reduce<
        Partial<Record<RoleInInitiative, UserInInitiative[]>>
      >((groups, initiative) => {
        const userInInitiative = initiative.users.find(
          (u) => u.userName === user?.username,
        );
        const roleId = userInInitiative?.level.id ?? 0;

        if (!roleId || !(roleId in RoleInInitiative) || roleId != RoleInInitiative.LEADER) {
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
        <h3>Invitar personas a una iniciativa</h3>
      </header>

      <InitiativeInvitationForm
        initiativesAsLeader={userInitiatives[RoleInInitiative.LEADER]}
      />
    </main>
  );
}
