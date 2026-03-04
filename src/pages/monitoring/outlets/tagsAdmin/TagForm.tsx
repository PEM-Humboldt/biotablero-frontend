import { type FormEvent, useCallback, useRef, useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { commonErrorMessage } from "@utils/ui";

import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { uiText } from "./layout/uiText";
import { TagCategory, TagDataForm, TagDataFormErr } from "./types/tagData";
import { tagValidations } from "./utils/formClientValidations";
import { validateFormClient } from "../initiativesAdmin/utils/validateFormClient";
import { makeInitialInfo } from "./utils/formObjectUpdate";
import { StrValidator } from "@utils/strValidator";
import { TAG_NAME_MAX_LENGTH, TAG_URL_MAX_LENGTH } from "@config/monitoring";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { InputGroup, InputGroupInput } from "@ui/shadCN/component/input-group";

export function TagForm({ tagCategories }: { tagCategories: TagCategory[] }) {
  const [errors, setErrors] = useState<Partial<TagDataFormErr>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TagDataForm>(makeInitialInfo());
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);

  const validateField = useCallback(
    (
      fieldName: keyof TagDataForm,
      validation: StrValidator,
      onClean?: (cleanValue: string) => void,
    ) => {
      const [cleanValue, fieldErrors] = validation.result;

      if (fieldErrors.length > 0) {
        setErrors((oldErr) => ({ ...oldErr, [fieldName]: fieldErrors }));
        return;
      }

      setErrors(({ [fieldName]: _, ...oldErr }) => oldErr);
      if (onClean) {
        onClean(cleanValue);
      }
    },
    [],
  );

  const handleFormReset = () => {
    setFormData(makeInitialInfo());
    setErrors({});
    setMessage(null);
  };

  const categoryOnBlur = () => {
    const categoryId = formData.categoryId;
    if (!categoryId || categoryId <= 0) {
      setErrors((old) => ({
        ...old,
        categoryId: [uiText.form.validation.categoryIdRequired],
      }));
    } else {
      setErrors(({ categoryId: _, ...old }) => old);
    }
  };

  const nameOnBlur = () =>
    validateField(
      "name",
      new StrValidator(formData.name)
        .isRequired()
        .sanitize()
        .hasLengthLessOrEqualThan(TAG_NAME_MAX_LENGTH),
      (val) => {
        setFormData((old) => ({ ...old, name: val }));
      },
    );

  const urlOnBlur = () =>
    validateField(
      "url",
      new StrValidator(formData.url ?? "")
        .isOptional()
        .sanitize()
        .hasLengthLessOrEqualThan(TAG_URL_MAX_LENGTH),
      (val) => {
        setFormData((old) => ({ ...old, url: val }));
      },
    );
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    categoryOnBlur();
    nameOnBlur();
    urlOnBlur();

    const currentErrors = validateFormClient(formData, tagValidations);
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const payload: TagDataForm = {
        name: formData.name,
        url: formData.url,
        categoryId: formData.categoryId,
      };

      const res = await monitoringAPI<TagDataForm>({
        type: "post",
        endpoint: "Tag",
        options: {
          data: payload,
        },
      });

      if (isMonitoringAPIError(res)) {
        const { status, message, data } = res;
        setErrors((oldErr) => ({
          ...oldErr,
          root: [
            `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
          ],
        }));
        console.error(res);

        return;
      }

      handleFormReset();
      setMessage({ text: uiText.successCreate, error: false });
    } catch (err) {
      setErrors((oldErr) => ({ ...oldErr, root: [uiText.criticalError.user] }));
      console.error(uiText.criticalError.log, err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full rounded-xl bg-white overflow-hidden">
      <h4 className="px-6 py-2 mb-0 text-base bg-primary text-primary-foreground">
        Nueva etiqueta
      </h4>

      <form
        action=""
        onReset={handleFormReset}
        onSubmit={(e) => void handleSubmit(e)}
        className="flex flex-col gap-2 p-6"
      >
        <div>
          <LabelAndErrors
            htmlFor="category"
            errID="errors_category"
            validationErrors={errors.categoryId ?? []}
            className="mb-1 text-sm font-medium"
          >
            {uiText.form.selectCategoryLabel}{" "}
            <span aria-hidden="true">*</span>
          </LabelAndErrors>
          <select
            id="category"
            value={formData.categoryId || ""}
            onChange={(e) =>
              setFormData((old) => ({
                ...old,
                categoryId: Number(e.target.value),
              }))
            }
            onBlur={categoryOnBlur}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 mt-1"
            aria-invalid={errors.categoryId !== undefined}
            aria-describedby={
              errors.categoryId ? "errors_category" : undefined
            }
          >
            <option value="" disabled>
              {uiText.form.defaultCategoryTitle}
            </option>
            {tagCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <LabelAndErrors
            htmlFor="name"
            errID="errors_name"
            validationErrors={errors.name ?? []}
            className="mb-1 text-sm font-medium"
          >
            {uiText.form.nameLabel}
            <span aria-hidden="true">*</span>
          </LabelAndErrors>
          <InputGroup>
            <InputGroupInput
              id="name"
              type="text"
              placeholder="Etiqueta"
              value={formData.name}
              onChange={(e) => setFormData((old) => ({ ...old, name: e.target.value }))}
              onBlur={nameOnBlur}
              disabled={isLoading}
              aria-invalid={errors.name !== undefined}
              aria-describedby={errors.name ? "errors_name" : undefined}
            />
          </InputGroup>
        </div>

        <div>
          <LabelAndErrors
            htmlFor="url"
            errID="errors_url"
            validationErrors={errors.url ?? []}
            className="mb-1 text-sm font-medium"
          >
            {uiText.form.urlLabel}
            <span aria-hidden="true">*</span>
          </LabelAndErrors>
          <InputGroup>
            <InputGroupInput
              id="url"
              type="text"
              placeholder="http://google.com"
              value={formData.url}
              onChange={(e) => setFormData((old) => ({ ...old, url: e.target.value }))}
              onBlur={urlOnBlur}
              disabled={isLoading}
              aria-invalid={errors.url !== undefined}
              aria-describedby={errors.url ? "errors_url" : undefined}
            />
          </InputGroup>
        </div>

        <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-2">
          <Button disabled={isLoading || tagCategories.length === 0}>
            {isLoading ? uiText.tag.creatingNew : uiText.tag.createNew}
          </Button>
          <Button
            type="reset"
            variant="outline_destructive"
            disabled={isLoading}
          >
            {uiText.restartForm}
          </Button>
        </div>
      </form>
    </div>
  );
}
