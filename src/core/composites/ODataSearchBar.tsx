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
import { Button } from "@ui/shadCN/component/button";
import { SearchField } from "@composites/odataSearchBar/SearchField";
import type { SearchParentData } from "@composites/odataSearchBar/types/odataSearchBar";

export type ODataSearchBarProps<T, F> = {
  components: SearchBarComponent<T>[];
  setSearchParams: Dispatch<SetStateAction<F>>;
  className: string;
  submit?: string;
  reset?: string;
};

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
  const [parentData, setParentData] = useState<SearchParentData>({});
  const searchRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement>
  >({});

  const getSearchValues = () => {
    const filters: string[] = [];
    const searchParams: ODataParams = {};

    components.forEach((component, i) => {
      const element = searchRefs.current[`${component.source.join("-")}_${i}`];
      const value = element?.value.trim() ?? "";

      if (component.childUpdater !== undefined) {
        const { label, childUpdater } = component;
        void onParentUpdate(
          label,
          value,
          parentData,
          setParentData,
          childUpdater,
        );
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

    setParentData((oldParentData) => {
      const cleanParent = { ...oldParentData };
      for (const value in cleanParent) {
        cleanParent[value].current = [];
      }

      return cleanParent;
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
            parentData={parentData}
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

async function onParentUpdate(
  label: string,
  value: string | number,
  parentData: SearchParentData,
  parentDataUpdater: Dispatch<SetStateAction<SearchParentData>>,
  childUpdater: (
    value: string | number,
  ) => Promise<SelectValue[]> | SelectValue[],
) {
  if (value === "") {
    if (parentData[label]?.current.length > 0) {
      parentDataUpdater((oldParentData) => ({
        ...oldParentData,
        [label]: { ...oldParentData[label], current: [] },
      }));
    }
    return;
  }

  try {
    const newValues = await childUpdater(value);

    parentDataUpdater((oldCache) => {
      const updatedLabel = {
        updater: childUpdater,
        current: newValues,
      };

      return { ...oldCache, [label]: updatedLabel };
    });
  } catch (err) {
    console.error(err);
  }
}
