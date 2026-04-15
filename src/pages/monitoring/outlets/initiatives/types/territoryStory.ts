import { type Dispatch, type SetStateAction } from "react";

export enum PanelState {
  CREATE = "create",
  READ = "read",
  MANAGE = "manage",
}

export type PanelComponentProp = {
  moveToPanel?: Dispatch<SetStateAction<PanelState>>;
};
