import type { JoinInitiativeDataForm } from "pages/monitoring/types/userJoinRequest";

export function makeInitialInfo(initiativeId: number): JoinInitiativeDataForm {
  return {
    initiativeId: initiativeId,
    message: "",
    guests: [],
  };
}
