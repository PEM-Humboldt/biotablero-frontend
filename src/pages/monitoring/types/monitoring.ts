import { type ReactNode } from "react";

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
  id: number;
  name: string;
};

export type User = {
  id?: number;
  userName: string;
  level: UserLevel;
};

// NOTE: Pendiente de decidir si lo borro o no
export type GetStringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// NOTE: objeto de usuario retornado por Keycloak
export interface UserKC {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  totp: boolean;
  notBefore: number;
  userProfileMetadata: {
    attributes: Array<{
      name: string;
      displayName: string;
      required: boolean;
      readOnly: boolean;
      validators: Record<string, unknown>;
      multivalued: boolean;
    }>;
    groups: Array<{
      name: string;
      displayHeader: string;
      displayDescription: string;
    }>;
  };
  disableableCredentialTypes: string[];
  requiredActions: string[];
  access: {
    manage: boolean;
  };
}
