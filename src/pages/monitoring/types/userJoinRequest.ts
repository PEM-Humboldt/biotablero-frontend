import type { GetKeysWithStringValues } from "@appTypes/utils";
import type { ODataInitiativeUserRequest } from "pages/monitoring/types/odataResponse";
import { RoleInInitiative } from "pages/monitoring/types/catalog";

export enum JoinRequestStatus {
  UNDER_REVIEW = "UnderReview",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
}

export enum UserStateInInitiative {
  NO_INITIATIVE = 0,
  IDLE,
  GUEST,
  ADMIN,
  USER_NONE,
  USER_LEADER,
  USER_PARTICIPANT,
  USER_VIEWER,
  USER_ASPIRING,
}

export enum RoleEvents {
  PROMOTE = 0,
  REASIGN,
  REMOVE,
}

export const initiativeRoleToState: Record<
  RoleInInitiative,
  UserStateInInitiative
> = {
  [RoleInInitiative.NONE]: UserStateInInitiative.USER_NONE,
  [RoleInInitiative.LEADER]: UserStateInInitiative.USER_LEADER,
  [RoleInInitiative.USER]: UserStateInInitiative.USER_PARTICIPANT,
  [RoleInInitiative.VIEWER]: UserStateInInitiative.USER_VIEWER,
};

export const stateToInitiativeRole: Partial<
  Record<UserStateInInitiative, RoleInInitiative>
> = {
  [UserStateInInitiative.NO_INITIATIVE]: RoleInInitiative.NONE,
  [UserStateInInitiative.IDLE]: RoleInInitiative.NONE,
  [UserStateInInitiative.GUEST]: RoleInInitiative.NONE,
  [UserStateInInitiative.ADMIN]: RoleInInitiative.NONE,
  [UserStateInInitiative.USER_NONE]: RoleInInitiative.NONE,
  [UserStateInInitiative.USER_LEADER]: RoleInInitiative.LEADER,
  [UserStateInInitiative.USER_PARTICIPANT]: RoleInInitiative.USER,
  [UserStateInInitiative.USER_VIEWER]: RoleInInitiative.VIEWER,
  [UserStateInInitiative.USER_ASPIRING]: RoleInInitiative.NONE,
};

export const userPossibleRoleChanges: Record<
  UserStateInInitiative,
  Partial<Record<RoleEvents, UserStateInInitiative>>
> = {
  [UserStateInInitiative.NO_INITIATIVE]: {},
  [UserStateInInitiative.IDLE]: {},
  [UserStateInInitiative.GUEST]: {},
  [UserStateInInitiative.ADMIN]: {},
  [UserStateInInitiative.USER_LEADER]: {
    [RoleEvents.REASIGN]: UserStateInInitiative.USER_PARTICIPANT,
  },
  [UserStateInInitiative.USER_PARTICIPANT]: {
    [RoleEvents.REASIGN]: UserStateInInitiative.USER_VIEWER,
    [RoleEvents.REMOVE]: UserStateInInitiative.USER_NONE,
    [RoleEvents.PROMOTE]: UserStateInInitiative.USER_LEADER,
  },
  [UserStateInInitiative.USER_VIEWER]: {
    [RoleEvents.PROMOTE]: UserStateInInitiative.USER_PARTICIPANT,
    [RoleEvents.REMOVE]: UserStateInInitiative.USER_NONE,
  },
  [UserStateInInitiative.USER_ASPIRING]: {
    [RoleEvents.PROMOTE]: UserStateInInitiative.USER_PARTICIPANT,
    [RoleEvents.REMOVE]: UserStateInInitiative.USER_NONE,
  },
  [UserStateInInitiative.USER_NONE]: {
    [RoleEvents.PROMOTE]: UserStateInInitiative.USER_ASPIRING,
  },
};

export function canPerformRoleStateEvent(
  role: UserStateInInitiative,
  action: RoleEvents,
): boolean {
  return Boolean(userPossibleRoleChanges[role][action]);
}

export type UserJoinRequestData = {
  id: number;
  initiativeId: number;
  userName: string;
  creationDate: Date;
  responseDate: Date | null;
  status: {
    id: number;
    name: JoinRequestStatus;
  };
};

export type FilterJoinRequestsCallback = (
  status: JoinRequestStatus,
  sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
  newerFirst?: boolean,
  force?: boolean,
) => Promise<void>;

export type FilterJoinRequestSettings = {
  label: string;
  status: JoinRequestStatus;
  sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>;
  newerFirst: boolean;
};
