import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  HomeOutlined,
  SlideshowOutlined,
  ContactSupportOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useUserCTX } from "app/UserContext";

const drawerWidth = 200;
const collapsedWidth = 60;

export function SideBar() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleDrawer = () => setCollapsed((prev) => !prev);
  const { user } = useUserCTX();

  const items = [
    { text: "Inicio", icon: <HomeOutlined /> },
    { text: "Buscar", icon: <SearchOutlined /> },
    { text: "Tutorial", icon: <SlideshowOutlined /> },
    { text: "Preguntas Frecuentes", icon: <ContactSupportOutlined /> },
  ];

  if (user !== null) {
    items.push({ text: "Admin usuario", icon: <SlideshowOutlined /> });
  }

  return (
    <Box className="sidebar-root">
      <Paper
        className="sidebar-paper"
        elevation={3}
        style={{
          width: collapsed ? collapsedWidth : drawerWidth,
        }}
      >
        <List className="sidebar-list">
          {items.map(({ text, icon }) => (
            <Tooltip
              key={text}
              title={collapsed ? text : ""}
              placement="right"
              arrow
            >
              <ListItem disablePadding>
                <ListItemButton className="sidebar-button">
                  <ListItemIcon
                    className={
                      collapsed
                        ? "sidebar-icon sidebar-icon-collapsed"
                        : "sidebar-icon"
                    }
                  >
                    {icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={text} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
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
