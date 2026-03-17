import { type ReactNode } from "react";

export type ODataResponse<T> = {
  "@odata.count": number;
  value: T[];
};

export type HasId = {
  id: number;
};

export type ODataColumn<T> = {
  name: string;
  source: keyof T;
} & (
  | {
      type: "text";
      sortBy?: boolean;
      processValue?: (value: T[keyof T]) => string;
    }
  | {
      type: "action";
      label: string;
      actions: ({ value }: { value: unknown }) => ReactNode;
    }
);

export interface ODataParams {
  filter?: string;
  select?: string;
  orderby?: `${string} asc` | `${string} desc`;
  top?: number;
  skip?: number;
  expand?: string;
  count?: boolean;
  search?: string;
}

export function isODataParams(args: unknown): args is ODataParams {
  const oDataKeys: (keyof ODataParams)[] = [
    "filter",
    "select",
    "orderby",
    "top",
    "skip",
    "expand",
    "count",
    "search",
  ];

  return (
    args !== undefined &&
    args !== null &&
    typeof args === "object" &&
    !Array.isArray(args) &&
    oDataKeys.some((key) => key in args)
  );
}

export type SelectValue = string | { value: string | number; name: string };

export type SearchBarComponent<T> = {
  source: (keyof T)[] | string[];
  label: string;
  placeholder?: string;
  oDataEntity?: string;
  childUpdater?: (
    value: string | number,
  ) => Promise<SelectValue[]> | SelectValue[];
} & (
  | { type: "text" | "number" }
  | { type: "date"; dateOperator: "eq" | "ge" | "le" }
  | { type: "select"; values: SelectValue[] | null; dependsOnLabel?: string }
);
