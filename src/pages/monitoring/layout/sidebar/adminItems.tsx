import { ChevronLeft, Logs, UserRoundCog } from "lucide-react";
import type { DashboardItem } from "pages/monitoring/types/catalog";

export const adminItems: DashboardItem[] = [
  {
    description: "Dashboard",
    icon: ChevronLeft,
    linkTo: "Dashboard",
  },
  {
    description: "Administrador de iniciativas",
    icon: UserRoundCog,
    linkTo: "administrarIniciativas",
  },
  {
    description: "Registros de actividad",
    icon: Logs,
    linkTo: "logs",
  },
];
