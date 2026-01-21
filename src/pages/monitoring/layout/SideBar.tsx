import { useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import { useUserCTX } from "@hooks/UserContext";
import { DashboardButtons } from "pages/monitoring/layout/sideBar/DashboardButtons";
import { generalItems } from "pages/monitoring/layout/sideBar/generalItems";
import { userItems } from "pages/monitoring/layout/sideBar/userItems";
import { adminItems } from "pages/monitoring/layout/sideBar/adminItems";

const drawerWidth = 400;
const collapsedWidth = 60;

export function SideBar() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleDrawer = () => setCollapsed((prev) => !prev);
  const { user } = useUserCTX();
  const role = user ? user.roles[0] : null;

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
          items={generalItems}
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
