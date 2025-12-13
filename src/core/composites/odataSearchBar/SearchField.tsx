import type { SelectValue } from "@appTypes/odata";
import { Input } from "@ui/shadCN/component/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import type { SearchFiledProps } from "@composites/odataSearchBar/types/odataSearchBar";

export function SearchField<T>({
  component,
  onUpdateSearch,
  fieldRef,
  parentData,
}: SearchFiledProps<T>) {
  const commonParams = {
    ref: fieldRef,
    name: component.label,
    id: component.label,
    placeholder: component.placeholder ?? "",
    type: component.type,
  };

  switch (component.type) {
    case "select": {
      let values: SelectValue[];

      if (component.dependsOnLabel !== undefined) {
        values = parentData[component?.dependsOnLabel]?.current || [];
      } else {
        values = component.values || [];
      }

      const disable = values.length === 0;

      return (
        <NativeSelect
          {...commonParams}
          onChange={onUpdateSearch}
          disabled={disable}
        >
          <NativeSelectOption value="">
            {component.placeholder ?? ""}
          </NativeSelectOption>

          {values.map((item, i) => {
            const key = typeof item === "string" ? item : item.value;
            return <Option key={`${key}_${i}`} listItem={item} />;
          })}
        </NativeSelect>
      );
    }

    case "text":
    case "number":
      return <Input onChange={onUpdateSearch} {...commonParams} />;

    case "date":
      return <Input onInput={onUpdateSearch} {...commonParams} />;
  }
}

function Option({ listItem }: { listItem: SelectValue }) {
  const isString = typeof listItem === "string";
  const value = isString ? listItem : listItem.value;
  const name = isString ? listItem : listItem.name;

  return <NativeSelectOption value={value ?? name}>{name}</NativeSelectOption>;
}
