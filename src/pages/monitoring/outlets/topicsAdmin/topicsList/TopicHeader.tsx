import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { TagData } from "pages/monitoring/types/initiative";
import { type TopicMetadata } from "pages/monitoring/types/topics";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { updateTopicName } from "pages/monitoring/api/services/topics";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { TagsGroupsRender } from "pages/monitoring/ui/TagsGroupsRender";
import { LabeledInput } from "@ui/LabeledInput";
import { StrValidator } from "@utils/strValidator";
import {
  isTagRelated,
  StableTagSelector,
} from "pages/monitoring/ui/TagSelector";

import { INITIATIVE_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS } from "@config/monitoring";
import type { TagInTopic } from "pages/monitoring/types/odataResponse";
import {
  addTagToTopic,
  removeTagFromTopic,
} from "pages/monitoring/api/services/tags";
import { validationExemption } from "pages/monitoring/ui/initiativesAdmin/utils/fieldClientValidations";
import { topicNameNotExist } from "pages/monitoring/outlets/topicsAdmin/utils/topicValidations";
import { toast } from "sonner";
import { UserRoundCheck } from "lucide-react";
import { topicTagCategories } from "pages/monitoring/outlets/topicsAdmin/layout/topicTagCategories";

const getTagId = (tag: TagInTopic | TagData) =>
  isTagRelated(tag) ? tag.tag.id : tag.id;

export function TopicHeader({
  topic,
  editMode,
  onUpdateSuccess,
}: {
  topic: TopicMetadata;
  editMode: boolean;
  onUpdateSuccess: () => Promise<void>;
}) {
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState<{ input?: string[]; global?: string[] }>(
    {},
  );
  const [topicName, setTopicName] = useState(topic.name);

  const tagsRef = useRef<TagInTopic[]>([]);

  useEffect(() => {
    tagsRef.current = topic.tags;
  }, [topic.tags]);

  const savedTagsSetter = () =>
    topicTagCategories.reduce<Record<number, TagInTopic[]>>((all, current) => {
      const categoryId = current.tagCategoryId;

      all[categoryId] = topic.tags.filter((tag) => {
        return tag.tag.category.id === categoryId;
      });
      return all;
    }, {});

  const [tags, setTags] =
    useState<Record<number, (TagInTopic | TagData)[]>>(savedTagsSetter);

  const updateTags = useCallback(
    (categoryId: number) => (updatedTags: (TagInTopic | TagData)[]) => {
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
        await new StrValidator(topicName)
          .sanitize()
          .isRequired()
          .hasLengthMoreThan(3)
          .hasLengthLessOrEqualThan(120)
          .customAsync(
            validationExemption(
              topicNameNotExist(topic.initiativeId),
              topic.name === topicName,
            ),
            "Ya existe otra temática con ese nombre",
          )
      ).result;

      if (validationErrors.length > 0) {
        setErrors((old) => ({ ...old, input: validationErrors }));
        return null;
      }

      if (sanitizedName !== topic.name) {
        const res = await updateTopicName(topic.id, sanitizedName);
        if (isMonitoringAPIError(res)) {
          setErrors((old) => ({
            ...old,
            global: [
              "Se presentó un error actualizando el nombre de la temática",
              ...res.data.map((err) => err.msg),
            ],
          }));

          return;
        }
        setTopicName(res.name);
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
          diffTagsIds.remove.map(({ topicTagId }) =>
            removeTagFromTopic(topicTagId),
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
          diffTagsIds.add.map((tagId) => addTagToTopic(topic.id, tagId)),
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

      await onUpdateSuccess();

      toast("Información de la temática actualizada", {
        position: "bottom-right",
        description: `La información de la temática ${topicName} fue correctamente actualizada`,
        icon: <UserRoundCheck className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });
    } finally {
      setIsloading(false);
    }
  };

  const handleReset = () => {
    setTags(savedTagsSetter());
    setTopicName(topic.name);
  };

  return !editMode ? (
    <header className="flex">
      <div className="flex-1">
        <h4 className="*:block">
          <span>{topic.name}</span>
          <span className="text-base italic font-light">
            {topic.topicType.name}
          </span>
        </h4>

        <TagsGroupsRender
          tags={topic.tags.map((t) => t.tag)}
          groupId={topic.name.replaceAll(" ", "")}
          colorIndexOffset={3}
        />
      </div>
    </header>
  ) : (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      onReset={handleReset}
      className="space-y-4 bg-muted p-4 rounded-lg"
    >
      <ErrorsList
        errorItems={errors?.global ?? []}
        className="bg-accent/10 border border-accent rounded-lg p-4"
      />

      <LabeledInput
        inputName={`topic-${topic.id}_name`}
        inputMaxLength={120}
        required={true}
        texts={{ label: "Nombre de la temática" }}
        state={topicName}
        stateSetter={setTopicName}
        validationErrors={errors?.input ?? []}
        autoComplete="off"
      />

      <div className="flex gap-12" title="Etiquetas de la temática">
        {topicTagCategories.map((tagGroup) => {
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
              relatedId={topic.id}
              parentRelationKey="topicTagId"
            />
          );
        })}
      </div>

      <div className="flex flex-row-reverse justify-between">
        <Button disabled={isLoading}>Guardar</Button>
        <Button
          type="reset"
          variant="outline_destructive"
          onClick={() => console.warn("reset header")}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
