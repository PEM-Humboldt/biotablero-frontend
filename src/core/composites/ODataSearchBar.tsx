import type { ODataParams, SearchBarComponent } from "@appTypes/odata";
import { debouncer } from "@utils/debouncer";
import { useRef, type Dispatch, type SetStateAction } from "react";

type ODataSearchBarProps<T, F> = {
  components: SearchBarComponent<T>[];
  setSearchParams: Dispatch<SetStateAction<F>>;
};

export function ODataSearchBar<T>({
  components,
  setSearchParams,
}: ODataSearchBarProps<T, ODataParams>) {
  const searchRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement>
  >({});

  // NOTE: con useRef no se pierde el timer de búsqueda si cambian los filtros
  const debouncedSearch = useRef(
    debouncer((searchParams: ODataParams) => {
      setSearchParams((oldParams) => ({ ...oldParams, ...searchParams }));
    }, 0.5),
  ).current;

  const onChangeHandler = () => {
    const filters: string[] = [];
    const searchParams: ODataParams = {};

    components.forEach((component, i) => {
      const element = searchRefs.current[`${component.source as string}_${i}`];
      const value = element?.value;

      if (value) {
        switch (component.type) {
          case "text":
            filters.push(`contains(${component.source as string}, '${value}')`);
            break;
          case "number":
            filters.push(`${component.source as string} eq ${value}`);
            break;
          case "date": {
            const operator = component.dateOperator ?? "eq";
            filters.push(`${component.source as string} ${operator} ${value}`);
            break;
          }
          case "select":
            filters.push(`${component.source as string} eq '${value}'`);
            break;
        }
      }
    });

    searchParams.filter = filters.length ? filters.join(" and ") : "";

    debouncedSearch(searchParams);
  };

  const clearSearch = () => {
    Object.values(searchRefs.current).forEach((element) => {
      if (element) {
        element.value = "";
      }
    });

    setSearchParams({});
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
              onChange={onChangeHandler}
              onInput={onChangeHandler}
            />
          ) : (
            <select
              ref={(element) =>
                element &&
                (searchRefs.current[`${component.source as string}_${i}`] =
                  element)
              }
              name={component.label}
              onChange={onChangeHandler}
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
      <button onClick={clearSearch}>Borrar filtros</button>
    </div>
  );
}
