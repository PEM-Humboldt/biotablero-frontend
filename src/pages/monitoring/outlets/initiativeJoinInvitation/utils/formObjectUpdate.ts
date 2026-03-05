import type { JoinInitiativeDataForm } from "pages/monitoring/outlets/initiativeJoinInvitation/types/initiativeInvitationData";

export function makeInitialInfo(initiativeId: number): JoinInitiativeDataForm {
  return {
    initiativeId: initiativeId,
    message: "",
    guests: [],
  };
}
