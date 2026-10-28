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
import { BREAKPOINT_FOR_PROFILE_BTN_BEHAVIOR } from "@config/global";

export function MonitoringSidebar() {
  const menuItems = useSidebarItems();

  console.log(menuItems);
  return (
    <div className="isolate z-100">
      <nav className="xl:hidden! flex flex-wrap gap-1 lg:gap-2 p-1 lg:px-2 justify-center border-b border-grey-light">
        {Object.entries(menuItems).map(([key, { label, sr, items }], index) =>
          key === "user" &&
          window.innerWidth <= BREAKPOINT_FOR_PROFILE_BTN_BEHAVIOR ? null : (
            <ul
              key={`sidebarMenu_${key}`}
              className={cn(
                "flex gap-1 w-full *:flex-1 md:w-auto",
                index ? "border-l border-grey-light px-1 lg:px-2" : "",
              )}
              title={label}
            >
              {items.map((item) => (
                <SidebarItemSmallScreen item={item} />
              ))}
            </ul>
          ),
        )}
      </nav>

      <Sidebar
        collapsible="none"
        style={{ "--sidebar-width": "6rem" } as React.CSSProperties}
        className="relative hidden xl:block!"
      >
        <SidebarContent>
          {Object.entries(menuItems).map(([key, { label, sr, items }]) => (
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
                    <SidebarItem
                      key={`sidebarItem_${item.label}`}
                      item={item}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </div>
  );
}

//
function SidebarItemSmallScreen({ item }: { item: SidebarItem }) {
  const { pathname } = useLocation();

  const ItemContent = () => (
    <>
      <item.icon strokeWidth={1.5} />
      <span>{item.label}</span>
    </>
  );

  return (
    <li
      className={cn(
        "text-sm *:flex *:flex-col *:items-center! p-1 lg:p-2 rounded-lg",
        "action" in item && item.isActive
          ? "cursor-pointer text-accent bg-accent/10 hover:bg-accent!"
          : "cursor-pointer text-grey-dark",

        "linkTo" in item && item.linkTo === pathname ? "bg-muted" : "",
      )}
      key={`sidebarItem_${item.label}`}
    >
      {"action" in item ? (
        <button onClick={"action" in item ? () => item.action() : undefined}>
          <ItemContent />
        </button>
      ) : (
        <NavLink to={item.linkTo}>
          <ItemContent />
        </NavLink>
      )}
    </li>
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
