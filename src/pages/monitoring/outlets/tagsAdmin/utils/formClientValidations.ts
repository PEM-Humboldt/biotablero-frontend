import { TagDataForm } from "../types/tagData";
import { uiText } from "../layout/uiText";
import { FormClientValidation } from "pages/monitoring/types/formValidation";

export const tagValidations: FormClientValidation<TagDataForm>[] = [
  {
    condition: (f) => Boolean(f.category.id) && f.category.id > 0,
    path: "categoryId",
    message: uiText.form.validation.categoryIdRequired,
  },
  {
    condition: (f) => Boolean(f.name),
    path: "name",
    message: uiText.form.validation.nameRequired,
  },
];
