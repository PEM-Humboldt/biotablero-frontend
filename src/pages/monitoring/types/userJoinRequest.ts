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
  NO_INITIATIVE = "no_initiative",
  IDLE = "idle",
  GUEST = "guest",
  ADMIN = "admin",
  USER_NONE = "user_none",
  USER_LEADER = "user_leader",
  USER_PARTICIPANT = "user_participant",
  USER_VIEWER = "user_viewer",
  USER_ASPIRING = "user_aspiring",
}

export enum RoleEvents {
  PROMOTE = "promote",
  REASING = "reasing",
  REMOVE = "remove",
}

export const initiativeRoleToState: Record<
  RoleInInitiative,
  UserStateInInitiative
> = {
  [RoleInInitiative.GUEST]: UserStateInInitiative.USER_NONE,
  [RoleInInitiative.LEADER]: UserStateInInitiative.USER_LEADER,
  [RoleInInitiative.COLLABORATOR]: UserStateInInitiative.USER_PARTICIPANT,
  [RoleInInitiative.READER]: UserStateInInitiative.USER_VIEWER,
};

export const stateToInitiativeRole: Partial<
  Record<UserStateInInitiative, RoleInInitiative>
> = {
  [UserStateInInitiative.NO_INITIATIVE]: RoleInInitiative.GUEST,
  [UserStateInInitiative.IDLE]: RoleInInitiative.GUEST,
  [UserStateInInitiative.GUEST]: RoleInInitiative.GUEST,
  [UserStateInInitiative.ADMIN]: RoleInInitiative.GUEST,
  [UserStateInInitiative.USER_NONE]: RoleInInitiative.GUEST,
  [UserStateInInitiative.USER_LEADER]: RoleInInitiative.LEADER,
  [UserStateInInitiative.USER_PARTICIPANT]: RoleInInitiative.COLLABORATOR,
  [UserStateInInitiative.USER_VIEWER]: RoleInInitiative.READER,
  [UserStateInInitiative.USER_ASPIRING]: RoleInInitiative.GUEST,
};

export const userPossibleRoleChanges: Record<
  UserStateInInitiative,
  Map<RoleEvents, UserStateInInitiative>
> = {
  [UserStateInInitiative.NO_INITIATIVE]: new Map(),
  [UserStateInInitiative.IDLE]: new Map(),
  [UserStateInInitiative.GUEST]: new Map(),
  [UserStateInInitiative.ADMIN]: new Map(),
  [UserStateInInitiative.USER_LEADER]: new Map([
    [RoleEvents.REASING, UserStateInInitiative.USER_PARTICIPANT],
  ]),
  [UserStateInInitiative.USER_PARTICIPANT]: new Map([
    [RoleEvents.PROMOTE, UserStateInInitiative.USER_LEADER],
    [RoleEvents.REASING, UserStateInInitiative.USER_VIEWER],
    [RoleEvents.REMOVE, UserStateInInitiative.USER_NONE],
  ]),
  [UserStateInInitiative.USER_VIEWER]: new Map([
    [RoleEvents.PROMOTE, UserStateInInitiative.USER_PARTICIPANT],
    [RoleEvents.REMOVE, UserStateInInitiative.USER_NONE],
  ]),
  [UserStateInInitiative.USER_ASPIRING]: new Map([
    [RoleEvents.PROMOTE, UserStateInInitiative.USER_PARTICIPANT],
    [RoleEvents.REMOVE, UserStateInInitiative.USER_NONE],
  ]),
  [UserStateInInitiative.USER_NONE]: new Map([
    [RoleEvents.PROMOTE, UserStateInInitiative.USER_ASPIRING],
  ]),
};

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

export type FilterJoinRequestSettings = {
  label: string;
  status: JoinRequestStatus;
  sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>;
  newerFirst: boolean;
};
