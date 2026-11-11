import { type LucideIcon } from "lucide-react";

export enum RoleInInitiative {
  GUEST = 0,
  LEADER,
  COLLABORATOR,
  READER,
}

// NOTE: se usa como valor del enum el nombre del tipo de usuario en keycloak
export enum RoleInMonitoring {
  NONE = "",
  USER = "User",
  ADMIN = "Admin",
  ALLY = "Ally",
}

export type SidebarItem = {
  label: string;
  description: string;
  icon: LucideIcon;
  group: "common" | "user" | "admin";
} & ({ linkTo: string } | { action: () => void; isActive: boolean });

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
