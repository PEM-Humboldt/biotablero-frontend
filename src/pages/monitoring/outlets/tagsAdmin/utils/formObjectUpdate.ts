import type { TagDataForm } from "pages/monitoring/types/tagData";

export function makeInitialInfo(): TagDataForm {
  return {
    name: "",
    url: "",
    category: {
      id: 0,
      name: "",
    },
  };
}
