import type { TagDataForm } from "pages/monitoring/outlets/tagsAdmin/types/tagData";

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
