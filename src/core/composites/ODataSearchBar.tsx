import { useRef, type Dispatch, type SetStateAction } from "react";

import { debouncer } from "@utils/debouncer";
import { MakeODataFilterString } from "@utils/odata";
import type { ODataParams, SearchBarComponent } from "@appTypes/odata";

type ODataSearchBarProps<T, F> = {
  components: SearchBarComponent<T>[];
  setSearchParams: Dispatch<SetStateAction<F>>;
  submit: string;
  reset: string;
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
  submit = "",
  reset = "",
}: ODataSearchBarProps<T, ODataParams>) {
  const searchRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement>
  >({});

  const getSearchValues = () => {
    const filters: string[] = [];
    const searchParams: ODataParams = {};

    components.forEach((component, i) => {
      const element = searchRefs.current[`${component.source as string}_${i}`];
      const value = element?.value.trim() ?? "";

      const filter = MakeODataFilterString(component, value);
      if (filter) {
        filters.push(filter);
      }
    });

    searchParams.filter = filters.length ? filters.join(" and ") : "";
    return searchParams;
  };

  const submitSearch = () => {
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

    for (const ref of Object.values(searchRefs.current)) {
      if (!ref || ref.value === "") {
        continue;
      }
      reset = true;
      ref.value = "";
    }

    if (reset) {
      setSearchParams(({ filter: _filter, ...otherParams }) => otherParams);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {components.map((component, i) => (
        <label key={`${component.label}_${i}`}>
          {component.label}

          {component.type !== "select" ? (
            <input
              ref={(element) =>
                element &&
                (searchRefs.current[`${component.source as string}_${i}`] =
                  element)
              }
              type={component.type}
              placeholder={component.placeholder ?? ""}
              onChange={submit === "" ? onChangeHandler : undefined}
              onInput={submit === "" ? onChangeHandler : undefined}
            />
          ) : (
            <select
              ref={(element) =>
                element &&
                (searchRefs.current[`${component.source as string}_${i}`] =
                  element)
              }
              name={component.label}
              onChange={submit === "" ? onChangeHandler : undefined}
            >
              <option></option>
              {component.values.map((value, i) => (
                <option key={`${value}_${i}`} value={value}>
                  {value}
                </option>
              ))}
            </select>
          )}
        </label>
      ))}
      {submit !== "" && <button onClick={submitSearch}>{submit}</button>}
      {reset !== "" && <button onClick={clearSearch}>{reset}</button>}
    </div>
  );
}
