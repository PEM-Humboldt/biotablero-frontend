import { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AppContext, type AppContextValue } from "app/AppContext";
import isFlagEnabled from "utils/isFlagEnabled";

import Consultasgeograficas from "images/consulta-geografica-logo.svg";
import Indicadores from "images/indicadores-biodiversidad-icono.svg";
import Portafolio from "images/portafolio-icono.svg";
import Comunitario from "images/monitoreo-comunitario-icono.svg";
import Compensacion from "images/compensacion-ambiental-icono.svg";
import Alerta from "images/alertas-tempranas-icono.svg";

export function Menu() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showAlerts, setShowAlerts] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    isFlagEnabled("alertsModule").then((value: boolean) => {
      if (isMounted) setShowAlerts(value);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const changeMenuState = () => {
    setOpenMenu(!openMenu);
  };

  const context = useContext(AppContext);
  const { user } = context as AppContextValue;

  // TODO: Setear en CSS la clase para el link activo
  const handleActiveLink = ({ isActive }: { isActive: boolean }) => {
    return { opacity: isActive ? "0.5" : "1" };
  };

  return (
    <div id="menuToggle">
      <input type="checkbox" checked={openMenu} onChange={changeMenuState} />
      <span />
      <span />
      <span />
      <ul id="menu">
        <p>
          <strong>Explora nuestros módulos</strong>
        </p>

        <NavLink
          to="/Consultas"
          onClick={changeMenuState}
          style={handleActiveLink}
        >
          <li>
            {" "}
            <img
              src={Consultasgeograficas}
              alt="Consultas geográficas"
              width="43"
              height="auto"
            />
            Consultas Geográficas
          </li>
        </NavLink>
        <NavLink
          to="/Monitoreo"
          onClick={changeMenuState}
          style={handleActiveLink}
        >
          <li>
            {" "}
            <img
              src={Comunitario}
              alt="Monitoreo Comunitario"
              width="43"
              height="auto"
            />
            Monitoreo Comunitario
          </li>
        </NavLink>
        <NavLink
          to="/Indicadores"
          onClick={changeMenuState}
          style={handleActiveLink}
        >
          <li>
            {" "}
            <img
              src={Indicadores}
              alt="Indicadores de Biodiversidad"
              width="40"
              height="auto"
            />
            Indicadores de Biodiversidad
          </li>
        </NavLink>
        {user && (
          <NavLink
            to="/GEB/Compensaciones"
            onClick={changeMenuState}
            style={handleActiveLink}
          >
            <li>
              {" "}
              <img
                src={Compensacion}
                alt="Compensaciones"
                width="40"
                height="auto"
              />
              Compensaciones
            </li>
          </NavLink>
        )}
        <NavLink
          to="/Portafolios"
          onClick={changeMenuState}
          style={handleActiveLink}
        >
          <li>
            {" "}
            <img src={Portafolio} alt="Portafolios" width="40" height="auto" />
            Portafolios
          </li>
        </NavLink>
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
  );
}
