import type {
  MonitoringResource,
  ODataTag,
  ResourceAttachment,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import { Button } from "@ui/shadCN/component/button";
import { useRef, useState, type FormEvent } from "react";
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
import { ResourceTagSelector } from "pages/monitoring/outlets/resources/manager/ResourceTagSelector";
import { resourceTagCategories } from "pages/monitoring/outlets/resources/manager/layout/tagCategories";

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
}: {
  resource: MonitoringResource | null;
  currentSection: ResourceType;
}) {
  const { userInitiativesById } = useUserInMonitoringCTX();
  const [resourceInfo, setResourceInfo] = useState(
    setInitialInformation(resource),
  );
  const resourceInfoRef = useRef(setInitialInformation(resource));
  const [errors, setErrors] = useState<{
    [K in keyof MonirotingResourceForm]?: string[];
  }>({});

  const updater =
    <K extends keyof MonirotingResourceForm>(item: K) =>
    (value: MonirotingResourceForm[K]) => {
      setResourceInfo((oldData) => ({ ...oldData, [item]: value }));
    };

  const handleTagsChange =
    (categoryId: number) =>
    (newTags: (Omit<ODataTag, "categoryName"> | TagData)[]) => {
      setResourceInfo((oldData) => ({
        ...oldData,
        tags: {
          ...oldData.tags,
          [categoryId]: newTags, // Actualiza solo esta categoría
        },
      }));
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
    setResourceInfo(resourceInfoRef.current);
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} onReset={handleReset}>
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
          value={resourceInfo.name}
          maxLength={RESOURCE_NAME_MAX_LENGTH}
          aria-describedby={
            errors.name && errors.name.length > 0 ? "errors_name" : undefined
          }
        />

        <InputGroupAddon
          align="inline-end"
          className={inputWarnColor(
            resourceInfo.name,
            RESOURCE_NAME_MAX_LENGTH,
          )}
        >
          {inputLengthCount(resourceInfo.name, RESOURCE_NAME_MAX_LENGTH)}
        </InputGroupAddon>
      </InputGroup>

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
            onChange={(e) =>
              setResourceInfo((oldData) => ({
                ...oldData,
                initiativeId: Number(e.target.value),
              }))
            }
          >
            {Object.entries(userInitiativesById).map(([id, initiative]) => (
              <NativeSelectOption value={id}>
                {initiative.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </>
      ) : (
        <p>
          El recurso pertenece a la iniciativa{" "}
          <strong>{Object.values(userInitiativesById)[0].name}</strong>
        </p>
      )}

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
          value={resourceInfo.description}
          maxLength={RESOURCE_DESCRIPTION_MAX_LENGTH}
          aria-describedby={
            errors.name && errors.name.length > 0 ? "errors_name" : undefined
          }
        />

        <InputGroupAddon
          align="block-end"
          className={cn(
            inputWarnColor(
              resourceInfo.description,
              RESOURCE_DESCRIPTION_MAX_LENGTH,
              0.95,
            ),
            "flex-row-reverse",
          )}
        >
          {resourceInfo.description.length} / {RESOURCE_DESCRIPTION_MAX_LENGTH}
        </InputGroupAddon>
      </InputGroup>

      {resourceTagCategories.map((tagGroup) => {
        const tagCategoryId = tagGroup.tagCategoryId;
        return (
          <ResourceTagSelector
            key={`tagCategory_${tagCategoryId}`}
            managerTitle={tagGroup.title}
            tagCategoryId={tagCategoryId}
            selectedTags={resourceInfo.tags[tagCategoryId] ?? []}
            onTagsChange={handleTagsChange(tagCategoryId)}
            maxTagsAmount={tagGroup.maxTagsAmount}
            texts={tagGroup.uiText}
          />
        );
      })}

      <Button>guardar</Button>
      <Button type="reset">reset</Button>
    </form>
  );
}
