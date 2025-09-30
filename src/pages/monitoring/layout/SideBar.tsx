import { useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  HomeOutlined,
  SlideshowOutlined,
  ContactSupportOutlined,
  SearchOutlined,
  SettingsApplicationsOutlined,
  DashboardCustomize,
} from "@mui/icons-material";

import { useUserCTX } from "app/UserContext";
import type { DashboardItem } from "pages/monitoring/dashboard/types";
import { DashboardButtons } from "pages/monitoring/dashboard/DashboardButtons";

const drawerWidth = 400;
const collapsedWidth = 60;

export function SideBar() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleDrawer = () => setCollapsed((prev) => !prev);
  const { user } = useUserCTX();
  const role = user ? user.roles[0] : null;

  const items: DashboardItem[] = [
    { description: "Inicio", icon: <HomeOutlined />, linkTo: "/Monitoreo" },
    { description: "Buscar", icon: <SearchOutlined />, linkTo: "/" },
    { description: "Tutorial", icon: <SlideshowOutlined />, linkTo: "/" },
    {
      description: "Preguntas Frecuentes",
      icon: <ContactSupportOutlined />,
      linkTo: "/",
    },
  ];

  const userItems: DashboardItem[] = [
    {
      description: "Dashboard",
      icon: <DashboardCustomize />,
      linkTo: "Dashboard/user",
    },
  ];

  const adminItems: DashboardItem[] = [
    {
      description: "Dashboard",
      icon: <SettingsApplicationsOutlined />,
      linkTo: "Dashboard/admin",
    },
  ];

  const renderAdminTools = role === "Admin";
  const renderUserTools = role === "User";

  return (
    <Box className="sidebar-root">
      <Paper
        className="sidebar-paper"
        elevation={3}
        style={{
          width: collapsed ? collapsedWidth : drawerWidth,
        }}
      >
        <DashboardButtons
          items={items}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {renderUserTools && (
          <DashboardButtons
            items={userItems}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        )}

        {renderAdminTools && (
          <DashboardButtons
            items={adminItems}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        )}
      </Paper>

      <Box
        className="sidebar-toggle"
        style={{
          left: collapsed ? collapsedWidth - 12 : drawerWidth - 12,
        }}
      >
        <IconButton size="small" onClick={toggleDrawer}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
    </Box>
  );
}
