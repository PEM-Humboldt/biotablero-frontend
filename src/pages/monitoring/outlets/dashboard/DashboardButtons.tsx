import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import type { DashboardItem } from "pages/monitoring/types/monitoring";

type DashboardButtonsProps = {
  items: DashboardItem[];
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};

export function DashboardButtons({
  items,
  collapsed,
  setCollapsed,
}: DashboardButtonsProps) {
  const navigate = useNavigate();
  const clickAction = (item: DashboardItem) => {
    setCollapsed(true);
    if ("action" in item) {
      item.action();
    } else {
      void navigate(item.linkTo);
    }
  };

  return (
    <List className="sidebar-list">
      {items.map((item) => {
        const { description, icon } = item;
        return (
          <Tooltip
            key={description}
            title={collapsed ? description : ""}
            placement="right"
            arrow
          >
            <ListItem disablePadding>
              <ListItemButton
                className="sidebar-button"
                onClick={() => clickAction(item)}
              >
                <ListItemIcon
                  className={
                    collapsed
                      ? "sidebar-icon sidebar-icon-collapsed"
                      : "sidebar-icon"
                  }
                >
                  {icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={description} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        );
      })}
    </List>
  );
}
