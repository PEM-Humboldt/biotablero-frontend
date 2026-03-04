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