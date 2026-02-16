import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type DashboardItem = {
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
} & ({ linkTo: string } | { action: () => void });

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

export type GetKeysWithStringValues<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];
