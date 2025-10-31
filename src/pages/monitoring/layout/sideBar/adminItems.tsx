import {
  SettingsApplicationsOutlined,
  DockOutlined,
} from "@mui/icons-material";
import type { DashboardItem } from "pages/monitoring/types/monitoring";

export const adminItems: DashboardItem[] = [
  {
    description: "Dashboard",
    icon: <SettingsApplicationsOutlined />,
    linkTo: "Dashboard/admin",
  },
  {
    description: "Logs",
    icon: <DockOutlined />,
    linkTo: "Dashboard/admin/logs",
  },
];
