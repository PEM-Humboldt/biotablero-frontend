import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Circle, CircleCheckBig, CirclePlus, Trash } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { LabeledInput } from "@ui/LabeledInput";
import { cn } from "@ui/shadCN/lib/utils";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { StrValidator } from "@utils/strValidator";
import { RESOURCE_FILE_MAX_SIZE } from "@config/monitoring";

import type { ResourceAttachment } from "pages/monitoring/types/odataResponse";
import { helperInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/helperInfo";
import { urlIsActive } from "pages/monitoring/outlets/resources/manager/resourcesEditor/utils/validations";

export function AttachmentInput({
  labelId,
  inputType,
  items,
  validationErrors,
  updater,
  descriptionMaxLength,
  contentMaxLength,
  text,
  currentHelper,
  helpers,
  setHelper,
}: {
  labelId: "files" | "links";
  inputType: "text" | "file";
  items: Partial<ResourceAttachment>[];
  validationErrors: string[];
  updater: (value: Partial<ResourceAttachment & { file: File }>[]) => void;
  descriptionMaxLength: number;
  text: {
    module: {
      title: string;
      attachmentsListTitle: string;
      attachmentTypes: string;
    };
    description: { label: string; sr?: string; placeholder: string };
    resource: { label: string; sr?: string; placeholder?: string };
  };
  contentMaxLength: number;
  currentHelper: keyof typeof helperInfo | null;
  helpers: (keyof typeof helperInfo)[];
  setHelper: Dispatch<SetStateAction<keyof typeof helperInfo | null>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [desctiptionErrors, setDescriptionErrors] = useState<string[]>([]);
  const [contentErrors, setContentErrors] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<string | File | null>(
    inputType === "text" ? "" : null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAdd = () => {
    setDescriptionErrors([]);

    const newItem =
      inputType === "text"
        ? { name: description, url: content as string }
        : { name: description, file: content as File, url: "" };

    updater([...items, newItem]);

    setDescription("");
    setContent(inputType === "text" ? "" : null);
    setDescriptionErrors([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    updater(items.filter((_, i) => i !== index));
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputType === "text") {
      return;
    }

    const file = e.target.files?.[0] || null;
    const maxFileSizeInMB = RESOURCE_FILE_MAX_SIZE * 1024 * 1024;
    setContentErrors([]);

    if (file && file.size > maxFileSizeInMB) {
      setContentErrors([
        `El archivo excede el tamaño máximo permitido (${RESOURCE_FILE_MAX_SIZE}MB).`,
      ]);
      setContent(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setContent(file);
  };

  useEffect(() => {
    setContentErrors([]);
    setDescriptionErrors([]);
  }, [currentHelper]);

  const handleDescriptionValidation = () => {
    setDescriptionErrors([]);
    const [descriptionSanitized, descriptionInputErrors] = new StrValidator(
      description,
    )
      .sanitize()
      .isRequired()
      .hasLengthLessOrEqualThan(descriptionMaxLength).result;

    if (descriptionInputErrors.length > 0) {
      setDescriptionErrors(descriptionInputErrors);
      return;
    }

    setDescription(descriptionSanitized);
  };

  const handleLinkValiadtion = async () => {
    if (inputType === "file") {
      return;
    }
    setContentErrors([]);

    const [linkSanitized, linkErrors] = (
      await new StrValidator(content as string, setIsLoading)
        .sanitize()
        .isRequired()
        .isURL()
        .customAsync(urlIsActive, "Revisa que la url esté activa")
    ).result;

    if (linkErrors.length > 0) {
      setContentErrors(linkErrors);
      return;
    }

    setContent(linkSanitized);
  };

  const unifiedErrors = [...validationErrors, ...desctiptionErrors];
  const accept =
    currentHelper && helperInfo[currentHelper].type === "files"
      ? helperInfo[currentHelper].fileType.join(", ")
      : undefined;

  return (
    <fieldset
      className={cn(
        "border flex flex-col gap-2 rounded-lg p-4 pt-2",
        helpers.includes(currentHelper ?? "")
          ? "border-primary shadow-lg"
          : "border-primary/30",
      )}
    >
      <div className="flex gap-2 justify-between">
        <h3 className="text-lg text-primary font-normal mb-0">
          {text.module.title}
        </h3>
        <span className="text-sm text-primary font-normal">
          {items.length} / {contentMaxLength}
        </span>
      </div>

      {items.length > 0 && (
        <section className="border border-primary/50 p-2 mb-2 rounded-lg bg-background">
          <h4 className="text-base text-primary font-normal">
            {text.module.attachmentsListTitle}
          </h4>
          <ul>
            {items.map((item, idx) => (
              <li
                key={`${labelId}_item_${idx}`}
                className={cn(
                  "w-full px-2 flex gap-2 items-center justify-between",
                  idx % 2 ? "bg-muted/30" : "",
                  "hover:bg-muted",
                )}
              >
                <span>{item.name}</span>
                <Button
                  type="button"
                  variant="ghost-clean"
                  size="icon"
                  onClick={() => handleRemove(idx)}
                >
                  <Trash />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {items.length < contentMaxLength && (
        <>
          <div className="flex flex-col">
            <span className="text-primary font-normal">
              {text.module.attachmentTypes}
            </span>
            <div className="flex flex-wrap gap-4">
              {helpers.map((helper) => (
                <Button
                  key={helper}
                  type="button"
                  size="sm"
                  variant="link"
                  onClick={() =>
                    setHelper((prv) => (prv === helper ? null : helper))
                  }
                  className={cn(
                    " px-0!",
                    helper === currentHelper ? "underline text-accent" : "",
                  )}
                >
                  {helper === currentHelper ? <CircleCheckBig /> : <Circle />}
                  <span className="">{helperInfo[helper].btnLabel}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <LabeledInput
              inputName={`attachment_description`}
              inputType="text"
              inputMaxLength={descriptionMaxLength}
              texts={text.description}
              state={description}
              stateSetter={setDescription}
              validator={handleDescriptionValidation}
              validationErrors={unifiedErrors}
            />

            <div className="flex w-full gap-2">
              {inputType === "text" ? (
                <LabeledInput
                  inputName={`attachment_${inputType}`}
                  inputType="text"
                  inputMaxLength={descriptionMaxLength}
                  texts={text.resource}
                  state={content as string}
                  stateSetter={setContent}
                  validator={handleLinkValiadtion}
                  validationErrors={contentErrors}
                  disabled={!helpers.includes(currentHelper ?? "")}
                  autoComplete="off"
                />
              ) : (
                <div className="flex flex-col w-full">
                  <span className="text-primary font-normal">
                    Cargar archivo
                  </span>
                  <ErrorsList errorItems={contentErrors} />
                  <label
                    htmlFor={labelId}
                    className="flex items-center justify-between px-3 h-9 text-sm border rounded-md cursor-pointer border-input bg-background aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none"
                    aria-disabled={!helpers.includes(currentHelper ?? "")}
                  >
                    <span className="truncate text-muted-foreground">
                      {content instanceof File
                        ? content.name
                        : "Seleccionar archivo..."}
                    </span>
                    <span className="ml-2 text-xs text-primary">Buscar</span>
                  </label>

                  <input
                    id={labelId}
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileAdd}
                    accept={accept}
                  />
                </div>
              )}

              <Button
                onClick={() => {
                  setHelper(null);
                  handleAdd();
                }}
                type="button"
                variant="outline"
                size="icon"
                title="Agregar"
                disabled={isLoading || !description || !content}
                className="self-end"
              >
                <span className="sr-only">Adjuntar elemento</span>
                <CirclePlus aria-hidden="true" className="size-5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </fieldset>
  );
}
