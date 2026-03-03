import { useEffect } from "react";

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
    <div className="text-center font-light text-4xl text-primary px-12 py-6">
      <InitiativeInvitationForm initiativeId={initiativeId} />
    </div>
  );
}
