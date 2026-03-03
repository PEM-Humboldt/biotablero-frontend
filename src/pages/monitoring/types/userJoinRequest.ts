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

export const userPosibleRoleChanges: Record<
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
