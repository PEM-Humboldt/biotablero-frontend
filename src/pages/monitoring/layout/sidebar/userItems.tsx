import { UserRoundCheck, ChevronLeft } from "lucide-react";
import type { DashboardItem } from "pages/monitoring/types/catalog";

export const userItems: DashboardItem[] = [
  {
    description: "Gestión de iniciativas",
    icon: UserRoundCheck,
    linkTo: "gestionarIniciativas",
  },
];
