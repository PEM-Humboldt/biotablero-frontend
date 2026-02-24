import { UserRoundCheck, ChevronLeft } from "lucide-react";
import type { DashboardItem } from "pages/monitoring/types/monitoring";

export const userItems: DashboardItem[] = [
  {
    description: "Dashboard",
    icon: ChevronLeft,
    linkTo: "Dashboard",
  },
  {
    description: "Gestión de iniciativas",
    icon: UserRoundCheck,
    linkTo: "gestionarIniciativas",
  },
];
