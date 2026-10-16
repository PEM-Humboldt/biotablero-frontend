import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { TagData } from "pages/monitoring/types/initiative";
import { type ObservationMetadata } from "pages/monitoring/types/observations";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { updateObservationName } from "pages/monitoring/api/services/observations";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { TagsGroupsRender } from "pages/monitoring/ui/TagsGroupsRender";
import { LabeledInput } from "@ui/LabeledInput";
import { StrValidator } from "@utils/strValidator";
import {
  isTagRelated,
  StableTagSelector,
} from "pages/monitoring/ui/TagSelector";

import {
  INITIATIVE_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS,
  RESOURCE_TAGS_LIMIT_BIOLOGICAL_GROUP,
  RESOURCE_TAGS_LIMIT_ECOSYSTEM,
} from "@config/monitoring";
import { TagInObservation } from "pages/monitoring/types/odataResponse";
import {
  addTagToObservation,
  removeTagFromObservation,
} from "pages/monitoring/api/services/tags";
import { validationExemption } from "pages/monitoring/ui/initiativesAdmin/utils/fieldClientValidations";
import { observationNameNotExist } from "../utils/observationValidations";

export const observationTagCategories: {
  tagCategoryId: number;
  title: string;
  maxTagsAmount: number;
  uiText: { itemNotFound: string; trigger: string; inputPlaceholder: string };
}[] = [
  {
    tagCategoryId: 3,
    title: "Grupo biológico",
    maxTagsAmount: RESOURCE_TAGS_LIMIT_ECOSYSTEM,
    uiText: {
      itemNotFound:
        "No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a info@biotablero.humboldt.org.co",
      trigger: "Añadir etiqueta de grupo biológico",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
  {
    tagCategoryId: 4,
    title: "Ecosistemas",
    maxTagsAmount: RESOURCE_TAGS_LIMIT_BIOLOGICAL_GROUP,
    uiText: {
      itemNotFound:
        "No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a biotablero@humboldt.org.co",
      trigger: "Añadir etiqueta de ecosistemas",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
];

const getTagId = (tag: TagInObservation | TagData) =>
  isTagRelated(tag) ? tag.tag.id : tag.id;

export function ObservationHeader({
  observation,
  editingThis: editingThis,
  setObservationToEdit,
  onSubmitSuccess,
}: {
  observation: ObservationMetadata;
  editingThis: boolean;
  setObservationToEdit: Dispatch<SetStateAction<number | null>>;
  onSubmitSuccess: () => void;
}) {
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState<{ input?: string[]; global?: string[] }>(
    {},
  );
  const [observationName, setObservationName] = useState(observation.name);
  const tagsRef = useRef<TagInObservation[]>([]);

  useEffect(() => {
    tagsRef.current = observation.tags;
  }, [observation.tags]);

  const [tags, setTags] = useState<
    Record<number, (TagInObservation | TagData)[]>
  >(() => {
    return observationTagCategories.reduce<Record<number, TagInObservation[]>>(
      (all, current) => {
        const categoryId = current.tagCategoryId;

        all[categoryId] = observation.tags.filter((tag) => {
          return tag.tag.category.id === categoryId;
        });
        return all;
      },
      {},
    );
  });

  const updateTags = useCallback(
    (categoryId: number) => (updatedTags: (TagInObservation | TagData)[]) => {
      setTags((oldTags) => {
        const newState = {
          ...oldTags,
          [categoryId]: updatedTags,
        };

        return newState;
      });
    },
    [],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentTags = tagsRef.current;
    setErrors({});
    setIsloading(true);

    try {
      const [sanitizedName, validationErrors] = (
        await new StrValidator(observationName)
          .sanitize()
          .isRequired()
          .hasLengthMoreThan(3)
          .hasLengthLessOrEqualThan(120)
          .customAsync(
            validationExemption(
              observationNameNotExist(observation.initiativeId),
              observation.name === observationName,
            ),
            "Ya existe otra observación con ese nombre",
          )
      ).result;

      if (validationErrors.length > 0) {
        setErrors((old) => ({ ...old, input: validationErrors }));
        return null;
      }

      if (sanitizedName !== observation.name) {
        const res = await updateObservationName(observation.id, sanitizedName);
        if (isMonitoringAPIError(res)) {
          setErrors((old) => ({
            ...old,
            global: [
              "Se presentó un error actualizando el nombre de la observación",
              ...res.data.map((err) => err.msg),
            ],
          }));

          return;
        }
        setObservationName(res.name);
      }

      const flatTagsIds = Object.values(tags).flat().map(getTagId);
      const diffTagsIds = {
        add: flatTagsIds.filter(
          (newTag) =>
            !currentTags.some((oldTag) => getTagId(oldTag) === newTag),
        ),
        remove: currentTags.filter(
          (oldTag) =>
            !flatTagsIds.some((newTag) => getTagId(oldTag) === newTag),
        ),
      };

      if (diffTagsIds.remove.length > 0) {
        const res = await Promise.all(
          diffTagsIds.remove.map(({ observationTagId }) =>
            removeTagFromObservation(observationTagId),
          ),
        );

        const resErrors = res.filter(isMonitoringAPIError);
        if (resErrors.length > 0) {
          setErrors((old) => ({
            ...old,
            global: [
              "Se presentó un error quitando las etiquetas",
              ...resErrors
                .map((error) => error.data.map((err) => err.msg))
                .flat(),
            ],
          }));

          return;
        }
      }

      if (diffTagsIds.add.length > 0) {
        const res = await Promise.all(
          diffTagsIds.add.map((tagId) =>
            addTagToObservation(observation.id, tagId),
          ),
        );

        const resErrors = res.filter(isMonitoringAPIError);
        if (resErrors.length > 0) {
          setErrors((old) => ({
            ...old,
            global: [
              "Se presentó un error agregando las etiquetas",
              ...resErrors
                .map((error) => error.data.map((err) => err.msg))
                .flat(),
            ],
          }));

          return;
        }
      }

      onSubmitSuccess();
      setObservationToEdit(null);
    } finally {
      setIsloading(false);
    }
  };

  return !editingThis ? (
    <header className="flex">
      <div className="flex-1">
        <h4 className="*:block">
          <span>{observation.name}</span>
          <span className="text-base italic font-light">
            {observation.topic.name}
          </span>
        </h4>

        <TagsGroupsRender
          tags={observation.tags.map((t) => t.tag)}
          groupId={observation.name.replaceAll(" ", "")}
          colorIndexOffset={3}
        />
      </div>
      <Button onClick={() => setObservationToEdit(observation.id)}>
        Editar observacion
      </Button>
    </header>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4 bg-muted p-4 rounded-lg">
      <ErrorsList
        errorItems={errors?.global ?? []}
        className="bg-accent/10 border border-accent rounded-lg p-4"
      />

      <LabeledInput
        inputName={`observation-${observation.id}_name`}
        inputMaxLength={120}
        required={true}
        texts={{ label: "Nombre de la observación" }}
        state={observationName}
        stateSetter={setObservationName}
        validationErrors={errors?.input ?? []}
        autoComplete="off"
      />

      <div className="flex gap-12" title="Etiquetas de la observación">
        {observationTagCategories.map((tagGroup) => {
          const tagCategoryId = tagGroup.tagCategoryId;

          return (
            <StableTagSelector
              key={`tag_manager_${tagCategoryId}`}
              managerTitle={tagGroup.title}
              tagCategoryId={tagCategoryId}
              selectedTags={tags[tagCategoryId]}
              onTagsChange={updateTags(tagCategoryId)}
              fixedSearchParams={INITIATIVE_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS}
              maxTagsAmount={tagGroup.maxTagsAmount}
              texts={tagGroup.uiText}
              relatedId={observation.id}
              parentRelationKey="observationTagId"
            />
          );
        })}
      </div>

      <div className="flex flex-row-reverse justify-between">
        <Button disabled={isLoading}>Guardar</Button>
        <Button
          type="button"
          variant="outline_destructive"
          onClick={() => setObservationToEdit(null)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
