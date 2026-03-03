import type { FormClientValidation } from "pages/monitoring/types/formValidation";
import type { JoinInitiativeDataForm } from "pages/monitoring/outlets/initiativeJoinInvitation/types/initiativeInvitationData";
import { uiText } from "pages/monitoring/outlets/initiativeJoinInvitation/layout/uiText";

export const invitationValidations: FormClientValidation<JoinInitiativeDataForm>[] =
  [
    {
      condition: (f: JoinInitiativeDataForm) =>
        Boolean(f.initiativeId) && f.initiativeId > 0,
      path: "initiativeId",
      message: uiText.form.validation.initiativeIdRequired,
    },
    {
      condition: (f: JoinInitiativeDataForm) =>
        Boolean(f.guests) && f.guests.length > 0,
      path: "guests",
      message: uiText.form.validation.emailsRequired,
    },
    {
      condition: (f: JoinInitiativeDataForm) => {
        if (!f.guests || f.guests.length === 0) {
          return true;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return f.guests.every((g: { email: string }) =>
          emailRegex.test(g.email),
        );
      },
      path: "guests",
      message: uiText.form.validation.badEmailFormat,
    },
  ];
