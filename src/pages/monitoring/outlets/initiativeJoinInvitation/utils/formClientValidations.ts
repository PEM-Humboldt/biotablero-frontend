import { FormClientValidation } from "pages/monitoring/outlets/initiativesAdmin/types/form";
import { JoinInitiativeDataForm } from "pages/monitoring/outlets/initiativeJoinInvitation/types/initiativeInvitationData";
import { uiText } from "pages/monitoring/outlets/initiativeJoinInvitation/layout/uiText";

export const invitationValidations: FormClientValidation<JoinInitiativeDataForm>[] = [
  {
    condition: (f) => Boolean(f.initiativeId) && f.initiativeId > 0,
    path: "initiativeId",
    message: uiText.form.validation.initiativeIdRequired,
  },
  {
    condition: (f) => f.guests && f.guests.length > 0,
    path: "guests",
    message: uiText.form.validation.emailsRequired,
  },
  {
    condition: (f) => {
      if (!f.guests || f.guests.length === 0) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return f.guests.every((g) => emailRegex.test(g.email));
    },
    path: "guests",
    message: uiText.form.validation.badEmailFormat,
  },
];