import { useState, useEffect, useMemo } from "react";
import { Link, NavLink } from "react-router";

import isFlagEnabled from "@utils/isFlagEnabled";
import Alert from "@assets/alertas-tempranas-icono.svg";
import {
  type DisplayModule
} from "core/layout/mainLayout/modules";
import { useUserCTX } from "@hooks/UserContext";
import { useAuth } from "core/context/AuthContext";
import { displayModules } from "@config/modules.config";

export function Menu() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  // const { user } = useUserCTX();
  const { user, isAuthenticated } = useAuth();

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

  const changeMenuState = () => {
    setOpenMenu(!openMenu);
  };

  // TODO: Setear en CSS la clase para el link activo
  const handleActiveLink = ({ isActive }: { isActive: boolean }) => {
    return { opacity: isActive ? "0.5" : "1" };
  };

    // Obtener roles del usuario
  const userRoles = user?.roles.map(role => role.toString()) || [];
  const username = user?.username || user?.email?.split('@')[0];
  const company = user?.organization;

  const modules = useMemo<DisplayModule[]>(() => {
    return displayModules(isAuthenticated,
    userRoles, username, company);
  }, [username, company]);

  return (
    <nav>
      <div id="menuToggle">
        <input type="checkbox" checked={openMenu} onChange={changeMenuState} />
        <span />
        <span />
        <span />
        <ul id="menu">
          <p>
            <strong>Explora nuestros módulos</strong>
          </p>

          {modules.map((module) => {
            return (
              <NavLink
                key={module.id}
                to={module.link}
                onClick={changeMenuState}
                style={handleActiveLink}
              >
                <li>
                  <img src={module.image} alt="" width="43" height="auto" />
                  {module.title}
                </li>
              </NavLink>
            );
          })}
          {showAlerts && (
            <Link to="/Alertas" onClick={changeMenuState}>
              <li>
                {" "}
                <img
                  src={Alert}
                  alt="Alertas Tempranas"
                  width="40"
                  height="auto"
                />
                Alertas Tempranas
              </li>
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
}
