import { type MutableRefObject } from "react";
import type {
  InitiativeDataForm,
  InitiativeFullInfo,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export function getInitialInfo(
  dataToUpdate?: InitiativeFullInfo,
): InitiativeDataForm {
  if (dataToUpdate) {
    const {
      name,
      shortName,
      description,
      imageUrl,
      bannerUrl,
      ...initiativeData
    } = dataToUpdate;
    const general = { name, shortName: shortName ?? "", description };
    const images = { imageUrl: imageUrl ?? "", bannerUrl: bannerUrl ?? "" };

    return { ...initiativeData, general, images };
  }

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
