import { Button } from "@ui/shadCN/component/button";
import { useState } from "react";
import type { ResourceAttachment } from "pages/monitoring/types/odataResponse";
import { PlusIcon, Trash } from "lucide-react";
import { LabeledInput } from "@ui/LabeledInput";

export function AttachmentInput({
  labelId,
  inputType,
  items,
  validationErrors,
  updater,
  descriptionMaxLength,
  contentMaxLength,
  text,
}: {
  labelId: "files" | "links";
  inputType: "text" | "file";
  items: Partial<ResourceAttachment>[];
  validationErrors: string[];
  updater: (value: Partial<ResourceAttachment & { file: File }>[]) => void;
  descriptionMaxLength: number;
  text: {
    description: { label: string; sr?: string; placeholder: string };
    resource: { label: string; sr?: string; placeholder: string };
  };
  contentMaxLength: number;
}) {
  const [errors, setErrors] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<string | File | null>(
    inputType === "text" ? "" : null,
  );

  const handleAdd = () => {
    if (!description || !content) {
      setErrors(["La descripción y el contenido son obligatorios."]);
      return;
    }

    const newItem =
      inputType === "text"
        ? { name: description, url: content as string }
        : { name: description, file: content as File, url: "" };

    updater([...items, newItem]);

    setDescription("");
    setContent(inputType === "text" ? "" : null);
    setErrors([]);

    if (inputType === "file") {
      const fileInput = document.getElementById(labelId) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const removeIndex = (index: number) => {
    updater(items.filter((_, i) => i !== index));
  };

  const unifiedErrors = [...validationErrors, ...errors];

  return (
    <div>
      {items.length > 0 && (
        <ul>
          {items.map((item, idx) => (
            <li key={`${labelId}_item_${idx}`}>
              <span>{item.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIndex(idx)}
              >
                <Trash />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {items.length < contentMaxLength && (
        <div className="flex gap-1">
          <LabeledInput
            inputName={`attachment_description`}
            inputType="text"
            inputMaxLength={descriptionMaxLength}
            texts={text.description}
            state={description}
            stateSetter={setDescription}
            validationErrors={unifiedErrors}
          />

          {inputType === "text" ? (
            <LabeledInput
              inputName={`attachment_${inputType}`}
              inputType="text"
              inputMaxLength={descriptionMaxLength}
              texts={text.resource}
              state={content as string}
              stateSetter={setContent}
              validationErrors={[]}
            />
          ) : (
            <input
              id={labelId}
              type="file"
              onChange={(e) => setContent(e.target.files?.[0] || null)}
            />
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={!description || !content}
            className="self-end"
          >
            <PlusIcon /> Agregar
          </Button>
        </div>
      )}
    </div>
  );
}
