import type {
  MonitoringResource,
  ODataTag,
  ResourceAttachment,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import { Button } from "@ui/shadCN/component/button";
import {
  type Dispatch,
  type InputHTMLAttributes,
  type SetStateAction,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import {
  RESOURCE_DESCRIPTION_MAX_LENGTH,
  RESOURCE_NAME_MAX_LENGTH,
} from "@config/monitoring";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@ui/shadCN/lib/utils";
import type { TagData } from "pages/monitoring/types/initiative";

type MonirotingResourceForm = {
  initiativeId: number | null;
  name: string;
  description: string;
  isDraft: boolean;
  files: Partial<ResourceAttachment & { file: File }>[];
  links: Partial<ResourceAttachment>[];
  tags: Record<number, (Omit<ODataTag, "categoryName"> | TagData)[]>;
};

function setInitialInformation(
  resource: MonitoringResource | null,
): MonirotingResourceForm {
  return {
    initiativeId: resource?.initiativeId || null,
    name: resource?.name || "",
    description: resource?.description || "",
    isDraft: resource?.isDraft || false,
    files: resource?.files && resource.files.length > 0 ? resource.files : [],
    links: resource?.links && resource.links.length > 0 ? resource.links : [],
    tags:
      resource?.tags && resource.tags.length > 0
        ? resource.tags.reduce<
            Record<number, Omit<ODataTag, "categoryName">[]>
          >((all, tag) => {
            const tagCategoryId = tag.tag.category.id;
            if (!all[tagCategoryId]) {
              all[tagCategoryId] = [];
            }
            all[tagCategoryId].push(tag.tag);
            return all;
          }, {})
        : {},
  };
}

export function ResourceForm({
  resource,
  currentSection,
  setHelper,
}: {
  resource: MonitoringResource | null;
  currentSection: ResourceType;
  setHelper: Dispatch<SetStateAction<string | null>>;
}) {
  const { userInitiativesById } = useUserInMonitoringCTX();
  const resourceInfo = useRef(setInitialInformation(resource));
  const resourceInfoRef = useRef(setInitialInformation(resource));
  const [errors, setErrors] = useState<{
    [K in keyof MonirotingResourceForm]?: string[];
  }>({});

  const updater =
    <K extends keyof MonirotingResourceForm>(item: K) =>
    (value: MonirotingResourceForm[K]) => {
      const oldInfo = { ...resourceInfo.current };
      resourceInfo.current = { ...oldInfo, [item]: value };
    };

  const handleTagsChange =
    (categoryId: number) =>
    (newTags: (Omit<ODataTag, "categoryName"> | TagData)[]) => {
      const oldInfo = { ...resourceInfo.current };
      resourceInfo.current = {
        ...oldInfo,
        tags: {
          ...oldInfo.tags,
          [categoryId]: newTags,
        },
      };
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Cuando solo hay una iniciativa, asignar el valor al obj de post

    await new Promise((resolve) =>
      setTimeout(() => {
        console.warn("grabó mi prro");
        resolve(true);
      }, 500),
    );
  };

  const handleReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resourceInfo.current = resourceInfoRef.current;
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      onReset={handleReset}
      className="flex flex-col gap-4"
    >
      <div>
        <LabelAndErrors
          htmlFor="name"
          errID="errors_name"
          validationErrors={errors.name ?? []}
        >
          <span>Nombre del recurso</span>
        </LabelAndErrors>

        <InputGroup>
          <InputGroupInput
            name="name"
            id="name"
            onChange={(e) => updater("name")(e.target.value)}
            value={resourceInfo.current.name}
            maxLength={RESOURCE_NAME_MAX_LENGTH}
            aria-describedby={
              errors.name && errors.name.length > 0 ? "errors_name" : undefined
            }
          />

          <InputGroupAddon
            align="inline-end"
            className={inputWarnColor(
              resourceInfo.current.name,
              RESOURCE_NAME_MAX_LENGTH,
            )}
          >
            {inputLengthCount(
              resourceInfo.current.name,
              RESOURCE_NAME_MAX_LENGTH,
            )}
          </InputGroupAddon>
        </InputGroup>
      </div>

      {Object.keys(userInitiativesById).length > 1 ? (
        <>
          <LabelAndErrors
            htmlFor="initiativeId"
            errID="errors_initiativeId"
            validationErrors={errors.initiativeId ?? []}
          >
            <span>Iniciativa a la que pertenece</span>
          </LabelAndErrors>
          <NativeSelect
            name="initiativeId"
            id="initiativeId"
            className="bg-background"
            onChange={(e) => updater("initiativeId")(Number(e.target.value))}
          >
            {Object.entries(userInitiativesById).map(([id, initiative]) => (
              <NativeSelectOption value={id}>
                {initiative.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </>
      ) : (
        <p className="my-0">
          El recurso pertenece a la iniciativa{" "}
          <strong>{Object.values(userInitiativesById)[0].name}</strong>
        </p>
      )}

      {resourceTagCategories.map((tagGroup) => {
        const tagCategoryId = tagGroup.tagCategoryId;
        return (
          <ResourceTagSelector
            key={`tagCategory_${tagCategoryId}`}
            managerTitle={tagGroup.title}
            tagCategoryId={tagCategoryId}
            selectedTags={resourceInfo.current.tags[tagCategoryId] ?? []}
            onTagsChange={handleTagsChange(tagCategoryId)}
            maxTagsAmount={tagGroup.maxTagsAmount}
            texts={tagGroup.uiText}
          />
        );
      })}

      <div>
        <LabelAndErrors
          htmlFor="description"
          errID="errors_description"
          validationErrors={errors.description ?? []}
        >
          <span>Descripción del recurso</span>
        </LabelAndErrors>
        <InputGroup>
          <TextareaAutosize
            data-slot="input-group-control"
            className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
            name="description"
            id="description"
            onChange={(e) => updater("description")(e.target.value)}
            value={resourceInfo.current.description}
            maxLength={RESOURCE_DESCRIPTION_MAX_LENGTH}
            aria-describedby={
              errors.name && errors.name.length > 0 ? "errors_name" : undefined
            }
          />

          <InputGroupAddon
            align="block-end"
            className={cn(
              inputWarnColor(
                resourceInfo.current.description,
                RESOURCE_DESCRIPTION_MAX_LENGTH,
                0.95,
              ),
              "flex-row-reverse",
            )}
          >
            {resourceInfo.current.description.length} /{" "}
            {RESOURCE_DESCRIPTION_MAX_LENGTH}
          </InputGroupAddon>
        </InputGroup>
      </div>

      <AttachmentInput
        labelId="links"
        inputType="text"
        items={resourceInfo.current.links}
        validationErrors={errors.links ?? []}
        updater={updater("links")}
        helpers={["asd", "def", "gih"]}
        setHelper={setHelper}
        descriptionMaxLength={100}
        contentMaxLength={100}
      />

      <div className="flex flex-row-reverse justify-between">
        <Button>guardar</Button>
        <Button type="reset" variant="outline_destructive">
          reset
        </Button>
      </div>
    </form>
  );
}

function AttachmentInput<K extends keyof MonirotingResourceForm>({
  labelId,
  inputType,
  items,
  validationErrors,
  updater,
  helpers,
  setHelper,
  descriptionMaxLength,
  contentMaxLength,
}: {
  labelId: K;
  inputType: "text" | "file";
  items: MonirotingResourceForm[K];
  validationErrors: string[];
  updater: (value: MonirotingResourceForm[K]) => void;
  helpers: string[];
  setHelper: Dispatch<SetStateAction<string | null>>;
  descriptionMaxLength: number;
  contentMaxLength: number;
}) {
  const [errors, setErrors] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string | File | null>(
    inputType === "text" ? "" : null,
  );

  const inputUiText = {
    description: {
      sr: "Descripción del adjunto",
      label: "Descripción",
      placeholder: "Ej: Manual de usuario",
    },
    content: {
      label: inputType === "text" ? "Enlace (URL)" : "Archivo",
      placeholder: inputType === "text" ? "https://..." : "Seleccionar archivo",
    },
  };

  const handleAdd = () => {
    if (!description || !content) {
      setErrors(["La descripción y el contenido son obligatorios."]);
      return;
    }

    const newItem = {
      description,
      content,
    } as unknown as MonirotingResourceForm[K];

    updater([...items, newItem]);

    setDescription("");
    setContent(null);
    setErrors([]);

    // ref
    if (inputType === "file") {
      const fileInput = document.getElementById(labelId) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };
  const unifiedErrors = [...validationErrors, ...errors];

  return (
    <div>
      <LabelAndErrors
        htmlFor={labelId}
        errID={`errors_${labelId}`}
        validationErrors={unifiedErrors}
        className="w-full flex flex-wrap gap-2 justify-between"
      >
        <span>{inputUiText.description.label}</span>
        <span className="sr-only">{inputUiText.description.sr}</span>
        <span className="inline-flex gap-2">
          {helpers.map((helper) => (
            <Button
              type="button"
              variant="link"
              key={`helper_${helper}`}
              onClick={() =>
                setHelper((oldHelper) => (oldHelper === helper ? null : helper))
              }
            >
              {helper}
            </Button>
          ))}
        </span>
      </LabelAndErrors>

      <InputGroup>
        <InputGroupInput
          name={`description_${labelId}`}
          type="text"
          id={`description_${labelId}`}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          maxLength={descriptionMaxLength}
          placeholder={inputUiText.description.placeholder}
        />

        <InputGroupAddon
          align="inline-end"
          className={inputWarnColor(description, descriptionMaxLength)}
        >
          {inputLengthCount(description, descriptionMaxLength)}
        </InputGroupAddon>
      </InputGroup>

      <div className="flex-1">
        <label className="block text-sm font-medium mb-1" htmlFor={labelId}>
          {inputUiText.content.label}
        </label>

        {inputType === "text" ? (
          <InputGroup>
            <InputGroupInput
              id={labelId}
              type="text"
              placeholder={inputUiText.content.placeholder}
              value={(content as string) || ""}
              onChange={(e) => setContent(e.target.value)}
              aria-describedby={
                unifiedErrors.length > 0 ? `errors_${labelId}` : undefined
              }
            />

            <InputGroupAddon
              align="inline-end"
              className={inputWarnColor(content as string, contentMaxLength)}
            >
              {inputLengthCount(content as string, contentMaxLength)}
            </InputGroupAddon>
          </InputGroup>
        ) : (
          <input
            id={labelId}
            type="file"
            className="block w-full text-sm border rounded-lg cursor-pointer bg-background"
            onChange={(e) => setContent(e.target.files?.[0] || null)}
          />
        )}
      </div>

      <Button
        type="button"
        onClick={handleAdd}
        disabled={!description || !content}
      >
        Agregar
      </Button>
    </div>
  );
}
