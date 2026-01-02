import type {
  InitiativeDataForm,
  InitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { FormClientValidation } from "pages/monitoring/outlets/initiativesAdmin/types/form";

export function validateFormClient(
  formData: InitiativeDataForm,
  formClientValidations: FormClientValidation[],
): Partial<InitiativeDataFormErr> {
  const foundErrors: Partial<InitiativeDataFormErr> = {};

  for (const validation of formClientValidations) {
    if (validation.condition(formData)) {
      continue;
    }

    const { path, message } = validation;

    if (path === "general") {
      const child = validation.child;

      if (foundErrors[path] === undefined) {
        foundErrors[path] = {};
        foundErrors[path].root = [""];
      }

      if (foundErrors[path][child] === undefined) {
        foundErrors[path][child] = [];
      }

      foundErrors[path][child].push(message);
    } else {
      if (foundErrors[path] === undefined) {
        foundErrors[path] = [];
      }
      foundErrors[path].push(message);
    }
  }

  return foundErrors;
}
