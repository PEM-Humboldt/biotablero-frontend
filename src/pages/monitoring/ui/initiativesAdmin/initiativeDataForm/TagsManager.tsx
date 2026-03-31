import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import type { TagData } from "pages/monitoring/types/initiative";
import type { InitiativeDataFormErr } from "pages/monitoring/types/initiativeData";
import { ComboboxOData } from "@ui/ComboboxOData";
import type {
  ODataTag,
  TagInInitiative,
} from "pages/monitoring/types/odataResponse";
import { Button } from "@ui/shadCN/component/button";

const initiativeTagCategories = new Map<
  number,
  { title: string; maxTagsAmount: number }
>([
  [3, { title: "algo", maxTagsAmount: 3 }],
  [2, { title: "otro", maxTagsAmount: 2 }],
]);

function isTagInInitiative(
  tag: TagData | TagInInitiative,
): tag is TagInInitiative {
  return "initiativeTagId" in tag;
}

export function TagsManger({
  title,
  sectionInfo,
  sectionUpdater,
  validationErrorsObj = {},
  submitBlocker,
}: {
  title?: string;
  sectionInfo: (TagData | TagInInitiative)[];
  sectionUpdater: (value: (TagData | TagInInitiative)[]) => void;
  validationErrorsObj: Partial<InitiativeDataFormErr["tags"]>;
  submitBlocker?:
    | Dispatch<SetStateAction<boolean>>
    | ((value: boolean) => void);
}) {
  const [tags, setTags] = useState<
    Record<number, (TagData | TagInInitiative)[]>
  >(() => {
    return Array.from(initiativeTagCategories.keys()).reduce<
      Record<number, (TagData | TagInInitiative)[]>
    >((all, categoryId) => {
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

  return Array.from(initiativeTagCategories.keys()).map((tagCategory) => (
    <TagSelector
      key={`tagCategoty_${tagCategory}`}
      tagCategoryId={tagCategory}
      selectedTags={tags[tagCategory] ?? []}
      onTagsChange={updateTags(tagCategory)}
    />
  ));
}

function TagSelector({
  tagCategoryId,
  selectedTags,
  onTagsChange,
}: {
  tagCategoryId: number;
  selectedTags: (TagData | TagInInitiative)[];
  onTagsChange: (tags: (TagData | TagInInitiative)[]) => void;
}) {
  const [value, setValue] = useState<string>("");

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

  const addTag = () => {
    if (value === "") {
      return;
    }

    const [id, label] = value.split("|");

    onTagsChange([...selectedTags, { id: Number(id), name: label }]);
    setValue("");
  };

  const removeTag = (tagId: number) => {
    onTagsChange(
      selectedTags.filter((tag) =>
        isTagInInitiative(tag) ? tag.tag.id !== tagId : tag.id !== tagId,
      ),
    );
  };

  return (
    <>
      {selectedTags && (
        <ul>
          {selectedTags.map((tag) => {
            const tagId = isTagInInitiative(tag) ? tag.tag.id : tag.id;
            const tagName = isTagInInitiative(tag) ? tag.tag.name : tag.name;
            return (
              <li key={`tag-remove_${tagId}`}>
                {tagName}
                <Button type="button" onClick={() => removeTag(tagId)}>
                  X
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <ComboboxOData<ODataTag>
        value={value}
        setValue={setValue}
        endpoint="Tag"
        sources={["name"]}
        sourceProcess={(items: ODataTag[]) => {
          return items.map((item) => ({
            value: `${item.id}|${item.name}`,
            label: item.name,
          }));
        }}
        fixedSearchParams={{ orderby: "name asc" }}
        fixedFilter={filter}
        maxItems={4}
        uiText={{
          itemNotFound: "No hay etiquetas bajo esa búsqueda",
          trigger: "Añadir etiqueta",
          inputPlaceholder: "Escribe para empezar a buscar",
        }}
      />

      <Button type="button" onClick={addTag} disabled={value === ""}>
        Añadir
      </Button>
    </>
  );
}
