import { useCallback, useEffect, useState } from "react";

import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Combobox } from "@ui/ComboBox";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

import {
  TagDataBasic,
} from "pages/monitoring/types/initiative";
import type { ItemEditorProps } from "pages/monitoring/types/initiativeData";
import { InputListActionButtons } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/InputListActionButtons";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import { getTags } from "pages/monitoring/api/services/tags";
import { ODataTagInfo } from "pages/monitoring/types/odataResponse";
import { translateTagCategory } from "pages/monitoring/outlets/tagsAdmin/utils/tagCategoryTranslator";
import { TagCategory } from "pages/monitoring/types/tagData";
import { NativeSelect, NativeSelectOption } from "@ui/shadCN/component/native-select";
import { ODataParams } from "@appTypes/odata";

export function TagInput<T extends TagDataBasic>({
  update,
  discard,
  disabled = false,
}: ItemEditorProps<T>) {
  const initiativeTagCategories: TagCategory[] = [
    { id: 1, name: "PoliticalContext" }, 
    { id: 2, name: "SocialContext" }
  ];

  const [tagCategories, setTagCategories] = useState<TagCategory[]>(() => 
    initiativeTagCategories.map((category) => ({
      ...category,
      name: translateTagCategory(category.name),
    }))
  );
  const [tags, setTags] = useState<ODataTagInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});
  const [searchParams] = useState<ODataParams>({
    orderby: "id asc",
  });

  const fetchTags = async (categoryId: string) => {

    const newSearchParams = {
      ...searchParams,
      filter: `category/id eq ${categoryId}`,
    };

    let tags = await getTags(newSearchParams);

    if (isMonitoringAPIError(tags)) {
      return;
    }

    tags.value.forEach(tag => {
      tag.categoryName = translateTagCategory(tag.category.name);
      tag.selectLabel = `${tag.name} - (${tag.categoryName})`;
    });

    setTags(tags);
  };

  useEffect(() => {
  }, [selectedTag]);

  const reset = useCallback(async () => {
    setInputErr({});

    if (update === null) {
      setSelectedTag(null);
      return;
    }

  }, [update]);

  useEffect(() => {
    void reset();
  }, [reset]);

  const handleSave = () => {
  };

  const handleDiscard = () => {
    if (update && discard) {
      discard();
    }
    setSelectedTag(null);

    setInputErr({});
  };

  return (
    <div className="form-input-list">
      <div>
        <NativeSelect
          id="category"
          value={selectedCategory ?? 0}
          onChange={(e) =>
            fetchTags(e.target.value)
          }
          // onBlur={categoryOnBlur}
          // disabled={!!tagId || isLoading}
          className="bg-background"
          // aria-invalid={errors.category !== undefined}
          // aria-describedby={
          //   errors.category ? "errors_category" : undefined
          // }
        >
          <NativeSelectOption
            key={"tag_category_default"}
            value=""
            disabled
          >
            {/* {uiText.form.defaultCategoryTitle} */}
          </NativeSelectOption>
          {tagCategories.map((category) => (
            <NativeSelectOption
              key={`tag_category_${category.id}`}
              value={category.id}
            >
              {category.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div>
        <LabelAndErrors
          errID="errors_tag"
          validationErrors={inputErr.tag ?? []}
          htmlFor="tag"
        >
          {inputErr?.tag && (
            <span className="sr-only">
              {uiText.initiative.module.tags.label}
            </span>
          )}
        </LabelAndErrors>

        <div className="form-input-list">
          <Combobox
            id="tag"
            items={tags?.value ?? []}
            value={selectedTag ?? 0}
            setValue={(e) => console.log(e)}
            keys={{ forValue: "id", forLabel: "selectLabel" }}
            uiText={{
              itemNotFound:
                uiText.initiative.module.tags.notFound,
              trigger: uiText.initiative.module.tags.trigger,
              inputPlaceholder:
                uiText.initiative.module.tags.placeholder,
            }}
            aria-required="true"
            aria-invalid={inputErr.tag !== undefined}
            aria-describedby={inputErr.tag ? "errors_tag" : undefined}
          />
        </div>
      </div>

      <InputListActionButtons
        update={update}
        handleSave={handleSave}
        handleDiscard={handleDiscard}
        reset={() => void reset()}
        disabled={disabled}
      />
    </div>
  );
}
