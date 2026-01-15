import { type MutableRefObject } from "react";
import { type InitiativeDataForm } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export function makeInitialInfo(): InitiativeDataForm {
  return {
    general: { name: "", shortName: "", description: "" },
    locations: [],
    contacts: [],
    users: [],
    images: { imageUrl: "", bannerUrl: "" },
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
