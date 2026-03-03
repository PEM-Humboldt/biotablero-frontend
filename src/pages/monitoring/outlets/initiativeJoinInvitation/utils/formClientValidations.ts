import type { FormClientValidation } from "pages/monitoring/types/formValidation";
import type { JoinInitiativeDataForm } from "pages/monitoring/outlets/initiativeJoinInvitation/types/initiativeInvitationData";
import { uiText } from "pages/monitoring/outlets/initiativeJoinInvitation/layout/uiText";
import { StrValidator } from "@utils/strValidator";

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
        return f.guests.every((g: { email: string }) => {
          const [, errors] = new StrValidator(g.email).isEmail().result;
          return errors.length === 0;
        });
      },
      path: "guests",
      message: uiText.form.validation.badEmailFormat,
    },
  ];
