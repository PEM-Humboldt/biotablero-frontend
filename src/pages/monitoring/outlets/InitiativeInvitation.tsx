import { useEffect, useState } from "react";

import { useUserCTX } from "@hooks/UserContext";

import { InitiativeInvitationForm } from "pages/monitoring/outlets/initiativeJoinInvitation/InitiativeInvitationForm";

export function InitiativeInvitation({
  initiativeId,
}: {
  initiativeId: number;
}) {
  const { user } = useUserCTX();

  useEffect(() => {
    if (!user?.username) {
      return;
    }
  }, [user?.username]);

  return (
    <main className="page-main">
      <header>
        <h3>Invitar personas a una iniciativa</h3>
      </header>

      <InitiativeInvitationForm  initiativeId={initiativeId}/>
    </main>
  );
}
