import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AppContext, { AppContextValue } from "app/AppContext";
import isFlagEnabled from "utils/isFlagEnabled";

import Consultasgeograficas from "images/consulta-geografica-logo.svg";
import Indicadores from "images/indicadores-biodiversidad-icono.svg";
import Portafolio from "images/portafolio-icono.svg";
import Comunitario from "images/monitoreo-comunitario-icono.svg";
import Compensacion from "images/compensacion-ambiental-icono.svg";
import Alerta from "images/alertas-tempranas-icono.svg";

const Menu: React.FunctionComponent = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  const [showCBMDashboard, setShowCBMDashboard] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    isFlagEnabled("alertsModule").then((value: boolean) => {
      if (isMounted) setShowAlerts(value);
    });

    isFlagEnabled("CBMModule").then((value: boolean) => {
      if (isMounted) setShowCBMDashboard(value);
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

        <Link to="/Consultas" onClick={changeMenuState}>
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
        </Link>
        <Link to="/Monitoreo" onClick={changeMenuState}>
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
        </Link>
        <Link to="/Indicadores" onClick={changeMenuState}>
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
        </Link>
        {user && (
          <Link to="/GEB/Compensaciones" onClick={changeMenuState}>
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
          </Link>
        )}
        <Link to="/Portafolios" onClick={changeMenuState}>
          <li>
            {" "}
            <img src={Portafolio} alt="Portafolios" width="40" height="auto" />
            Portafolios
          </li>
        </Link>
        {showAlerts && (
          <Link to="/Alertas" onClick={changeMenuState}>
            <li>
              {" "}
              <img
                src={Alerta}
                alt="Alertas Tempranas"
                width="40"
                height="auto"
              />{" "}
              Alertas Tempranas
            </li>
          </Link>
        )}
        {/*showCBMDashboard && (
       <Link to="/Monitoreo" onClick={changeMenuState}>
            <li>
              {" "}
              <img src={Comunitario} alt="Monitoreo Comunitario" width="40" height="auto" />
              Monitoreo Comunitario
            </li>
          </Link> 
        )*/}
      </ul>
    </div>
  );
};

export default Menu;
