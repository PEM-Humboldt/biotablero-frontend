import React, { useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';

import AppContext from 'app/AppContext';

import isFlagEnabled from 'utils/isFlagEnabled';

const Menu: React.FunctionComponent = () => {

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  const [showCBMDashboard, setShowCBMDashboard] = useState<boolean>(false);

  useEffect(() => {
    isFlagEnabled('alertsModule')
      .then((value: boolean) => setShowAlerts(value));

      isFlagEnabled('CBMModule')
      .then((value: boolean) => setShowCBMDashboard(value));
  },[]);

  const changeMenuState = () => { setOpenMenu(!openMenu) };

  interface ContextNulo {
    user: null
  }

  const context: ContextNulo = useContext(AppContext);
  const { user } = context;

  return(
    <div id="menuToggle">
        <input type="checkbox" checked={openMenu} onChange={changeMenuState} />
        <span />
        <span />
        <span />
        <ul id="menu">
          <Link to="/" onClick={changeMenuState}>
            <li>
              Inicio
            </li>
          </Link>
          <Link to="/Consultas" onClick={changeMenuState}>
            <li>
              Consultas
            </li>
          </Link>
          <Link to="/Indicadores" onClick={changeMenuState}>
            <li>
              Indicadores
            </li>
          </Link>
          { user ? (
            <Link to="/GEB/Compensaciones" onClick={changeMenuState}>
              <li>
                Compensaciones
              </li>
            </Link>
          )
            : '' }
          <Link to="/Portafolios" onClick={changeMenuState}>
            <li>
              Portafolios
            </li>
          </Link>
          {showAlerts && (
            <Link to="/Alertas" onClick={changeMenuState}>
              <li>
                Alertas
              </li>
            </Link>
          )}
          {showCBMDashboard && (
            <Link to="/Monitoreo" onClick={changeMenuState}>
              <li>
                Monitoreo comunitario
              </li>
            </Link>
          )}
        </ul>
      </div>
  );
};

export default Menu;
