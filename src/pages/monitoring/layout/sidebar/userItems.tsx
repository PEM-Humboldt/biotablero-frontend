import { UserRoundCheck, ChevronLeft, Send } from "lucide-react";
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
  {
    description: "Invitaciones a unirse a iniciativas",
    icon: Send,
    linkTo: "invitacionIniciativa",
  },
];
