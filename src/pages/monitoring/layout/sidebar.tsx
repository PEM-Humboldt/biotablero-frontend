import { NavLink } from "react-router";

import { useUserCTX } from "@hooks/UserContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@ui/shadCN/component/sidebar";

import { generalItems } from "pages/monitoring/layout/sidebar/generalItems";
import type { DashboardItem } from "pages/monitoring/types/monitoring";
import { userItems } from "pages/monitoring/layout/sidebar/userItems";
import { adminItems } from "pages/monitoring/layout/sidebar/adminItems";

export function MonitoringSidebar({ className }: { className: string }) {
  const { user } = useUserCTX();
  const role = user ? user.roles[0] : null;
  const isAdmin = role === "Admin";
  const isUser = role === "User";

  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarContent>
        <SidebarGroupButtons title="Application" items={generalItems} />
        {isUser && (
          <SidebarGroupButtons title="Usuario registrado" items={userItems} />
        )}
        {isAdmin && (
          <SidebarGroupButtons title="Adminisrtradores" items={adminItems} />
        )}
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarGroupButtons({
  title,
  items,
}: {
  title: string;
  items: DashboardItem[];
}) {
  const { setOpen } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.description}>
              <SidebarMenuButton
                asChild
                size="lg"
                variant="outline"
                tooltip={item.description}
              >
                <NavLink
                  onClick={() => {
                    setOpen(false);
                    if ("action" in item) {
                      item.action();
                    }
                  }}
                  to={"action" in item ? "#" : item.linkTo}
                >
                  <item.icon strokeWidth={1.5} />
                  <span>{item.description}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
