import { type FormEvent, useCallback, useState, useEffect } from "react";

import { Button } from "@ui/shadCN/component/button";
import {
  inputLengthCount,
  inputWarnColor,
} from "@utils/ui";

import {
  isMonitoringAPIError,
} from "pages/monitoring/api/types/guards";
import { uiText } from "pages/monitoring/outlets/tagsAdmin/layout/uiText";
import type {
  TagCategory,
  TagDataForm,
  TagDataFormErr,
} from "pages/monitoring/types/tagData";
import { tagValidations } from "pages/monitoring/outlets/tagsAdmin/utils/formClientValidations";
import { makeInitialInfo } from "pages/monitoring/outlets/tagsAdmin/utils/formObjectUpdate";
import { StrValidator } from "@utils/strValidator";
import { TAG_NAME_MAX_LENGTH, TAG_URL_MAX_LENGTH } from "@config/monitoring";
import { ErrorsList, LabelAndErrors } from "@ui/LabelingWithErrors";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import { validateFormClient } from "pages/monitoring/ui/initiativesAdmin/utils/validateFormClient";
import { toast } from "sonner";
import { PlusIcon, UserRoundCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/shadCN/component/dialog";
import { translateTagCategory } from "pages/monitoring/outlets/tagsAdmin/utils/tagCategoryTranslator";
import { addTag, getTagById, getTagCategories, updateTag } from "pages/monitoring/api/services/tags";
import { DestructiveConfirmationDialog } from "@ui/DestructiveConfirmationDialog";

export function TagFormButton({
  value: tagId,
  onActionSuccess,
}: {
  value?: unknown;
  onActionSuccess?: () => void;
}) {
  const [errors, setErrors] = useState<Partial<TagDataFormErr>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadStatusMsg, setLoadStatusMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<TagDataForm>(makeInitialInfo());
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  if (tagId != null && typeof tagId !== "number") {
    throw new Error(
      `Expected type of value: number, received: ${typeof tagId}`,
    );
  }

  const fetchTag = async () => {
    try {
      if (tagId) {
        setLoadStatusMsg(uiText.table.loadStatus.loading);
        const res = await getTagById(tagId);

        if (isMonitoringAPIError(res)) {
          setErrors({ root: [res.message] });
        } else {
          setFormData({
            name: res.name || "",
            url: res.url || "",
            category: res.category || { id: 0, name: "" },
          });
          setErrors({});
        }

        setLoadStatusMsg(uiText.table.loadStatus.loaded);
      }
    } catch (err) {
      setLoadStatusMsg(uiText.table.loadStatus.error);
      console.error(err);
      setErrors({ root: ["Error obteniendo la etiqueta."] });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTagCategories = async () => {
    try {
      setLoadStatusMsg(uiText.table.loadStatus.loading);
      const result = await getTagCategories();

      if (isMonitoringAPIError(result)) {
        throw new Error(result.message);
      }

      setTagCategories(
        result.map((category) => ({
          ...category,
          name: translateTagCategory(category.name),
        })),
      );

      setLoadStatusMsg(uiText.table.loadStatus.loaded);
    } catch (err) {
      setLoadStatusMsg(uiText.table.loadStatus.error);
      console.error(err);
      setErrors({ root: ["Error obteniendo las categorías."] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tagId) {
      setIsLoading(true);
    } else {
      setFormData(makeInitialInfo());      
      setErrors({});
    }
  }, [tagId]);

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
  };

  const categoryOnBlur = () => {
    if (tagId) {
      return;
    }
    const categoryId = formData.category.id;
    if (!categoryId || categoryId <= 0) {
      setErrors((old) => ({
        ...old,
        categoryId: [uiText.form.validation.categoryIdRequired],
      }));
    } else {
      setErrors(({ category: _, ...old }) => old);
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
        .hasLengthLessOrEqualThan(TAG_URL_MAX_LENGTH)
        .isURL(),
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

    const validations = tagId
      ? tagValidations.filter((v) => v.path !== "categoryId")
      : tagValidations;
    const currentErrors = validateFormClient(formData, validations);
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const finalUrl = formData.url?.trim() || null;
      const payload = (!tagId
        ? {
            name: formData.name,
            url: finalUrl,
            category: formData.category,
          }
        : {
            name: formData.name,
            url: finalUrl,
          }) as unknown as TagDataForm;
      
      let res = null;

      if (!tagId) {
        res = await addTag(payload);
      } else {
        res = await updateTag(tagId, payload);
      }

      if (isMonitoringAPIError(res)) {
        setErrors((oldErr) => ({
          ...oldErr,
          root: res.data.map((error) => error.msg),
        }));
        console.error(res);

        return;
      }

      toast(uiText.toast.create.title, {
        position: "bottom-right",
        description: tagId
          ? uiText.toast.edit.description
          : uiText.toast.create.description,
        icon: <UserRoundCheck className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });

      setOpenDialog(false);
      onActionSuccess?.();
    } catch (err) {
      setErrors((oldErr) => ({ ...oldErr, root: [uiText.criticalError.user] }));
      console.error(uiText.criticalError.log, err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      return !tagId ? uiText.tag.creatingNew : "Actualizando...";
    }
    return !tagId ? uiText.tag.createNew : "Actualizar etiqueta";
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {tagId &&
          <>
            <DialogTrigger asChild>
              <Button
                onClick={() => void fetchTag()}
                disabled={loadStatusMsg !== null}
                variant="ghost"
              >
                {loadStatusMsg !== null
                  ? loadStatusMsg
                  : uiText.table.editBtn.defaultText}
              </Button>
            </DialogTrigger>
            <DestructiveConfirmationDialog
              texts={{
                trigger: uiText.table.deleteBtn.trigger,
                dialog: {
                  title: uiText.table.deleteBtn.dialog.title,
                  description: uiText.table.deleteBtn.dialog.description(
                    formData?.name ?? "",
                  ),
                },
                actionBtns: uiText.table.deleteBtn.actionBtns,
              }}
              triggerBtnVariant="ghost"
              handler={() => void console.log(formData)}
              isDisabled = {loadStatusMsg !== null}
            />
          </>
        }
        {!tagId &&
          <DialogTrigger asChild>
            <Button
              onClick={() => void fetchTagCategories()}
              disabled={loadStatusMsg !== null}
            >
              {loadStatusMsg !== null
                ? loadStatusMsg
                : uiText.tag.createNew}
              <PlusIcon /> 
            </Button>
          </DialogTrigger>
        }
        <DialogContent className="max-h-[80vh] max-w-[60vh] flex flex-col p-4 md:p-8 overflow-hidden">
          <div className="pb-2">
            <DialogHeader>
              <DialogTitle>{!tagId ? "Nueva etiqueta" : "Editar etiqueta"}</DialogTitle>
            </DialogHeader>
          </div>
          <div className="grid grid-cols-1 gap-6 [&>p]:m-0 [&>p]:flex [&>p]:flex-col [&>p>span]:first:font-semibold [&>p>span]:first:text-primary">
            
            <form
              action=""
              onReset={handleFormReset}
              onSubmit={(e) => void handleSubmit(e)}
              className="flex flex-col gap-2 p-6"
            >
              {!tagId &&
                <div>
                  <LabelAndErrors
                    htmlFor="category"
                    errID="errors_category"
                    validationErrors={errors.category ?? []}
                    className="mb-1 text-sm font-medium"
                  >
                    {uiText.form.selectCategoryLabel}{" "}
                    {!tagId && <span aria-hidden="true">*</span>}
                  </LabelAndErrors>
                  <NativeSelect
                    id="category"
                    value={formData.category.id || ""}
                    onChange={(e) =>
                      setFormData((old) => ({
                        ...old,
                        category: {
                          id: Number(e.target.value),
                          name: "",
                        },
                      }))
                    }
                    onBlur={categoryOnBlur}
                    disabled={!!tagId || isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    aria-invalid={errors.category !== undefined}
                    aria-describedby={errors.category ? "errors_category" : undefined}
                  >
                    <NativeSelectOption key={"tag_category_default"} value="" disabled>
                      {uiText.form.defaultCategoryTitle}
                    </NativeSelectOption>
                    {tagCategories.map((category) => (
                      <NativeSelectOption key={`tag_category_${category.id}`} value={category.id}>
                        {category.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              }

              {!!tagId &&
                <div>
                  <label
                    htmlFor="categoryName"
                    className="mb-1 text-sm font-medium"
                  >
                    {uiText.form.category}
                  </label>
                  <InputGroup>
                    <InputGroupInput
                      id="categoryName"
                      type="text"
                      value={translateTagCategory(formData.category.name)}
                      disabled={true}
                    />
                  </InputGroup>
                </div>
              }

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
                    placeholder="Nombre de la etiqueta"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((old) => ({ ...old, name: e.target.value }))
                    }
                    onBlur={nameOnBlur}
                    disabled={isLoading}
                    aria-invalid={errors.name !== undefined}
                    aria-describedby={errors.name ? "errors_name" : undefined}
                    maxLength={TAG_NAME_MAX_LENGTH}
                  />
                  <InputGroupAddon
                    align="block-end"
                    className={`${inputWarnColor(formData.name, TAG_NAME_MAX_LENGTH, 0.95)} flex-row-reverse`}
                  >
                    {inputLengthCount(formData.name, TAG_NAME_MAX_LENGTH)}
                  </InputGroupAddon>
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
                    placeholder="https://ejemplo.co"
                    value={formData.url ?? ""}
                    onChange={(e) =>
                      setFormData((old) => ({ ...old, url: e.target.value }))
                    }
                    onBlur={urlOnBlur}
                    disabled={isLoading}
                    aria-invalid={errors.url !== undefined}
                    aria-describedby={errors.url ? "errors_url" : undefined}
                    maxLength={TAG_URL_MAX_LENGTH}
                  />
                  <InputGroupAddon
                    align="block-end"
                    className={`${inputWarnColor(formData.url ?? "", TAG_URL_MAX_LENGTH, 0.95)} flex-row-reverse`}
                  >
                    {inputLengthCount(formData.url ?? "", TAG_URL_MAX_LENGTH)}
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <ErrorsList
                errorItems={errors.root ?? []}
                className="bg-red-50 p-4 mt-2 rounded-lg outline-2 outline-accent"
              />

              <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-2">
                <Button
                  type="submit"
                  disabled={isLoading || (!tagId && tagCategories.length === 0)}
                >
                  {getSubmitButtonText()}
                </Button>
                {!tagId &&
                  <Button
                    type="reset"
                    variant="outline_destructive"
                    disabled={isLoading}
                  >
                    {uiText.restartForm}
                  </Button>
                }
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
