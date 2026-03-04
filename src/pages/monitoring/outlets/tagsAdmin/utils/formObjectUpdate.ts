import { TagDataForm } from "../types/tagData";

export function makeInitialInfo(): TagDataForm {
  return {
    name: "",
    url: "",
    category: {
      id: 0,
      name: "",
    }
  };
}