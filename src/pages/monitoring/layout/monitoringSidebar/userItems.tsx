import { UserRoundCheck } from "lucide-react";
import type { DashboardItem } from "pages/monitoring/types/catalog";

export const userItems: DashboardItem[] = [
  {
    label: "Mi Perfil",
    description: "Gestiona tu perfil y las iniciativas en las que participas",
    icon: UserRoundCheck,
    linkTo: "MiPerfil",
  },
];
