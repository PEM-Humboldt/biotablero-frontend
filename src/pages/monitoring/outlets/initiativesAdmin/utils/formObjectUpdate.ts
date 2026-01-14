import { type MutableRefObject } from "react";
import {
  isInitiativeDisplayInfo,
  type NewInitiativeDataGroups,
  type InitiativeDataForm,
  type InitiativeFullInfo,
  ExistingInitiativeDataGroups,
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

export function makeInitiativeInfoGroups(
  initiativeInfo: unknown,
): NewInitiativeDataGroups | null {
  if (!isInitiativeDisplayInfo(initiativeInfo)) {
    return null;
  }

  const {
    name,
    shortName,
    description,
    imageUrl,
    bannerUrl,
    objective,
    influenceArea,
    ...initiative
  } = initiativeInfo;
  const general = {
    name,
    shortName: shortName ?? "",
    description,
    influenceArea: influenceArea ?? "",
    objective: objective ?? "",
  };
  const images = { imageUrl: imageUrl ?? "", bannerUrl: bannerUrl ?? "" };

  return { ...initiative, general, images };
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
