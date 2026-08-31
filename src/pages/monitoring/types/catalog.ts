import { type LucideIcon } from "lucide-react";

export enum RoleInInitiative {
  GUEST = 0,
  LEADER,
  COLLABORATOR,
  READER,
}

// NOTE: se usa como valor del enum el nombre que se le da
// al tipo de usuario en el keycloak
export enum RoleInMonitoring {
  NONE = "",
  USER = "User",
  ADMIN = "Admin",
}

export type SidebarItem = {
  label: string;
  description: string;
  icon: LucideIcon;
  group: number;
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
