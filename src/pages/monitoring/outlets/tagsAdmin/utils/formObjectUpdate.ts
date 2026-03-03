import { type MutableRefObject } from "react";
import { TagDataForm } from "../types/tagData";

export function makeInitialInfo(): TagDataForm {
  return {
    name: "",
    url: undefined,
    category: {
      id: 0,
    },
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
