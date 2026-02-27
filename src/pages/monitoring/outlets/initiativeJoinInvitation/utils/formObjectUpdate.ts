import { type MutableRefObject } from "react";
import { JoinInitiativeDataForm } from "../types/initiativeInvitationData";

export function makeInitialInfo(): JoinInitiativeDataForm {
  return {
    initiativeId: 0,
    message: "",
    guests: [],
  };
}

export function setFormField<F extends object, K extends keyof F>(
  formObject: MutableRefObject<F>,
  key: K,
) {
  function setFieldData(value: F[K]) {
    if (formObject.current) {
      formObject.current[key] = value;
    }
  }

  return setFieldData;
}
