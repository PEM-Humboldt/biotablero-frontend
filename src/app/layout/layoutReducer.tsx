import type { UserType } from "types/loginUimProps";
import type { Collaborators, Names } from "types/layoutTypes";

export interface LayoutState {
  moduleName: string;
  headerNames: Names;
  user: UserType | null;
  logos: Set<Collaborators>;
  className?: string;
}

export enum UpdatedLayout {
  MODULE_NAME = "moduleName",
  SECTION_LOGOS = "sectionLogos",
  HEADER_NAMES = "headerNames",
  LOGGED_USER = "user",
  LOGGED_OUT = "out",
  CLASS_NAME = "className",
  CHANGE_SECTION = "changeSection",
}

export type LayoutActions =
  | { type: UpdatedLayout.MODULE_NAME; newName: string }
  | { type: UpdatedLayout.SECTION_LOGOS; newLogos: Set<Collaborators> }
  | { type: UpdatedLayout.HEADER_NAMES; newHeader: Partial<Names> }
  | { type: UpdatedLayout.LOGGED_USER; user: UserType }
  | { type: UpdatedLayout.LOGGED_OUT }
  | { type: UpdatedLayout.CLASS_NAME; newClass: string }
  | {
      type: UpdatedLayout.CHANGE_SECTION;
      sectionData: Pick<LayoutState, "moduleName" | "logos" | "className">;
    };

export function layoutReducer(
  state: LayoutState,
  action: LayoutActions
): LayoutState {
  switch (action.type) {
    case UpdatedLayout.MODULE_NAME:
      return { ...state, moduleName: action.newName };
    case UpdatedLayout.SECTION_LOGOS:
      return { ...state, logos: action.newLogos };
    case UpdatedLayout.HEADER_NAMES:
      return {
        ...state,
        headerNames: { ...state.headerNames, ...action.newHeader },
      };
    case UpdatedLayout.LOGGED_USER:
      return { ...state, user: action.user };
    case UpdatedLayout.LOGGED_OUT:
      return { ...state, user: null };
    case UpdatedLayout.CLASS_NAME:
      return { ...state, className: action.newClass };
    case UpdatedLayout.CHANGE_SECTION:
      return {
        ...state,
        moduleName: action.sectionData.moduleName,
        logos: action.sectionData.logos,
        className: action.sectionData.className,
        headerNames: { parent: "", child: "" },
      };
    default:
      console.warn("Unknown requested layoutReducer action");
      return state;
  }
}
