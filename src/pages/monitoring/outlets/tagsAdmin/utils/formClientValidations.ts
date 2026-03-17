import type { TagDataForm } from "pages/monitoring/types/tagData";
import { uiText } from "pages/monitoring/outlets/tagsAdmin/layout/uiText";
import type { FormClientValidation } from "pages/monitoring/types/formValidation";

export const tagValidations: FormClientValidation<TagDataForm>[] = [
  {
    condition: (f) => Boolean(f.category.id) && f.category.id > 0,
    path: "category",
    message: uiText.form.validation.categoryIdRequired,
  },
  {
    condition: (f) => Boolean(f.name),
    path: "name",
    message: uiText.form.validation.nameRequired,
  },
];
