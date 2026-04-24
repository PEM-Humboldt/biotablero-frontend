import type {
  ODataTag,
  ResourceTag,
} from "pages/monitoring/types/odataResponse";
import { Button } from "@ui/shadCN/component/button";
import { useState, memo, useMemo, useCallback } from "react";
import { RESOURCES_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";
import type { TagData } from "pages/monitoring/types/initiative";
import { ComboboxOData } from "@ui/ComboboxOData";
import { CirclePlus, XIcon } from "lucide-react";

export function isTagInResource(
  tag: TagData | ResourceTag,
): tag is ResourceTag {
  return "resourceTagId" in tag;
}

export const ResourceTagSelector = memo(function TagSelector({
  managerTitle,
  tagCategoryId,
  selectedTags,
  onTagsChange,
  maxTagsAmount,
  texts,
}: {
  managerTitle: string;
  tagCategoryId: number;
  selectedTags: (TagData | Omit<ODataTag, "categoryName">)[];
  onTagsChange: (value: (Omit<ODataTag, "categoryName"> | TagData)[]) => void;
  maxTagsAmount: number;
  texts: { itemNotFound: string; trigger: string; inputPlaceholder: string };
}) {
  const [value, setValue] = useState<string>("");

  const tagIdsKey = selectedTags
    .map((t) => (isTagInResource(t) ? t.tag.id : t.id))
    .join(",");

  const filter = useMemo(() => {
    const categoryPart = `category/id eq ${tagCategoryId}`;
    const exclusionPart = tagIdsKey ? ` and not (id in (${tagIdsKey}))` : "";

    return `${categoryPart}${exclusionPart}`;
  }, [tagCategoryId, tagIdsKey]);

  const addTag = () => {
    if (value === "") {
      return;
    }

    const [tagId, label] = value.split("|");
    const newTag: TagData | ResourceTag = {
      id: Number(tagId),
      name: label,
    };

    onTagsChange([...selectedTags, newTag]);
    setValue("");
  };

  const removeTag = (tagId: number) => {
    onTagsChange(
      selectedTags.filter((tag) =>
        isTagInResource(tag) ? tag.tag.id !== tagId : tag.id !== tagId,
      ),
    );
  };

  const handleTagValueCreation = useCallback((items: ODataTag[]) => {
    return items.map((item) => ({
      value: `${item.id}|${item.name}`,
      label: item.name,
    }));
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex gap-2 justify-between ">
        <label htmlFor={`tagManager_${tagCategoryId}`}>{managerTitle}</label>
        <span className="text-primary font-normal text-sm">
          {selectedTags.length} / {maxTagsAmount}
        </span>
      </div>

      {selectedTags.length > 0 && (
        <ul
          aria-label="Etiquetas activas"
          className={cn(
            "flex flex-wrap gap-2 mb-2",
            selectedTags.length >= maxTagsAmount
              ? "justify-start"
              : "justify-end",
          )}
        >
          {selectedTags.map((t) => {
            const isUpdate = isTagInResource(t);
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
                  onClick={() => removeTag(tag.id)}
                  className="w-6! h-6! text-primary-foreground"
                  title="Quitar"
                >
                  <span className="sr-only">Quitar etiqueta</span>
                  <XIcon aria-hidden="true" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

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
            fixedSearchParams={RESOURCES_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS}
            maxItems={maxTagsAmount}
            uiText={{ ...texts }}
            className="flex-1 min-w-0"
          />

          <Button
            onClick={() => void addTag()}
            type="button"
            variant="outline"
            size="icon"
            title="Agregar"
            disabled={value === ""}
          >
            <span className="sr-only">Agregar etiqueta</span>
            <CirclePlus aria-hidden="true" className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
});
