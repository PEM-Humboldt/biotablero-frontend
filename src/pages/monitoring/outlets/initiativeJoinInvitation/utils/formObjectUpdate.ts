import type { JoinInitiativeDataForm } from "pages/monitoring/outlets/initiativeJoinInvitation/types/initiativeInvitationData";

export function makeInitialInfo(): JoinInitiativeDataForm {
  return {
    initiativeId: 0,
    message: "",
    guests: [],
  };
}
