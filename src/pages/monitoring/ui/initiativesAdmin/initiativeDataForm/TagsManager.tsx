import { useMemo, useState } from "react";
import { CirclePlus, XIcon } from "lucide-react";

import { ComboboxOData } from "@ui/ComboboxOData";
import { Button } from "@ui/shadCN/component/button";
import { ErrorsList, LegendAndErrors } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";

import {
  isTagInInitiative,
  type TagData,
} from "pages/monitoring/types/initiative";
import type {
  ODataTag,
  TagInInitiative,
} from "pages/monitoring/types/odataResponse";
import { PlainInputContainer } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/PlainInputContainer";
import { initiativeTagCategories } from "pages/monitoring/ui/initiativesAdmin/layout/initiativeTagCategoties";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import {
  addTagToInitiative,
  removeTagFromInitiative,
} from "pages/monitoring/api/services/tags";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export function TagsManger({
  title,
  sectionInfo,
  sectionUpdater,
  validationErrors,
  initiativeId,
}: {
  title?: string;
  sectionInfo: (TagData | TagInInitiative)[];
  sectionUpdater: (value: (TagData | TagInInitiative)[]) => void;
  validationErrors: string[];
  initiativeId: number | null;
}) {
  const [tags, setTags] = useState<
    Record<number, (TagData | TagInInitiative)[]>
  >(() => {
    return initiativeTagCategories.reduce<
      Record<number, (TagData | TagInInitiative)[]>
    >((all, current) => {
      const categoryId = current.tagCategoryId;

      all[categoryId] = sectionInfo.filter((tag) => {
        return isTagInInitiative(tag)
          ? tag.tag.category.id === categoryId
          : tag.id === categoryId;
      });
      return all;
    }, {});
  });

  const updateTags =
    (categoryId: number) => (updatedTags: (TagData | TagInInitiative)[]) => {
      setTags((oldTags) => {
        const newState = {
          ...oldTags,
          [categoryId]: updatedTags,
        };

        const flatTags = Object.values(newState).flat();
        sectionUpdater(flatTags);

        return newState;
      });
    };

  return (
    <PlainInputContainer
      isFieldset={!!title}
      hasError={validationErrors.length > 0}
    >
      {title ? (
        <LegendAndErrors validationErrors={validationErrors}>
          {title}
        </LegendAndErrors>
      ) : (
        <ErrorsList errorItems={validationErrors} />
      )}

      <div className="flex gap-10">
        {initiativeTagCategories.map((tagGroup) => {
          const tagCategoryId = tagGroup.tagCategoryId;
          return (
            <TagSelector
              key={`tagCategory_${tagCategoryId}`}
              managerTitle={tagGroup.title}
              tagCategoryId={tagCategoryId}
              selectedTags={tags[tagCategoryId] ?? []}
              onTagsChange={updateTags(tagCategoryId)}
              maxTagsAmount={tagGroup.maxTagsAmount}
              texts={tagGroup.uiText}
              initiativeId={initiativeId}
            />
          );
        })}
      </div>
    </PlainInputContainer>
  );
}

function TagSelector({
  managerTitle,
  tagCategoryId,
  selectedTags,
  onTagsChange,
  maxTagsAmount,
  texts,
  initiativeId,
}: {
  managerTitle: string;
  tagCategoryId: number;
  selectedTags: (TagData | TagInInitiative)[];
  onTagsChange: (tags: (TagData | TagInInitiative)[]) => void;
  maxTagsAmount: number;
  texts: { itemNotFound: string; trigger: string; inputPlaceholder: string };
  initiativeId: number | null;
}) {
  const [value, setValue] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const filter = useMemo(() => {
    const categoryPart = `category/id eq ${tagCategoryId}`;
    const exclusionPart =
      selectedTags && selectedTags.length > 0
        ? ` and not (id in (${selectedTags
            .map((t) => (isTagInInitiative(t) ? t.tag.id : t.id))
            .join(", ")}))`
        : "";

    return `${categoryPart}${exclusionPart}`;
  }, [tagCategoryId, selectedTags]);

  const addTag = async () => {
    if (value === "") {
      return;
    }

    setErrors([]);
    const [tagId, label] = value.split("|");
    let newTag: TagData | TagInInitiative = {
      id: Number(tagId),
      name: label,
    };

    if (initiativeId) {
      const res = await addTagToInitiative(initiativeId, Number(tagId));
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      newTag = res;
    }

    onTagsChange([...selectedTags, newTag]);
    setValue("");
  };

  const removeTag = async (tagId: number, tagIdInInitiative: number | null) => {
    setErrors([]);
    if (tagIdInInitiative) {
      const res = await removeTagFromInitiative(tagIdInInitiative);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }
    }

    onTagsChange(
      selectedTags.filter((tag) =>
        isTagInInitiative(tag) ? tag.tag.id !== tagId : tag.id !== tagId,
      ),
    );
  };

  const handleTagValueCreation = (items: ODataTag[]) => {
    return items.map((item) => ({
      value: `${item.id}|${item.name}`,
      label: item.name,
    }));
  };

  const uiTexts = uiText.initiative.module.tags;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex gap-2 justify-between ">
        <label htmlFor={`tagManager_${tagCategoryId}`}>{managerTitle}</label>
        <span className="text-primary font-normal text-sm">
          {uiTexts.counter(selectedTags.length, maxTagsAmount)}
        </span>
      </div>

      {selectedTags.length > 0 && (
        <ul
          aria-label={uiTexts.activeTags}
          className={cn(
            "flex flex-wrap gap-2 mb-2",
            selectedTags.length >= maxTagsAmount
              ? "justify-start"
              : "justify-end",
          )}
        >
          {selectedTags.map((t) => {
            const isUpdate = isTagInInitiative(t);
            const tag = isUpdate ? t.tag : t;

            return (
              <li
                key={`tag-remove_${tag.id}`}
                className="flex pl-2 bg-primary text-primary-foreground font-normal rounded"
              >
                <span className="pr-2 border-r border-r-primary-foreground/30 text-sm">
                  {tag.name}
                </span>

                <Button
                  type="button"
                  variant="link"
                  onClick={() =>
                    void removeTag(tag.id, isUpdate ? t.initiativeTagId : null)
                  }
                  className="w-6! h-6! text-primary-foreground"
                  title={uiTexts.removeTagBtn.title}
                >
                  <span className="sr-only">{uiTexts.removeTagBtn.sr}</span>
                  <XIcon aria-hidden="true" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <ErrorsList errorItems={errors} />
      {selectedTags.length < maxTagsAmount && (
        <div className="flex gap-2">
          <ComboboxOData<ODataTag>
            id={`tagManager_${tagCategoryId}`}
            value={value}
            setValue={setValue}
            endpoint="Tag"
            sources={["name"]}
            sourceProcess={handleTagValueCreation}
            fixedSearchParams={{ orderby: "name asc" }}
            fixedFilter={filter}
            maxItems={maxTagsAmount}
            uiText={{ ...texts }}
            className="flex-1 min-w-0"
          />

          <Button
            onClick={() => void addTag()}
            type="button"
            variant="outline"
            size="icon"
            title={uiTexts.addTagBtn.title}
            disabled={value === ""}
          >
            <span className="sr-only">{uiTexts.addTagBtn.sr}</span>
            <CirclePlus aria-hidden="true" className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
