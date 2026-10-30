import { NavLink, useLocation } from "react-router";

import { cn } from "@ui/shadCN/lib/utils";
import { BREAKPOINT_PROFILE_BTN_ON_MENU } from "@config/global";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui/shadCN/component/tooltip";

import type { SidebarItem } from "pages/monitoring/types/catalog";
import { useSidebarItems } from "pages/monitoring/hooks/useSidebarItems";

export function MonitoringMenu() {
  const { items: menuItems } = useSidebarItems();
  const { pathname } = useLocation();
  const activePath = pathname.split("/").filter(Boolean);

  return (
    <div className="isolate bg-background z-100">
      <nav
        className={cn(
          // --- Móvil / Tablet ---
          "flex flex-wrap justify-center gap-1 p-1 lg:gap-2 lg:px-2",
          "border-b border-grey-light",

          // --- Escritorio ---
          "xl:h-full xl:w-[6rem] xl:flex-col xl:justify-start xl:gap-0 xl:p-0",
          "xl:border-b-0 xl:border-r xl:border-sidebar-border",
        )}
      >
        {Object.entries(menuItems).map(([key, { label, sr, items }], index) => (
          <div
            key={`sidebarGroup_${key}`}
            aria-label={sr}
            className={cn(
              // --- Móvil / Tablet ---
              "flex w-full flex-wrap justify-center gap-1 sm:w-auto border-grey-light",
              index > 0 && "border-l px-1 lg:px-2",
              key === "user" &&
                window.innerWidth < BREAKPOINT_PROFILE_BTN_ON_MENU &&
                "hidden",

              // --- Escritorio ---
              "xl:p-1 xl:min-h-0 xl:w-full xl:flex-col xl:overflow-auto xl:border-b xl:border-l-0",
            )}
          >
            {label && (
              <div className="hidden xl:block! text-center p-1 pb-0 font-medium text-sm text-grey min-w-0 truncate">
                {label}
              </div>
            )}
            <ul className="flex w-full flex-wrap justify-between sm:justify-center gap-1 xl:min-w-0 xl:flex-col">
              {items.map((item) => (
                <MonitoringMenuBtn
                  key={item.label}
                  item={item}
                  activePath={activePath}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

function MonitoringMenuBtn({
  item,
  activePath,
}: {
  item: SidebarItem;
  activePath: string[];
}) {
  const { initiativeSubPathsExclusion } = useSidebarItems();
  const isSidebar = window.innerWidth >= 1280;

  const isAction = "action" in item;
  const isActionActive = isAction && item.isActive;
  const linkPath = !isAction ? item.linkTo.split("/").filter(Boolean) : [];

  let isPathActive = false;

  if (!isAction && linkPath.length === 1) {
    isPathActive = !initiativeSubPathsExclusion.includes(activePath[1]);
  } else {
    for (let i = 0; i < linkPath.length; i++) {
      if (linkPath[i] !== activePath[i]) {
        break;
      }

      if (i === linkPath.length - 1) {
        isPathActive = true;
      }
    }
  }

  const triggerCSS = cn(
    "flex w-full items-center gap-2 rounded-md p-1 lg:p-2 lg:pt-3 hover:bg-sidebar-accent focus-visible:bg-accent/10",
    "text-sm text-grey-dark hover:bg-primary hover:text-primary-foreground",
    "justify-center font-normal cursor-pointer",
    isPathActive && "bg-input",
    isActionActive && "text-accent bg-accent/20 hover:bg-accent outline",
  );

  return (
    <li className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          {isAction ? (
            <button className={triggerCSS} onClick={() => item.action()}>
              <ItemContent item={item} />
            </button>
          ) : (
            <NavLink className={triggerCSS} to={item.linkTo}>
              <ItemContent item={item} />
            </NavLink>
          )}
        </TooltipTrigger>

        <TooltipContent
          side={isSidebar ? "right" : "bottom"}
          align="center"
          className={cn(
            "max-w-[250px] text-center text-balance",
            "xl:ml-1 xl:max-w-[320px] xl:text-left",
          )}
        >
          {item.description}
        </TooltipContent>
      </Tooltip>
    </li>
  );
}

const ItemContent = ({ item }: { item: SidebarItem }) => (
  <div>
    <item.icon
      strokeWidth={1.5}
      className="mx-auto size-4 md:size-6 shrink-0"
    />
    <span className="text-center shrink-0 truncate">{item.label}</span>
  </div>
);
