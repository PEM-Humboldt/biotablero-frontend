import { Logs, Tags, UserRoundCog } from "lucide-react";
import type { DashboardItem } from "pages/monitoring/types/catalog";

export const adminItems: DashboardItem[] = [
  {
    description: "Administrador de iniciativas",
    icon: UserRoundCog,
    linkTo: "administrarIniciativas",
  },
  {
    description: "Administrador de etiquetas",
    icon: Tags,
    linkTo: "administrarEtiquetas",
  },
  {
    description: "Registros de actividad",
    icon: Logs,
    linkTo: "logs",
  },
];
