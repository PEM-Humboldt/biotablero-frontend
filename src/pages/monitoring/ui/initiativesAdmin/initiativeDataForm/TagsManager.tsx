import { type Dispatch, type SetStateAction, useState } from "react";
import type { TagData } from "pages/monitoring/types/initiative";
import type { InitiativeDataFormErr } from "pages/monitoring/types/initiativeData";

export function TagsManger({
  title,
  sectionInfo,
  sectionUpdater,
  validationErrorsObj = {},
  submitBlocker,
}: {
  title?: string;
  sectionInfo: TagData[];
  sectionUpdater: (value: TagData[]) => void;
  validationErrorsObj: Partial<InitiativeDataFormErr["tags"]>;
  submitBlocker?:
    | Dispatch<SetStateAction<boolean>>
    | ((value: boolean) => void);
}) {
  return null;
}
