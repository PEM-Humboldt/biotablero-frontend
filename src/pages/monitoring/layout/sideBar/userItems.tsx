import { DashboardCustomize } from "@mui/icons-material";
import type { DashboardItem } from "pages/monitoring/types/monitoring";

export const userItems: DashboardItem[] = [
  {
    description: "Dashboard",
    icon: <DashboardCustomize />,
    linkTo: "Dashboard",
  },
];
