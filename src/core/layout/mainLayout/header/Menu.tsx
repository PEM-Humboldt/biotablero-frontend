import { NavLink, useLocation } from "react-router";

import { useVisibleModules } from "@hooks/useVisibleModules";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@ui/shadCN/component/navigation-menu";

import { cn } from "@ui/shadCN/lib/utils";

export function Menu() {
  const { pathname } = useLocation();

  const modules = useVisibleModules();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Módulos</NavigationMenuTrigger>

          <NavigationMenuContent className="p-3 md:p-6 border-l-6 border-l-accent">
            <div className="text-xl font-light mb-4">
              Explora nuestros módulos
            </div>

            <ul className="grid w-max gap-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {modules.map((module) => (
                <li key={module.id}>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to={module.link}
                      className={cn(
                        "flex gap-1 items-center hover:text-accent",
                        pathname === module.link ? "opacity-50" : "opacity-100",
                      )}
                    >
                      <img
                        src={module.image}
                        alt=""
                        className="w-9 h-9 md:w-12 md:h-12 invert"
                      />

                      <span className="text-lg font-normal">
                        {module.title}
                      </span>
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
