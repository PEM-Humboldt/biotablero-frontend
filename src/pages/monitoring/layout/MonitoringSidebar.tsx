import { NavLink, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ui/shadCN/component/sidebar";

import type { SidebarItem } from "pages/monitoring/types/catalog";
import { cn } from "@ui/shadCN/lib/utils";
import { useSidebarItems } from "pages/monitoring/hooks/useSidebarItems";

export function MonitoringSidebar() {
  const items = useSidebarItems();

  return (
    <Sidebar
      collapsible="none"
      style={{ "--sidebar-width": "6rem" } as React.CSSProperties}
      className="relative isolate z-100"
    >
      <SidebarContent>
        {Object.entries(items).map(([key, { label, sr, items }]) => (
          <SidebarGroup
            key={`sidebarGroup_${key}`}
            aria-label={sr}
            className="border-b border-grey-light"
          >
            {label !== "" && (
              <SidebarGroupLabel className="text-sm text-grey p-0 justify-center">
                {label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarItem key={`sidebarItem_${item.label}`} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarItem({ item }: { item: SidebarItem }) {
  const { pathname } = useLocation();

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
}
