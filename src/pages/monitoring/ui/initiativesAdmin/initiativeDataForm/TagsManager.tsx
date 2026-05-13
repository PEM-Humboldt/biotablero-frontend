import { useCallback, useState } from "react";

import { ErrorsList, LegendAndErrors } from "@ui/LabelingWithErrors";
import { INITIATIVE_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS } from "@config/monitoring";

import {
  isTagInInitiative,
  type TagData,
} from "pages/monitoring/types/initiative";
import type { TagInInitiative } from "pages/monitoring/types/odataResponse";
import { PlainInputContainer } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/PlainInputContainer";
import { initiativeTagCategories } from "pages/monitoring/ui/initiativesAdmin/layout/initiativeTagCategoties";
import {
  addTagToInitiative,
  removeTagFromInitiative,
} from "pages/monitoring/api/services/tags";
import { StableTagSelector } from "pages/monitoring/ui/TagSelector";

export function TagsManager({
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

  const updateTags = useCallback(
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
    },
    [sectionUpdater],
  );

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
            <StableTagSelector
              key={`tag_manager_${tagCategoryId}`}
              managerTitle={tagGroup.title}
              tagCategoryId={tagCategoryId}
              selectedTags={tags[tagCategoryId]}
              onTagsChange={updateTags(tagCategoryId)}
              fixedSearchParams={INITIATIVE_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS}
              maxTagsAmount={tagGroup.maxTagsAmount}
              texts={tagGroup.uiText}
              relatedId={initiativeId}
              parentRelationKey="initiativeTagId"
              apiUpdaters={{
                add: addTagToInitiative,
                remove: removeTagFromInitiative,
              }}
            />
          );
        })}
      </div>
    </PlainInputContainer>
  );
}
