import { type ReactNode } from "react";

export type DashboardItem = { description: string; icon: ReactNode } & (
  | { linkTo: string }
  | { action: () => void }
);

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
