import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Circle, CircleCheckBig, NotebookPen } from "lucide-react";
import { toast } from "sonner";

import { LabeledTextArea } from "@ui/LabeledTextArea";
import { Switch } from "@ui/shadCN/component/switch";
import { ConfirmationDialog } from "@ui/ConfirmationDialog";
import { Button } from "@ui/shadCN/component/button";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { parseSimpleMarkdown } from "@utils/textParser";
import { LabeledInput } from "@ui/LabeledInput";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import {
  RESOURCE_DESCRIPTION_MAX_LENGTH,
  RESOURCE_MAX_FILES_AMOUNT,
  RESOURCE_MAX_LINKS_AMOUNT,
  RESOURCE_NAME_MAX_LENGTH,
  RESOURCES_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS,
} from "@config/monitoring";

import type {
  MonitoringResource,
  ODataTag,
  ResourceAttachment,
  ResourceTag,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import { resourceTagCategories } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/tagCategories";
import { StableTagSelector } from "pages/monitoring/ui/TagSelector";
import { AttachmentInput } from "pages/monitoring/outlets/resources/manager/resourcesEditor/ResourceAttachment";
import { helperInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/helperInfo";
import type { TagData } from "pages/monitoring/types/initiative";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { getResource } from "pages/monitoring/api/services/monitoringResources";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { tosTexts } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/tos";
import { ResourceInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/ResourceInfo";
import { StrValidator } from "@utils/strValidator";
import { validationExemption } from "pages/monitoring/ui/initiativesAdmin/utils/fieldClientValidations";
import { resourceNameNotExist } from "./utils/validations";

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
  resourceType,
  onSubmitSuccess,
}: {
  resourceId: number | null;
  resourceType: ResourceType;
  onSubmitSuccess: () => void;
}) {
  const [resource, setResource] = useState<MonirotingResourceForm | null>(null);
  const resourceRef = useRef<MonirotingResourceForm | null>(null);
  const [helper, setHelper] = useState<string | null>(null);
  const [tos, setTOS] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MonirotingResourceForm | "root", string[]>>
  >({});

  const navigate = useNavigate();

  const { userInitiativesById } = useUserInMonitoringCTX();

  const updateValue =
    <K extends keyof MonirotingResourceForm>(key: K) =>
    (value: MonirotingResourceForm[K]) =>
      setResource((oldInfo) => ({ ...oldInfo!, [key]: value }));

  const updateTags =
    (tagCategoryId: number) => (value: (ResourceTag | TagData)[]) =>
      setResource((oldInfo) => ({
        ...oldInfo,
        tags: { ...oldInfo?.tags, [tagCategoryId]: value },
      }));

  useEffect(() => {
    if (resourceId === null) {
      const startingResource = setInitialInformation(null);
      setResource(startingResource);
      resourceRef.current = startingResource;
      setIsLoading(false);
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

  const validateName = async () => {
    if (!resource || !resourceRef.current) {
      return;
    }
    setErrors(({ name: _, ...oldErors }) => oldErors);

    const [cleanName, nameErrors] = (
      await new StrValidator(resource.name)
        .sanitize()
        .isRequired()
        .hasLengthLessOrEqualThan(RESOURCE_NAME_MAX_LENGTH)
        .customAsync(
          validationExemption(
            resourceNameNotExist,
            resource.name === resourceRef.current.name,
          ),
          "Ya existe un recurso con ese nombre",
        )
    ).result;

    if (nameErrors.length > 0) {
      setErrors((oldErr) => ({ ...oldErr, name: nameErrors }));
      return;
    }

    updateValue("name")(cleanName);
  };

  const validateDescription = () => {
    if (!resource || !resourceRef.current) {
      return;
    }
    setErrors(({ description: _, ...oldErors }) => oldErors);

    const [cleanDescription, descriptionErrors] = new StrValidator(
      resource.description,
    )
      .sanitize()
      .isRequired()
      .hasLengthLessOrEqualThan(RESOURCE_DESCRIPTION_MAX_LENGTH).result;

    if (descriptionErrors.length > 0) {
      setErrors((oldErr) => ({ ...oldErr, description: descriptionErrors }));
      return;
    }

    updateValue("description")(cleanDescription);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resource) {
      return;
    }

    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("777", resource);
        // setResource(null);
        onSubmitSuccess();
        resolve(true);
      }, 0);
    });

    toast("Recurso guardado", {
      position: "bottom-right",
      description: `El recurso de monitoreo '${resource.name}' fue creado exitosamente`,
      icon: <NotebookPen className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary! md:w-[450px]! ",
      duration: 3 * 1000,
      dismissible: true,

      ...(!resource.isDraft
        ? {
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  void navigate(`/Monitoreo/Recursos/${resourceId ?? 666}`)
                }
              >
                Ver recurso
              </Button>
            ),
          }
        : {}),
    });
  };

  const helperKeys = useMemo(
    () =>
      Object.entries(helperInfo).reduce<{
        files: string[];
        links: string[];
      }>(
        (all, [key, value]) => {
          all[value.type].push(key);
          return all;
        },
        { files: [], links: [] },
      ),
    [],
  );

  return !resource ? null : (
    <div className="p-4 flex gap-12 *:flex-1">
      <ResourceInfo currentHelper={helper} resourceType={resourceType} />
      <form
        className="space-y-4 [&_label]:text-primary [&_label]:font-normal"
        onSubmit={(e) => void handleSubmit(e)}
        onReset={() => handleReset()}
      >
        <h3 className="text-primary">
          {resourceId ? "Actualizar recurso" : "Crear recurso"}
        </h3>
        <LabeledInput
          inputName="name"
          inputType="text"
          inputMaxLength={RESOURCE_NAME_MAX_LENGTH}
          required={true}
          texts={{
            label: "Nombre del recurso",
            placeholder: "Cómo medir el tronco de la palma",
          }}
          validator={validateName}
          state={resource.name}
          stateSetter={updateValue("name")}
          validationErrors={errors.name ?? []}
        />

        {Object.keys(userInitiativesById).length > 1 ? (
          <div>
            <LabelAndErrors
              htmlFor="initiativeId"
              errID="errors_initiativeId"
              validationErrors={errors.initiativeId ?? []}
            >
              <span>Recurso bajo la iniciativa:</span>
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
          </div>
        ) : (
          <p className="">
            Recurso bajo la iniciativa{" "}
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
          texts={{
            label: "Descripción",
            placeholder: "Descricion del recurso",
          }}
          validator={validateDescription}
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
          contentMaxLength={RESOURCE_MAX_LINKS_AMOUNT}
          text={{
            module: {
              title: "Adjuntar enlaces al recurso",
              attachmentsListTitle: "Enlaces adjuntos",
              attachmentTypes: "¿El enlace hacia qué tipo de recurso apunta?",
            },
            description: {
              label: "Descripción del enlace",
              placeholder: "Los modelos de distribución...",
            },
            resource: { label: "Enlace", placeholder: "https://ejemplo.com" },
          }}
          currentHelper={helper}
          helpers={helperKeys.links}
          setHelper={setHelper}
        />

        <AttachmentInput
          labelId="files"
          inputType="file"
          items={resource.files}
          updater={updateValue("files")}
          validationErrors={errors.links ?? []}
          descriptionMaxLength={100}
          contentMaxLength={RESOURCE_MAX_FILES_AMOUNT}
          text={{
            module: {
              title: "Adjuntar archivos al recurso",
              attachmentsListTitle: "Archivos adjuntos",
              attachmentTypes: "¿Qué formato de archivo deseas adjuntar?",
            },
            description: {
              label: "Descripcion",
              placeholder: "palo palo palo",
            },
            resource: { label: "archivo", placeholder: "https:///////" },
          }}
          currentHelper={helper}
          helpers={helperKeys.files}
          setHelper={setHelper}
        />

        <div className="flex gap-2 items-center">
          <LabelAndErrors
            validationErrors={errors.isDraft ?? []}
            errID="errors_isDraft"
            htmlFor="isDraft"
          >
            ¿Publicar el recurso?
          </LabelAndErrors>
          <Switch
            name="isDraft"
            id="isDraft"
            checked={!resource.isDraft}
            onCheckedChange={() => {
              setResource((oldInfo) => ({
                ...oldInfo!,
                isDraft: !oldInfo!["isDraft"],
              }));
            }}
            aria-describedby={
              errors?.isDraft && errors.isDraft.length > 0
                ? "errors_isDraft"
                : undefined
            }
          />
          {resource.isDraft ? "No, aún es borrador" : "Si, es público"}
        </div>

        <div className="flex gap-2">
          <ConfirmationDialog
            triggerBtnVariant="outline"
            className="w-full"
            texts={{
              trigger: {
                label: `${tos ? "Leer" : "Aceptar"} términos para la carga de información`,
                icon: tos ? CircleCheckBig : Circle,
              },
              dialog: {
                title: tosTexts.title,
                description: tosTexts.description,
                longMarkdown: tosTexts.tos,
              },
              actionBtns: {
                confirm: tos ? "Rechazo" : "Acepto",
                cancel: "cancelar",
              },
            }}
            handler={() => setTOS(!tos)}
          />
        </div>

        <div className="flex flex-row-reverse justify-between gap-2">
          <Button disabled={!tos || isLoading}>
            {resource.isDraft ? "Guardar" : "Publicar"}
          </Button>
          <Button type="reset" variant="outline_destructive">
            Deshacer cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
