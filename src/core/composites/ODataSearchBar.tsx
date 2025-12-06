import {
  useRef,
  useState,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

import { debouncer } from "@utils/debouncer";
import { makeODataFilterString } from "@utils/odata";
import type {
  ODataParams,
  SearchBarComponent,
  SelectValue,
} from "@appTypes/odata";
import { Input } from "@ui/shadCN/component/input";
import { Button } from "@ui/shadCN/component/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";

type ODataSearchBarProps<T, F> = {
  components: SearchBarComponent<T>[];
  setSearchParams: Dispatch<SetStateAction<F>>;
  className: string;
  submit?: string;
  reset?: string;
};

type SearchFiledProps<T> = {
  component: SearchBarComponent<T>;
  onUpdateSearch?: () => void;
  fieldRef: (element: HTMLInputElement | HTMLSelectElement | null) => void;
  cache: SearchCache;
};

type CachedField = {
  current: SelectValue[];
  dataPool: Record<string, SelectValue[]>;
  updater: (value: string) => Promise<SelectValue[]> | SelectValue[];
};

type SearchCache = Record<string, CachedField>;

/**
 * Renders a configurable OData search bar with text and select inputs.
 * Builds an OData `$filter` query string dynamically and updates search parameters
 * either automatically (debounced) or via a submit button, depending on configuration.
 *
 * @template T - Data type representing the search context.
 *
 * @param props.components - Definitions for each search input, including label, type, data source, and optional select values.
 * @param props.setSearchParams - Function that updates the parent OData query parameters.
 * @param props.submit - Optional label for a submit button.
 *	- If omitted or empty, the component performs live search using a debounce handler.
 * @param props.reset - Optional label for a reset button.
 *	- If omitted or empty, no reset button is rendered.
 */
export function ODataSearchBar<T>({
  components,
  setSearchParams,
  className = "",
  submit = "",
  reset = "",
}: ODataSearchBarProps<T, ODataParams>) {
  const searchRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement>
  >({});
  const [cache, setCache] = useState<SearchCache>({});
  const getSearchValues = () => {
    const filters: string[] = [];
    const searchParams: ODataParams = {};

    components.forEach((component, i) => {
      const element = searchRefs.current[`${component.source.join("-")}_${i}`];
      const value = element?.value.trim() ?? "";

      if (component.childUpdater !== undefined) {
        const { label, childUpdater } = component;
        void onParentUpdate(label, value, cache, setCache, childUpdater);
      }

      const filter = makeODataFilterString(component, value);
      if (filter) {
        filters.push(filter);
      }
    });

    searchParams.filter = filters.length ? filters.join(" and ") : "";

    return searchParams;
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setSearchParams((oldParams) => ({ ...oldParams, ...getSearchValues() }));
  };

  // NOTE: con useRef no se pierde el timer de búsqueda si cambian los filtros
  const debouncedSearch = useRef(
    debouncer((searchParams: ODataParams) => {
      setSearchParams((oldParams) => ({ ...oldParams, ...searchParams }));
    }, 0.5),
  ).current;

  const onChangeHandler = () => {
    debouncedSearch(getSearchValues());
  };

  const clearSearch = () => {
    let reset = false;

    setCache((oldCache) => {
      const cleanCache = { ...oldCache };
      for (const value in cleanCache) {
        cleanCache[value].current = [];
      }

      return cleanCache;
    });

    for (const ref of Object.values(searchRefs.current)) {
      if (!ref || ref.value === "") {
        continue;
      }
      reset = true;
    }

    if (reset) {
      setSearchParams(({ filter: _filter, ...otherParams }) => otherParams);
    }
  };

  return (
    <form
      onSubmit={submitSearch}
      className={`flex flex-wrap bg-white gap-2 justify-center rounded-lg m-4 px-4 py-4 items-end ${className}`}
    >
      {components.map((component, i) => (
        <label
          key={`${component.label}_${i}`}
          className={`${i === 0 ? "flex-2" : "flex-1"} text-left text-base`}
          htmlFor={component.label}
        >
          {component.label}

          <SearchField
            fieldRef={(element) =>
              element &&
              (searchRefs.current[`${component.source.join("-")}_${i}`] =
                element)
            }
            onUpdateSearch={submit === "" ? onChangeHandler : undefined}
            component={component}
            cache={cache}
          />
        </label>
      ))}
      <div className="w-fit flex gap-2">
        {submit !== "" && (
          <Button type="submit" onClick={submitSearch}>
            {submit}
          </Button>
        )}
        {reset !== "" && (
          <Button type="reset" variant="outline" onClick={clearSearch}>
            {reset}
          </Button>
        )}
      </div>
    </form>
  );
}

// NOTE: No se usa ForwardRef pues ya está en deshuso y va a ser eliminado
function SearchField<T>({
  component,
  onUpdateSearch,
  fieldRef,
  cache,
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
        const dynamicValues = cache[component?.dependsOnLabel]?.current || [];
        values = dynamicValues;
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

async function onParentUpdate(
  label: string,
  value: string | number,
  cache: SearchCache,
  cacheUpdater: Dispatch<SetStateAction<SearchCache>>,
  childUpdater: (
    value: string | number,
  ) => Promise<SelectValue[]> | SelectValue[],
) {
  if (value === "") {
    if (cache[label]?.current.length > 0) {
      cacheUpdater((oldCache) => ({
        ...oldCache,
        [label]: { ...oldCache[label], current: [] },
      }));
    }
    return;
  }

  if (cache[label] && cache[label]?.dataPool && cache[label].dataPool[value]) {
    if (cache[label].current === cache[label].dataPool[value]) {
      return;
    }
    const newCurrent = cache[label].dataPool[value];
    const updatedLabel = { ...cache[label], current: newCurrent };
    cacheUpdater((oldCache) => ({ ...oldCache, [label]: updatedLabel }));
    return;
  }

  try {
    const newValues = await childUpdater(value);

    cacheUpdater((oldCache) => {
      const oldPool = oldCache[label]?.dataPool || {};
      const updatedLabel = {
        updater: childUpdater,
        current: newValues,
        dataPool: { ...oldPool, [value]: newValues },
      };

      return { ...oldCache, [label]: updatedLabel };
    });
  } catch (err) {
    console.error(err);
  }
}
