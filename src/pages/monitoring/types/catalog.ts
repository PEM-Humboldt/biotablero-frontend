import { type ReactNode } from "react";

export enum RoleInInitiative {
  NONE = 0,
  LEADER,
  USER,
  VIEWER,
}

export type DashboardItem = { description: string; icon: ReactNode } & (
  | { linkTo: string }
  | { action: () => void }
);

export type LocationList = {
  name: string;
  value: number;
};

export type Location = {
  id: number;
  name: string;
  code: number;
};

export type UserLevel = {
  id: RoleInInitiative;
  name: string;
};

export type UserItem = {
  id?: number;
  userName: string;
  level: UserLevel;
};

export type JoinRequestStatus = {
  id: number;
  name: string;
};
