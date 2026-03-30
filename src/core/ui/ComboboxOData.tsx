import { useCallback, useEffect, useRef, useState } from "react";
import type { ODataParams, ODataResponse } from "@appTypes/odata";
import { debouncer } from "@utils/debouncer";
import { Combobox } from "@ui/ComboBox";
import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Ellipsis, Search } from "lucide-react";

type ComboboxODataProps<T> = {
  id?: string;
  endpoint: string;
  value: number | string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  sources: (keyof T)[];
  oDataEntity?: string;
  loadOnEmpty?: boolean;
  sourceProcess: (oDataResponse: T[]) => { value: string; label: string }[];
  fixedSearchParams?: ODataParams;
  fixedFilter?: string;
  maxItems: number; // items de top
  disabled?: boolean;
  uiText: {
    itemNotFound: string;
    trigger: string;
    inputPlaceholder: string;
    onEmptySearch?: string;
  };
  className?: string;
};

/**
 * A specialized Combobox wrapper that performs debounced server-side searching
 * against OData-compliant endpoints.
 *
 * @template T - The expected entity type from the OData service.
 *
 * @param id - Unique identifier for the DOM element.
 * @param value - The currently selected key/ID.
 * @param setValue - State dispatcher to update the selection.
 * @param endpoint - The API path for the OData service.
 * @param sources - Entity fields used to build the `contains` filter logic.
 * @param oDataEntity - Optional collection name for nested `any()` lambda queries.
 * @param loadOnEmpty - Optional, if true load load the items returned by the endpoint with no filter, it defaults to false.
 * @param sourceProcess - Callback to transform OData items into `{ value, label }` format.
 * @param fixedSearchParams - Static parameters (like $expand) merged into every request.
 * @param fixedFilter - Odata filter string injected with precedence to all querys
 * @param maxItems - The $top limit for API results.
 * @param disabled - Disables user interaction and visual state.
 * @param uiText - I18n object for not found messages, trigger labels, and placeholders.
 * @param className - Custom CSS classes for the container.
 *
 * * @remarks
 * - **Search Logic**: Automatically constructs complex OData `contains` filters
 * using the provided `sources`.
 * - **Debouncing**: Execution is delayed by 500ms to optimize API usage.
 * - **Conditional Fetching**: No requests are made if the search input is empty.
 * - **Error Handling**: Integrates with `monitoringAPI` to display service errors.
 */
export function ComboboxOData<T>({
  id,
  value,
  setValue,
  endpoint,
  sources,
  oDataEntity,
  loadOnEmpty = true,
  sourceProcess,
  fixedSearchParams,
  fixedFilter,
  maxItems,
  disabled,
  uiText,
  className,
}: ComboboxODataProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);
  const [writing, setWriting] = useState(false);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    ...(fixedSearchParams ?? {}),
    ...(fixedFilter ? { filter: fixedFilter } : {}),
    top: maxItems,
  });

  const makeODataSearchString = useCallback(
    (searchValue: string) => {
      if (searchValue === "") {
        return fixedFilter ? fixedFilter : "";
      }

      const alias = "l";
      const prefix = oDataEntity ? `${alias}/` : "";
      const filterStrings: string[] = [];

      for (const source of sources) {
        const normalizaedSource = `tolower(${prefix}${source as string})`;
        const base = `contains(${normalizaedSource}, '${searchValue.toLowerCase()}')`;
        filterStrings.push(base);
      }

      let lookFor: string = "";

      if (filterStrings.length > 0) {
        lookFor = prefix
          ? `${oDataEntity}/any(${alias}: ${filterStrings.join(" or ")})`
          : filterStrings.join(" or ");
      }

      return fixedFilter
        ? `${fixedFilter} and ${!oDataEntity ? `(${lookFor})` : lookFor}`
        : lookFor;
    },
    [fixedFilter, oDataEntity, sources],
  );

  const fetchData = useCallback(async () => {
    if (!loadOnEmpty && !searchParams.filter) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    const res = await monitoringAPI<ODataResponse<T>>({
      type: "get",
      endpoint: endpoint,
      options: { oData: searchParams },
    });

    setWriting(false);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      setIsLoading(false);
      setItems([]);
      return;
    }

    setIsLoading(false);
    setItems(sourceProcess(res.value));
  }, [endpoint, loadOnEmpty, searchParams, sourceProcess]);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      filter: makeODataSearchString(""),
    }));
  }, [makeODataSearchString]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSearch = useRef(
    debouncer((searchString: string) => {
      if (!loadOnEmpty && searchString.trim() === "") {
        setItems([]);
        setSearchParams((prev) => {
          const { filter: _, ...rest } = prev;
          return rest;
        });
        return;
      }

      setSearchParams((oldParams) => ({
        ...oldParams,
        top: maxItems,
        filter: makeODataSearchString(searchString),
      }));
    }, 0.5),
  ).current;

  return (
    <>
      <ErrorsList errorItems={errors} />
      <Combobox
        id={id}
        items={items}
        value={value}
        setValue={setValue}
        maxItems={maxItems}
        onSearchChange={(w) => {
          setWriting(true);
          handleSearch(w);
        }}
        keys={{ forValue: "value", forLabel: "label" }}
        uiText={{
          itemNotFound:
            !loadOnEmpty && !searchParams.filter
              ? (uiText?.onEmptySearch ?? "")
              : uiText.itemNotFound,
          trigger: uiText.trigger,
          inputPlaceholder: uiText.inputPlaceholder,
        }}
        disabled={disabled || isLoading}
        className={className}
        icon={writing ? Ellipsis : Search}
      />
    </>
  );
}
