import type { SearchBarComponent, SelectValue } from "@appTypes/odata";

export type SearchFiledProps<T> = {
  component: SearchBarComponent<T>;
  onUpdateSearch?: () => void;
  fieldRef: (element: HTMLInputElement | HTMLSelectElement | null) => void;
  parentData: SearchParentData;
};

export type ParentField = {
  current: SelectValue[];
  updater: (value: string) => Promise<SelectValue[]> | SelectValue[];
};

export type SearchParentData = Record<string, ParentField>;
