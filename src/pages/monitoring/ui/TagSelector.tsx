import { useCallback, useMemo, useRef, useState } from "react";
import { CirclePlus, XIcon } from "lucide-react";

import { ComboboxOData } from "@ui/ComboboxOData";
import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";
import type { ApiRequestError } from "@appTypes/api";
import type { ODataParams } from "@appTypes/odata";
import { cn } from "@ui/shadCN/lib/utils";

import { type TagData } from "pages/monitoring/types/initiative";
import type { ODataTag } from "pages/monitoring/types/odataResponse";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useDeepStable } from "@hooks/useDeepStable";
import { typedMemo } from "@utils/typedMemo";

interface TagSelectorProps<T> {
  managerTitle: string;
  tagCategoryId: number;
  fixedSearchParams: ODataParams;
  selectedTags: (TagData | T)[];
  onTagsChange: (tags: (TagData | T)[]) => void;
  maxTagsAmount: number;
  texts: { itemNotFound: string; trigger: string; inputPlaceholder: string };
  relatedId: number | null;
  parentRelationKey: keyof T;
  apiUpdaters?: {
    add?: (parentId: number, tagId: number) => Promise<T | ApiRequestError>;
    remove?: (relationId: number) => Promise<T | ApiRequestError | void>;
  };
}

export function StableTagSelector<
  T extends { tag: Omit<ODataTag, "categoryName"> },
>(props: TagSelectorProps<T>) {
  const stableSearchParams = useDeepStable(props.fixedSearchParams);
  const stableSelectedTags = useDeepStable(props.selectedTags);
  const stableTexts = useDeepStable(props.texts);
  const stableUpdaters = useDeepStable(props.apiUpdaters);
  const onTagsChangeRef = useRef(props.onTagsChange);
  onTagsChangeRef.current = props.onTagsChange;

  const stableOnTagsChange = useCallback((tags: (TagData | T)[]) => {
    onTagsChangeRef.current(tags);
  }, []);

  return (
    <TagSelector
      {...props}
      fixedSearchParams={stableSearchParams}
      selectedTags={stableSelectedTags}
      texts={stableTexts}
      apiUpdaters={stableUpdaters}
      onTagsChange={stableOnTagsChange}
    />
  );
}

export const TagSelector = typedMemo(function TagSelectorInner<
  T extends { tag: Omit<ODataTag, "categoryName"> },
>({
  managerTitle,
  tagCategoryId,
  fixedSearchParams,
  selectedTags,
  onTagsChange,
  maxTagsAmount,
  texts,
  relatedId,
  parentRelationKey,
  apiUpdaters,
}: TagSelectorProps<T>) {
  const [value, setValue] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const tagIdsKey = selectedTags
    .map((t) => (isTagRelated(t) ? t.tag.id : t.id))
    .join(",");

  const filter = useMemo(() => {
    const categoryPart = `category/id eq ${tagCategoryId}`;
    const exclusionPart = tagIdsKey ? ` and not (id in (${tagIdsKey}))` : "";

    return `${categoryPart}${exclusionPart}`;
  }, [tagCategoryId, tagIdsKey]);

  function isTagRelated(tag: TagData | T): tag is T {
    return typeof tag === "object" && tag !== null && "tag" in tag;
  }

  const addTag = async () => {
    if (value === "") {
      return;
    }

    setErrors([]);
    const [tagId, label] = value.split("|");
    let newTag: TagData | T = {
      id: Number(tagId),
      name: label,
    };

    if (relatedId && apiUpdaters?.add) {
      const res = await apiUpdaters.add(relatedId, Number(tagId));

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      newTag = res;
    }

    onTagsChange([...selectedTags, newTag]);
    setValue("");
  };

  const removeTag = async (tagId: number, relationId: number | null) => {
    setErrors([]);
    if (relationId && apiUpdaters?.remove) {
      const res = await apiUpdaters.remove(relationId);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }
    }

    onTagsChange(
      selectedTags.filter((tag) =>
        isTagRelated(tag) ? tag.tag.id !== tagId : tag.id !== tagId,
      ),
    );
  };

  const handleTagValueCreation = useCallback((items: ODataTag[]) => {
    return items.map((item) => ({
      value: `${item.id}|${item.name}`,
      label: item.name,
    }));
  }, []);

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
            const isUpdate = isTagRelated(t);
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
                    void removeTag(
                      tag.id,
                      isUpdate ? (t[parentRelationKey] as number) : null,
                    )
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
            fixedFilter={filter}
            fixedSearchParams={fixedSearchParams}
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
});
