import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Circle,
  CircleCheckBig,
  CirclePlus,
  ExternalLink,
  Pencil,
  Trash,
  XIcon,
} from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { LabeledInput } from "@ui/LabeledInput";
import { cn } from "@ui/shadCN/lib/utils";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { StrValidator } from "@utils/strValidator";
import { RESOURCE_FILE_MAX_SIZE } from "@config/monitoring";

import type { ResourceAttachment } from "pages/monitoring/types/odataResponse";
import { helperInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/helperInfo";
import { urlIsActive } from "pages/monitoring/outlets/resources/manager/resourcesEditor/utils/validations";
import { uiText } from "./layout/uiText";

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
  const editingItemRef = useRef<Partial<
    ResourceAttachment & { file: File }
  > | null>(null);

  const handleEdit = (index: number) => {
    const item = items[index];
    editingItemRef.current = item;
    updater(items.filter((_, i) => i !== index));
    setDescription(item.name || "");
    setContent(inputType === "text" ? item.url || "" : null);
  };

  const handleCancelEdit = () => {
    if (editingItemRef.current) {
      updater([...items, editingItemRef.current]);

      editingItemRef.current = null;
      setDescription("");
      setContent(inputType === "text" ? "" : null);
      setDescriptionErrors([]);
    }
  };

  const handleAdd = () => {
    setDescriptionErrors([]);

    const newItemBase =
      inputType === "text"
        ? { name: description, url: content as string }
        : { name: description, file: content as File, url: "" };

    const finalItem = editingItemRef.current
      ? { ...editingItemRef.current, ...newItemBase }
      : newItemBase;

    updater([...items, finalItem]);

    editingItemRef.current = null;
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
      setContentErrors([uiText.validations.fileSize(RESOURCE_FILE_MAX_SIZE)]);
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
        .customAsync(urlIsActive, uiText.validations.checkUrl)
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
          <h4 className="sr-only">{text.module.attachmentsListTitle}</h4>
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
                <span className="truncate">{item.name}</span>
                <div className="flex">
                  {item.url && (
                    <Button
                      type="button"
                      variant="ghost-clean"
                      size="icon"
                      title={uiText.attachments.ui.view.title}
                      asChild
                    >
                      <a href={item.url} target="_blank">
                        {uiText.attachments.ui.view.label}
                        <span className="sr-only">
                          {uiText.attachments.ui.view.sr}
                        </span>
                        <ExternalLink className="size-4" aria-hidden="true" />
                      </a>
                    </Button>
                  )}
                  {inputType === "text" && (
                    <Button
                      type="button"
                      variant="ghost-clean"
                      size="icon"
                      onClick={() => handleEdit(idx)}
                      title={uiText.attachments.ui.edit.title}
                    >
                      {uiText.attachments.ui.edit.label}
                      <span className="sr-only">
                        {uiText.attachments.ui.edit.sr}
                      </span>
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost-clean"
                    size="icon"
                    onClick={() => handleRemove(idx)}
                    title={uiText.attachments.ui.del.title}
                  >
                    {uiText.attachments.ui.del.label}
                    <span className="sr-only">
                      {uiText.attachments.ui.del.sr}
                    </span>
                    <Trash className="size-4" aria-hidden="true" />
                  </Button>
                </div>
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
                  <span>{helperInfo[helper].btnLabel}</span>
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
              autoComplete="off"
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
                    {uiText.attachments.ui.fileUpload.label}
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
                        : uiText.attachments.ui.fileUpload.placeholder}
                    </span>
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

              <div className="flex gap-2 self-end">
                {editingItemRef.current && (
                  <Button
                    onClick={handleCancelEdit}
                    type="button"
                    variant="outline_destructive"
                    size="icon"
                    title={uiText.attachments.ui.cancel.title}
                  >
                    {uiText.attachments.ui.cancel.label}
                    <span className="sr-only">
                      {uiText.attachments.ui.cancel.sr}
                    </span>
                    <XIcon className="size-5" />
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setHelper(null);
                    handleAdd();
                  }}
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={isLoading || !description || !content}
                  title={uiText.attachments.ui.save.title(
                    editingItemRef.current !== null,
                  )}
                >
                  {uiText.attachments.ui.save.label(
                    editingItemRef.current !== null,
                  )}
                  <span className="sr-only">
                    {uiText.attachments.ui.save.sr(
                      editingItemRef.current !== null,
                    )}
                  </span>
                  <CirclePlus className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </fieldset>
  );
}
