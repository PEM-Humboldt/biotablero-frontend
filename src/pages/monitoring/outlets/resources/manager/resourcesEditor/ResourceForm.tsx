import { useEffect, useRef, useState, type FormEvent } from "react";
import { Circle, CircleCheckBig, NotebookPen } from "lucide-react";
import { toast } from "sonner";

import { LabeledTextArea } from "@ui/LabeledTextArea";
import { Switch } from "@ui/shadCN/component/switch";
import { ConfirmationDialog } from "@ui/ConfirmationDialog";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { ErrorsList, LabelAndErrors } from "@ui/LabelingWithErrors";
import { LabeledInput } from "@ui/LabeledInput";
import { GotoButonInToast } from "@ui/GotoButtonInToast";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import {
  RESOURCE_DESCRIPTION_MAX_LENGTH,
  RESOURCE_NAME_MAX_LENGTH,
  RESOURCES_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS,
} from "@config/monitoring";
import { StrValidator } from "@utils/strValidator";

import { resourceTagCategories } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/tagCategories";
import { AttachmentInput } from "pages/monitoring/outlets/resources/manager/resourcesEditor/ResourceAttachment";
import type { TagData } from "pages/monitoring/types/initiative";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { tosTexts } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/tos";
import { ResourceInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/ResourceInfo";
import { validationExemption } from "pages/monitoring/ui/initiativesAdmin/utils/fieldClientValidations";
import { resourceNameNotExist } from "pages/monitoring/outlets/resources/manager/resourcesEditor/utils/validations";
import type { RequestData } from "pages/monitoring/api/types/definitions";
import { createErrorObjectParser } from "pages/monitoring/utils/errorObjectParser";
import { getAttachmentDiff } from "pages/monitoring/outlets/resources/manager/resourcesEditor/utils/attachmentDiff";
import type { MonirotingResourceForm } from "pages/monitoring/outlets/resources/manager/resourcesEditor/types/resources";
import { setInitialInformation } from "pages/monitoring/outlets/resources/manager/resourcesEditor/utils/initialInformation";
import type {
  ResourceTag,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import {
  isTagRelated,
  StableTagSelector,
} from "pages/monitoring/ui/TagSelector";
import {
  addResourceFile,
  addResourceLink,
  AddResourceTag,
  createResource,
  editResourceLink,
  getResource,
  removeResourceFile,
  removeResourceLink,
  removeResourceTag,
  updateResource,
} from "pages/monitoring/api/services/monitoringResources";
import { uiText } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/uiText";
import { attachmentConfigs } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/attachmentConfigs";

const makeResourceErrorsObject = createErrorObjectParser([
  "initiativeId",
  "authorUserName",
  "name",
  "description",
  "isDraft",
  "likes",
  "iLikedIt",
  "resourceType",
  "creationDate",
  "publicationDate",
  "files",
  "links",
  "tags",
]);

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

  const { userInitiativesById } = useUserInMonitoringCTX();

  const updateValue =
    <K extends keyof MonirotingResourceForm>(key: K) =>
    (value: MonirotingResourceForm[K]) =>
      setResource((oldInfo) => ({ ...oldInfo!, [key]: value }));

  const updateTags =
    (tagCategoryId: number) => (value: (ResourceTag | TagData)[]) =>
      setResource((oldInfo) => {
        return {
          ...oldInfo,
          tags: {
            ...oldInfo?.tags,
            [tagCategoryId]: value,
          },
        } as MonirotingResourceForm;
      });

  useEffect(() => {
    if (!resourceId) {
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
          uiText.validations.repeatedName,
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
    if (!resource || !resourceRef.current) {
      return;
    }

    setErrors({});
    validateDescription();
    await validateName();

    if (Object.keys(errors).length > 0) {
      return;
    }

    const resourceGeneralInfo: RequestData = {
      initiativeId:
        resource.initiativeId ?? Object.keys(userInitiativesById)[0],
      name: resource.name,
      description: resource.description,
      isDraft: resource.isDraft,
      resourceType: { id: resourceType.id },
    };
    const resGeneral = resourceId
      ? await updateResource(resourceId, resourceGeneralInfo)
      : await createResource(resourceGeneralInfo);
    if (isMonitoringAPIError(resGeneral)) {
      setErrors(makeResourceErrorsObject(resGeneral));
      return;
    }

    const originalTags = Object.values(
      resourceRef.current.tags,
    ).flat() as ResourceTag[];
    const currentTags = Object.values(resource.tags).flat();

    const diffTags = {
      add: currentTags.filter((tag) => !isTagRelated(tag)) as TagData[],
      del: originalTags.filter(
        (oldTag) =>
          !currentTags.some((newTag) => {
            const newId = isTagRelated(newTag) ? newTag.tag.id : newTag.id;
            return newId === oldTag.tag.id;
          }),
      ),
    };

    const tagsRemovePromises = diffTags.del.map((tag) =>
      removeResourceTag(tag.resourceTagId),
    );
    const tagsRemoved = await Promise.all(tagsRemovePromises);
    for (const resTag of tagsRemoved) {
      if (isMonitoringAPIError(resTag)) {
        setErrors(makeResourceErrorsObject(resTag));
        break;
      }
    }
    if (Object.keys(errors).length > 0) {
      return;
    }

    const tagsAddPromises = diffTags.add.map((tag) =>
      AddResourceTag(resGeneral.id, tag.id),
    );
    const tagsAdded = await Promise.all(tagsAddPromises);
    for (const resTag of tagsAdded) {
      if (isMonitoringAPIError(resTag)) {
        setErrors(makeResourceErrorsObject(resTag));
        break;
      }
    }

    const diffLinks = getAttachmentDiff(
      resource.links,
      resourceRef.current.links,
      ["name", "url"],
    );
    const delLinkPromises =
      diffLinks.del.length > 0
        ? diffLinks.del.map((link) => removeResourceLink(link.id!))
        : null;
    const addLinkPromises =
      diffLinks.add.length > 0
        ? diffLinks.add.map((link) =>
            addResourceLink({ ...link, resourceId: resGeneral.id }),
          )
        : null;
    const updateLinkPromises =
      diffLinks.edit.length > 0
        ? diffLinks.edit.map((link) => editResourceLink(link.id!, link))
        : null;

    const diffFiles = getAttachmentDiff(
      resource.files,
      resourceRef.current.files,
      ["name"],
    );
    const delFilePromises =
      diffFiles.del.length > 0
        ? diffFiles.del.map((file) => removeResourceFile(file.id!))
        : null;
    const addFilePromises =
      diffFiles.add.length > 0
        ? diffFiles.add.map((file) =>
            addResourceFile(resGeneral.id, file.name!, file.file!),
          )
        : null;

    const resAttachments = await Promise.all([
      ...(delLinkPromises ? delLinkPromises : []),
      ...(addLinkPromises ? addLinkPromises : []),
      ...(updateLinkPromises ? updateLinkPromises : []),
      ...(delFilePromises ? delFilePromises : []),
      ...(addFilePromises ? addFilePromises : []),
    ]);

    for (const attachment of resAttachments) {
      if (isMonitoringAPIError(attachment)) {
        setErrors((oldErrs) => {
          const newErrs = makeResourceErrorsObject(attachment);
          const merged = { ...oldErrs };

          for (const key in newErrs) {
            const errorKey = key as keyof typeof oldErrs;
            merged[errorKey] = [
              ...(merged[errorKey] || []),
              ...(newErrs[errorKey] || []),
            ];
          }

          return merged;
        });
      }
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    toast(uiText.confirmationToast.title(!!resourceId), {
      position: "bottom-right",
      description: uiText.confirmationToast.description(
        !!resourceId,
        resource.name,
      ),
      icon: <NotebookPen className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary! md:w-[450px]! ",
      duration: 3 * 1000,
      dismissible: true,
      action: !resource.isDraft ? (
        <GotoButonInToast
          baseUrl="/Monitoreo/Recursos/"
          urlParams={resourceId ? String(resourceId) : ""}
          label={uiText.confirmationToast.actionButton}
        />
      ) : undefined,
    });
    onSubmitSuccess();
  };

  return !resource ? null : (
    <div className="p-4 flex gap-12 *:flex-1">
      <ResourceInfo currentHelper={helper} resourceType={resourceType} />
      <form
        className="space-y-4 [&_label]:text-primary [&_label]:font-normal"
        onSubmit={(e) => void handleSubmit(e)}
        onReset={() => handleReset()}
      >
        <h3 className="text-primary">{uiText.title(!!resourceId)}</h3>
        <LabeledInput
          inputName="name"
          inputType="text"
          inputMaxLength={RESOURCE_NAME_MAX_LENGTH}
          required={true}
          texts={uiText.name}
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
              {uiText.initiative.many}
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
            {uiText.initiative.one}
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
          texts={uiText.desctiption}
          validator={validateDescription}
          state={resource.description}
          stateSetter={updateValue("description")}
          validationErrors={errors.description ?? []}
        />

        {attachmentConfigs.map((config) => (
          <AttachmentInput
            key={config.id}
            labelId={config.id}
            inputType={config.type}
            items={resource[config.id]}
            updater={updateValue(config.id)}
            validationErrors={errors[config.id] ?? []}
            descriptionMaxLength={100}
            contentMaxLength={config.max}
            text={uiText.attachments[config.id]}
            currentHelper={helper}
            helpers={config.helpers}
            setHelper={setHelper}
          />
        ))}

        <div className="flex gap-2 py-4 items-center justify-center">
          <LabelAndErrors
            validationErrors={errors.isDraft ?? []}
            errID="errors_isDraft"
            htmlFor="isDraft"
          >
            {uiText.isDraft.label}
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
          {uiText.isDraft.feedback(resource.isDraft)}
        </div>

        <ConfirmationDialog
          triggerBtnVariant="outline"
          className="w-full"
          texts={{
            trigger: {
              label: tos
                ? tosTexts.trigger.read
                : tosTexts.trigger.readToAccept,
              icon: tos ? CircleCheckBig : Circle,
            },
            dialog: {
              title: tosTexts.title,
              description: tosTexts.description,
              longMarkdown: tosTexts.tos,
            },
            actionBtns: {
              confirm: tos
                ? tosTexts.actionBtns.decline
                : tosTexts.actionBtns.accept,
              cancel: tosTexts.actionBtns.cancel,
            },
          }}
          handler={() => setTOS(!tos)}
        />

        <ErrorsList
          errorItems={errors.root ?? []}
          className="bg-accent/10 p-4 border border-accent rounded-lg"
        />

        <div className="flex flex-row-reverse justify-between gap-2">
          <Button disabled={!tos || isLoading}>
            {resource.isDraft ? "Guardar" : "Publicar"}
          </Button>

          <ButtonGroup>
            {!!resourceId && (
              <Button
                type="button"
                variant="outline_destructive"
                onClick={() => onSubmitSuccess()}
              >
                Cancelar
              </Button>
            )}
            <Button type="reset" variant="outline_destructive">
              Deshacer cambios
            </Button>
          </ButtonGroup>
        </div>
      </form>
    </div>
  );
}
