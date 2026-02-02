import type { InitiativeDataFormErr } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { FormClientValidation } from "pages/monitoring/outlets/initiativesAdmin/types/form";

export function validateFormClient<T>(
  formData: T,
  formClientValidations: FormClientValidation<T>[],
): Partial<InitiativeDataFormErr> {
  const foundErrors: Partial<InitiativeDataFormErr> = {};

  for (const validation of formClientValidations) {
    if (validation.condition(formData)) {
      continue;
    }

    const { path, message } = validation;

    resolveErrorPath(foundErrors, path).push(message);
  }

  return foundErrors;
}

function resolveErrorPath(
  errorObject: Record<string, unknown>,
  path: string,
): string[] {
  const keyChain = path.split("/");
  let current: Record<string, unknown> = errorObject;

  for (let i = 0; i < keyChain.length - 1; i++) {
    const key = keyChain[i];

    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  }

  if (current[keyChain[keyChain.length - 1]] === undefined) {
    current[keyChain[keyChain.length - 1]] = [];
  }

  return current[keyChain[keyChain.length - 1]] as string[];
}
