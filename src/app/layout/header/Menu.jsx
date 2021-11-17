import React from 'react';
import { Link } from 'react-router-dom';

import AppContext from 'app/AppContext';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: false,
    };
  }

  changeMenuState = () => {
    this.setState((prevState) => ({ openMenu: !prevState.openMenu }));
  }

  render() {
    const { user } = this.context;
    const { openMenu } = this.state;
    return (
      <div id="menuToggle">
        <input type="checkbox" checked={openMenu} onChange={this.changeMenuState} />
        <span />
        <span />
        <span />
        <ul id="menu">
          <Link to="/" onClick={this.changeMenuState}>
            <li>
              Inicio
            </li>
          </Link>
          <Link to="/Consultas" onClick={this.changeMenuState}>
            <li>
              Consultas
            </li>
          </Link>
          <Link to="./Indicadores" onClick={this.changeMenuState}>
            <li>
              Indicadores
            </li>
          </Link>
          { user ? (
            <Link to="/GEB/Compensaciones" onClick={this.changeMenuState}>
              <li>
                Compensaciones
              </li>
            </Link>
          )
            : '' }
          <Link to="/Portafolios" onClick={this.changeMenuState}>
            <li>
              Portafolios
            </li>
          </Link>
          <Link to="/Alertas" onClick={this.changeMenuState}>
            <li>
              Alertas
            </li>
          </Link>
          <Link to="/Monitoreo" onClick={this.changeMenuState}>
            <li>
              Monitoreo comunitario
            </li>
          </Link>
        </ul>
      </div>
    );
  }
}

Menu.contextType = AppContext;

export default Menu;
