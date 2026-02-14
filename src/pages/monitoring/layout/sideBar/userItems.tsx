import { DashboardCustomize } from "@mui/icons-material";
import { UserRoundCheck } from "lucide-react";

import type { DashboardItem } from "pages/monitoring/types/catalog";

export const userItems: DashboardItem[] = [
  {
    description: "Initiatives",
    icon: <UserRoundCheck />,
    linkTo: "gestionarIniciativas",
  },
  {
    description: "Dashboard",
    icon: <DashboardCustomize />,
    linkTo: "Dashboard",
  },
];
