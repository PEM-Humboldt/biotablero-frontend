import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from "react";

import { type CardInfoGrouped } from "pages/monitoring/types/initiativeData";

export type InitiativeUpdateCtxType = {
  initiative: CardInfoGrouped | null;
  updater: null | (() => Promise<void>);
  currentEdit: keyof CardInfoGrouped | "none" | null;
  setCurrentEdit: Dispatch<
    SetStateAction<keyof CardInfoGrouped | "none" | null>
  > | null;
};

export const LeaderInitiativeUpdateCtx = createContext<InitiativeUpdateCtxType>(
  {
    initiative: null,
    updater: null,
    currentEdit: null,
    setCurrentEdit: null,
  },
);

export const AdminInitiativeUpdateCtx = createContext<InitiativeUpdateCtxType>({
  initiative: null,
  updater: null,
  currentEdit: null,
  setCurrentEdit: null,
});

export function useInitiativeDataCTX() {
  const adminContext = useContext(AdminInitiativeUpdateCtx);
  const leaderContext = useContext(LeaderInitiativeUpdateCtx);

  if (adminContext.updater) {
    return adminContext;
  }

  if (leaderContext.updater) {
    return leaderContext;
  }

  throw new Error(
    "useInitiativeData must be used within any *InitiativeUpdateCTX",
  );
}
