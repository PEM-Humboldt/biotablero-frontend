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

export type SearchBarComponent<T> = {
  source: keyof T;
  label: string;
  placeholder?: string;
} & (
  | { type: "text" | "number" }
  | { type: "date"; dateOperator?: "eq" | "ge" | "le" }
  | { type: "select"; values: string[] }
);
