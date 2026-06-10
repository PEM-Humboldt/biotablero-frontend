import { NavLink, useLocation } from "react-router";

import { useUserCTX } from "@hooks/UserCTX";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@ui/shadCN/component/sidebar";

import type { DashboardItem } from "pages/monitoring/types/catalog";
import { userItems } from "pages/monitoring/layout/monitoringSidebar/userItems";
import { adminItems } from "pages/monitoring/layout/monitoringSidebar/adminItems";
import { useGeneralItems } from "pages/monitoring/layout/monitoringSidebar/generalItems";
import { cn } from "@ui/shadCN/lib/utils";

export function MonitoringSidebar() {
  const { user } = useUserCTX();
  const roles = user ? user.roles : [];
  const isAdmin = roles.includes("Admin");
  const isUser = roles.includes("User");

  const generalItems = useGeneralItems();

  return (
    <Sidebar
      collapsible="none"
      style={{ "--sidebar-width": "6rem" } as React.CSSProperties}
      className="relative isolate z-100"
    >
      <SidebarContent>
        <SidebarGroupButtons items={generalItems} />

        {isUser && (
          <>
            <SidebarSeparator />
            <SidebarGroupButtons items={userItems} />
          </>
        )}
        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroupButtons title="Administrar" items={adminItems} />
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarGroupButtons({
  title,
  items,
}: {
  title?: string;
  items: DashboardItem[];
}) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      {title && (
        <SidebarGroupLabel className="text-sm text-muted-foreground p-0 justify-center">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.description}>
                <SidebarMenuButton
                  asChild={!("action" in item)}
                  variant="monitoring"
                  size="monitoring"
                  tooltip={item.description}
                  isActive={"linkTo" in item && item.linkTo === pathname}
                  className={cn(
                    "action" in item && item.isActive
                      ? "cursor-pointer text-accent bg-accent/10 hover:bg-accent!"
                      : "cursor-pointer",
                  )}
                  onClick={"action" in item ? () => item.action() : undefined}
                >
                  {"action" in item ? (
                    <>
                      <item.icon strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </>
                  ) : (
                    <NavLink to={item.linkTo}>
                      <item.icon strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </NavLink>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
