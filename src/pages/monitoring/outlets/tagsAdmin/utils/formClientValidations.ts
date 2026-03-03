import { FormClientValidation } from "pages/monitoring/outlets/initiativesAdmin/types/form";
import { TagDataForm } from "../types/tagData";
import { uiText } from "../layout/uiText";

export const tagValidations: FormClientValidation<TagDataForm>[] = [
  {
    condition: (f) => Boolean(f.category.id) && f.category.id > 0,
    path: "categoryId",
    message: uiText.form.validation.categoryIdRequired,
  },
];
