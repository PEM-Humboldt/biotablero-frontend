import { NavLink, useLocation } from "react-router";

import { cn } from "@ui/shadCN/lib/utils";
import { BREAKPOINT_FOR_PROFILE_BTN_BEHAVIOR } from "@config/global";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/shadCN/component/tooltip";

import type { SidebarItem } from "pages/monitoring/types/catalog";
import { useSidebarItems } from "pages/monitoring/hooks/useSidebarItems";

export function MonitoringSidebar() {
  const menuItems = useSidebarItems();

  return (
    <div className="isolate z-100">
      <nav className="xl:hidden! flex flex-wrap gap-1 lg:gap-2 p-1 lg:px-2 justify-center border-b border-grey-light">
        <TooltipProvider delayDuration={300}>
          {Object.entries(menuItems).map(
            ([key, { label, sr, items }], index) => (
              <ul
                key={`sidebarMenu_${key}`}
                className={cn(
                  "flex flex-wrap gap-1 w-full md:w-auto justify-center",
                  index ? "border-l border-grey-light px-1 lg:px-2" : "",
                  key === "user" &&
                    window.innerWidth <= BREAKPOINT_FOR_PROFILE_BTN_BEHAVIOR &&
                    "hidden",
                )}
                aria-label={sr}
                title={label}
              >
                {items.map((item) => (
                  <TopBarMenuItemsGroup item={item} />
                ))}
              </ul>
            ),
          )}
        </TooltipProvider>
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
              {label && (
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

function TopBarMenuItemsGroup({ item }: { item: SidebarItem }) {
  const { pathname } = useLocation();

  return (
    <li
      className={cn(
        "text-sm p-1 lg:p-2 rounded-lg hover:bg-primary cursor-pointer",
        "action" in item && item.isActive
          ? "text-accent bg-accent/10 hover:bg-accent!"
          : "text-grey-dark hover:text-primary-foreground!",
        "linkTo" in item && item.linkTo === pathname ? "bg-input" : "",
      )}
      key={`sidebarItem_${item.label}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          {"action" in item ? (
            <button
              className="cursor-pointer w-full"
              onClick={() => item.action()}
            >
              <ItemContent item={item} />
            </button>
          ) : (
            <NavLink to={item.linkTo}>
              <ItemContent item={item} />
            </NavLink>
          )}
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          className="max-w-[300px] text-center text-background! text-balance"
        >
          {item.description}
        </TooltipContent>
      </Tooltip>
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
          <ItemContent item={item} />
        ) : (
          <NavLink to={item.linkTo}>
            <ItemContent item={item} />
          </NavLink>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

const ItemContent = ({ item }: { item: SidebarItem }) => (
  <div className="text-center">
    <item.icon strokeWidth={1.5} className="mx-auto" />
    <span>{item.label}</span>
  </div>
);
