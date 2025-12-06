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
