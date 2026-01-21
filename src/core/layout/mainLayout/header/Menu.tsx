import { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router";

import isFlagEnabled from "@utils/isFlagEnabled";
import Alert from "@assets/alertas-tempranas-icono.svg";
import {
  type DisplayModule,
  displayModules,
} from "core/layout/mainLayout/modules";
import { useUserCTX } from "@hooks/UserContext";
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
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  const { user } = useUserCTX();
  const { pathname } = useLocation();

  useEffect(() => {
    let isMounted = true;

    void isFlagEnabled("alertsModule").then((value: boolean) => {
      if (isMounted) {
        setShowAlerts(value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const modules = useMemo<DisplayModule[]>(() => {
    return displayModules(user?.username, user?.company?.name);
  }, [user?.username, user?.company]);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger>Módulos</NavigationMenuTrigger>
          <NavigationMenuContent className="p-3 md:p-6 border-l-6 border-l-accent">
            <div className="text-xl font-light mb-4">
              Explora nuestros módulos
            </div>
            <ul className="grid w-max gap-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {modules.map((module) => {
                return (
                  <li key={module.id}>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to={module.link}
                        className={cn(
                          "flex gap-1 items-center hover:text-accent",
                          pathname === module.link
                            ? "opacity-50"
                            : "opacity-100",
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
                );
              })}

              {showAlerts && (
                <li>
                  <NavLink to="/Alertas">
                    <img
                      src={Alert}
                      alt=""
                      className="w-9 h-9 md:w-12 md:h-12 invert"
                    />
                    Alertas Tempranas
                  </NavLink>
                </li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
