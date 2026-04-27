import type {
  MonitoringResource,
  ODataTag,
  ResourceAttachment,
  ResourceTag,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import { Button } from "@ui/shadCN/component/button";
import {
  Dispatch,
  SetStateAction,
  useEffect,
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
  RESOURCES_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS,
} from "@config/monitoring";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@ui/shadCN/lib/utils";
import type { TagData } from "pages/monitoring/types/initiative";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { getResource } from "pages/monitoring/api/services/monitoringResources";
import { LabeledInput } from "@ui/LabeledInput";
import { resourceTagCategories } from "./layout/tagCategories";
import { StableTagSelector } from "pages/monitoring/ui/TagSelector";
import { TagCategory } from "pages/monitoring/types/tagData";
import { LabeledTextArea } from "@ui/LabeledTextArea";
import { AttachmentInput } from "./ResourceAttachment";

export type MonirotingResourceForm = {
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
    name: resource?.name || "carai",
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
  resourceId,
  onSubmitSuccess,
}: {
  resourceId: number | null;
  onSubmitSuccess: () => void;
}) {
  const [resource, setResource] = useState<MonirotingResourceForm | null>(null);
  const resourceRef = useRef<MonirotingResourceForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MonirotingResourceForm | "root", string[]>>
  >({});

  const { userInitiativesById } = useUserInMonitoringCTX();

  useEffect(() => {
    if (resourceId === null) {
      const startingResource = setInitialInformation(null);
      setResource(startingResource);
      resourceRef.current = startingResource;
      return;
    }
    const fetchResource = async () => {
      const res = await getResource(resourceId);
      if (isMonitoringAPIError(res)) {
        setIsLoading(false);
        setErrors((oldErr) => ({
          ...oldErr,
          root: res.data.map((err) => err.msg),
        }));
        return;
      }

      setIsLoading(false);
      setResource(setInitialInformation(res));
      resourceRef.current = setInitialInformation(res);
    };

    void fetchResource();
  }, [resourceId]);

  const handleReset = () => {
    setResource(resourceRef.current);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("777", resource);
        setResource(null);
        onSubmitSuccess();
        resolve(true);
      }, 0);
    });
  };

  const updateValue =
    <K extends keyof MonirotingResourceForm>(key: K) =>
    (value: MonirotingResourceForm[K]) =>
      setResource((oldInfo) => ({ ...oldInfo!, [key]: value }));

  const updateTags =
    (tagCategoryId: number) => (value: (TagCategory | TagData)[]) =>
      setResource((oldInfo) => ({
        ...oldInfo,
        tags: { ...oldInfo?.tags, [tagCategoryId]: value },
      }));

  return !resource ? null : (
    <form
      className="p-4 space-y-4"
      onSubmit={(e) => void handleSubmit(e)}
      onReset={() => handleReset()}
    >
      {resource.name}
      <LabeledInput
        inputName="name"
        inputType="text"
        inputMaxLength={RESOURCE_NAME_MAX_LENGTH}
        required={true}
        texts={{
          label: "Nombre del recurso",
          placeholder: "Cómo medir el tronco de la palma",
        }}
        state={resource.name}
        stateSetter={updateValue("name")}
        validationErrors={errors.name ?? []}
      />

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
              updateValue("initiativeId")(Number(e.target.value))
            }
          >
            {Object.entries(userInitiativesById).map(([id, initiative]) => (
              <NativeSelectOption
                key={`resourceForinitiative_${id}`}
                value={id}
              >
                {initiative.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </>
      ) : (
        <p className="my-0">
          El recurso pertenece a la iniciativa{" "}
          <strong>{Object.values(userInitiativesById)[0]?.name ?? ""}</strong>
        </p>
      )}

      {resourceTagCategories.length > 0 &&
        resourceTagCategories.map((category) => (
          <StableTagSelector<ResourceTag>
            key={`resource_tagSelector${category.tagCategoryId}`}
            managerTitle={category.title}
            selectedTags={resource.tags[category.tagCategoryId]}
            tagCategoryId={category.tagCategoryId}
            fixedSearchParams={RESOURCES_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS}
            onTagsChange={updateTags(category.tagCategoryId)}
            maxTagsAmount={category.maxTagsAmount}
            texts={category.uiText}
            relatedId={resourceId}
            parentRelationKey="resourceTagId"
          />
        ))}

      <LabeledTextArea
        inputName="description"
        inputMaxLength={RESOURCE_DESCRIPTION_MAX_LENGTH}
        required={true}
        texts={{ label: "Descripción", placeholder: "Descricion del recurso" }}
        state={resource.description}
        stateSetter={updateValue("description")}
        validationErrors={errors.description ?? []}
      />

      <AttachmentInput
        labelId="links"
        inputType="text"
        items={resource.links}
        updater={updateValue("links")}
        validationErrors={errors.links ?? []}
        descriptionMaxLength={100}
        contentMaxLength={10}
        text={{
          description: { label: "Descripcion", placeholder: "palo palo palo" },
          resource: { label: "Enlace", placeholder: "https:///////" },
        }}
      />

      <AttachmentInput
        labelId="files"
        inputType="file"
        items={resource.files}
        updater={updateValue("files")}
        validationErrors={errors.links ?? []}
        descriptionMaxLength={100}
        contentMaxLength={10}
        text={{
          description: { label: "Descripcion", placeholder: "palo palo palo" },
          resource: { label: "archivo", placeholder: "https:///////" },
        }}
      />

      <div>
        <Button>guardar</Button>
        <Button type="reset">reset</Button>
      </div>
    </form>
  );
}
