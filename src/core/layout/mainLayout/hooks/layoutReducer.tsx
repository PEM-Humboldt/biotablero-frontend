import type { UserType } from "core/types/user";
import type { Collaborators, Names } from "core/types/layout";

export interface LayoutState {
  moduleName: string;
  headerNames: Names;
  user: UserType | null;
  logos: Set<Collaborators>;
  className?: string;
}

export enum LayoutUpdated {
  MODULE_NAME = "moduleName",
  SECTION_LOGOS = "sectionLogos",
  HEADER_NAMES = "headerNames",
  CLASS_NAME = "className",
  CHANGE_SECTION = "changeSection",
  LOGGED_USER = "loggedIn",
  LOGGED_OUT = "loggedOut",
}

export type LayoutActions =
  | { type: LayoutUpdated.MODULE_NAME; newName: string }
  | { type: LayoutUpdated.SECTION_LOGOS; newLogos: Set<Collaborators> }
  | { type: LayoutUpdated.HEADER_NAMES; newHeader: Partial<Names> }
  | { type: LayoutUpdated.CLASS_NAME; newClass: string }
  | {
      type: LayoutUpdated.CHANGE_SECTION;
      sectionData: Pick<LayoutState, "moduleName" | "logos" | "className">;
    };

export function layoutReducer(
  state: LayoutState,
  action: LayoutActions,
): LayoutState {
  switch (action.type) {
    case LayoutUpdated.MODULE_NAME:
      return { ...state, moduleName: action.newName };
    case LayoutUpdated.SECTION_LOGOS:
      return { ...state, logos: action.newLogos };
    case LayoutUpdated.HEADER_NAMES:
      return {
        ...state,
        headerNames: { ...state.headerNames, ...action.newHeader },
      };
    case LayoutUpdated.CLASS_NAME:
      return { ...state, className: action.newClass };
    case LayoutUpdated.CHANGE_SECTION:
      return {
        ...state,
        moduleName: action.sectionData.moduleName,
        logos: action.sectionData.logos,
        className: action.sectionData.className,
        headerNames: { title: "", subtitle: "" },
      };
    default:
      console.warn("Unknown requested layoutReducer action");
      return state;
  }
}
