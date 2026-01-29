import { DashboardCustomize } from "@mui/icons-material";
import { UserRoundCheck } from "lucide-react";

import type { DashboardItem } from "pages/monitoring/types/monitoring";

export const userItems: DashboardItem[] = [
  {
    description: "Dashboard",
    icon: <UserRoundCheck />,
    linkTo: "gestionarIniciativas",
  },
  {
    description: "Dashboard",
    icon: <DashboardCustomize />,
    linkTo: "Dashboard",
  },
];
