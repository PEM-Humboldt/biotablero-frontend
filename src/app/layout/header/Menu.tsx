import { useState, useEffect, useMemo } from "react";
import { Link, NavLink } from "react-router";

import isFlagEnabled from "utils/isFlagEnabled";
import Alerta from "images/alertas-tempranas-icono.svg";
import { type DisplayModule, displayModules } from "app/layout/modules";
import { useUserCTX } from "app/UserContext";

export function Menu() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  const { user } = useUserCTX();

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

  const modules = useMemo<DisplayModule[]>(() => {
    return displayModules(user?.username, user?.company?.name);
  }, [user?.username, user?.company]);

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
                  src={Alerta}
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
