import type { GetKeysWithStringValues } from "@appTypes/utils";
import type { ODataInitiativeUserRequest } from "pages/monitoring/types/odataResponse";

export enum JoinRequestStatus {
  UNDER_REVIEW = "UnderReview",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
}

export enum UserStateInInitiative {
  IDLE = 0,
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
  REASING,
  REMOVE,
}

export const userPosibleRoleChanges: Record<
  UserStateInInitiative,
  Partial<Record<RoleEvents, UserStateInInitiative>>
> = {
  [UserStateInInitiative.IDLE]: {},
  [UserStateInInitiative.GUEST]: {},
  [UserStateInInitiative.ADMIN]: {},
  [UserStateInInitiative.USER_LEADER]: {
    [RoleEvents.REASING]: UserStateInInitiative.USER_PARTICIPANT,
  },
  [UserStateInInitiative.USER_PARTICIPANT]: {
    [RoleEvents.REASING]: UserStateInInitiative.USER_VIEWER,
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

export function canPerformRoleStateChange(
  role: UserStateInInitiative,
  action: RoleEvents,
): boolean {
  return Boolean(userPosibleRoleChanges[role][action]);
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
