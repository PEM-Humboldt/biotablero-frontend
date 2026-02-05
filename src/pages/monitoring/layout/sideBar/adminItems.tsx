import {
  SettingsApplicationsOutlined,
  DockOutlined,
} from "@mui/icons-material";
import { InitiativesAdministrationIcon } from "@ui/IconsMonitoringSidebar";
import type { DashboardItem } from "pages/monitoring/types/monitoring";

export const adminItems: DashboardItem[] = [
  {
    description: "Dashboard",
    icon: <SettingsApplicationsOutlined />,
    linkTo: "Dashboard",
  },
  {
    description: "Administrar Iniciativas",
    icon: <InitiativesAdministrationIcon />,
    linkTo: "administrarIniciativas",
  },
  {
    description: "Logs",
    icon: <DockOutlined />,
    linkTo: "logs",
  },
];
