import { useCallback, useEffect, useMemo, useRef } from "react";

import { cn } from "@ui/shadCN/lib/utils";

import type { CardInfoGrouped } from "pages/monitoring/types/initiativeData";
import { EditModeButton } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/EditModeButton";
import { useInitiativeDataCTX } from "pages/monitoring/ui/initiativesAdmin/hooks/useAdminUpdateContext";
import { TagsManger } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/TagsManager";
import type { TagInInitiative } from "pages/monitoring/types/odataResponse";
import { initiativeTagCategories } from "pages/monitoring/ui/initiativesAdmin/layout/initiativeTagCategoties";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";

type TagsUpdaterProps = {
  title: string;
};

export function TagsUpdater({ title }: TagsUpdaterProps) {
  const { initiative, updater, currentEdit, setCurrentEdit } =
    useInitiativeDataCTX();
  const tagsInfo = useRef<CardInfoGrouped["tags"] | null>(null);

  const initiativeId = initiative?.id ?? null;
  const editThis = currentEdit === "tags";

  const reset = useCallback(() => {
    tagsInfo.current = initiative ? [...initiative.tags] : null;
  }, [initiative]);

  useEffect(() => {
    reset();
  }, [reset]);

  const editPanelAction = () => {
    setCurrentEdit!((curEdit) => (curEdit === "tags" ? "none" : "tags"));
    reset();
  };

  return (
    <div
      className={cn(
        "p-2 rounded-lg",
        editThis ? "bg-muted outline-2 outline-primary" : "",
      )}
    >
      <div
        id={`${initiativeId}_${"images"}`}
        className="font-normal flex flex-wrap gap-2 text-primary items-center text-lg pb-1"
      >
        <h4 className="font-normal text-primary text-lg p-0! m-0!">{title}</h4>
        {currentEdit && (
          <EditModeButton state={editThis} setState={() => editPanelAction()} />
        )}
      </div>

      {!editThis ? (
        <div className="flex gap-x-8 gap-y-4 flex-wrap items-end *:flex-[1_1_350px]">
          <TagsList sectionInfo={tagsInfo.current ?? []} />
        </div>
      ) : (
        <form aria-labelledby={`${initiativeId}_tags`}>
          <TagsManger
            sectionInfo={tagsInfo.current ?? []}
            sectionUpdater={() => void updater!()}
            validationErrors={[]}
            initiativeId={initiativeId}
          />
        </form>
      )}
    </div>
  );
}

function TagsList({ sectionInfo }: { sectionInfo: TagInInitiative[] | null }) {
  const tags = useMemo(() => {
    return initiativeTagCategories.reduce<Record<number, TagInInitiative[]>>(
      (all, category) => {
        all[category.tagCategoryId] =
          sectionInfo !== null
            ? sectionInfo.filter((t) => {
                return t.tag.category.id === category.tagCategoryId;
              })
            : [];
        return all;
      },
      {},
    );
  }, [sectionInfo]);

  return (
    <div className="flex gap-10">
      {initiativeTagCategories.map((tagGroup) => {
        const tagCategoryId = tagGroup.tagCategoryId;
        return (
          <div className="flex-1" key={`tagGroup_${tagCategoryId}`}>
            <h4 className="text-base font-light m-0">{tagGroup.title}</h4>
            {tags[tagCategoryId] && tags[tagCategoryId].length ? (
              <ul className="flex flex-wrap gap-2">
                {tags[tagCategoryId].map((tag) => (
                  <li
                    key={`tag-render_${tag.tag.id}`}
                    className="flex border border-primary px-2 bg-muted text-primary font-normal rounded"
                  >
                    {tag.tag.name}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-primary">
                {uiText.initiative.module.tags.noTagsOfThisContext}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
