import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: false,
    };
  }

  changeMenuState = () => {
    this.setState(prevState => ({ openMenu: !prevState.openMenu }));
  }

  render() {
    const { userLogged } = this.props; // TODO: Implementing user validation
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
          { userLogged ? (
            <Link to="/GEB/Compensaciones" onClick={this.changeMenuState}>
              <li>
                Compensaciones
              </li>
            </Link>
          )
            : '' }
          <Link to="./Alertas" onClick={this.changeMenuState}>
            <li>
              Alertas
            </li>
          </Link>
        </ul>
      </div>
    );
  }
}

Menu.propTypes = {
  userLogged: PropTypes.object,
};

Menu.defaultProps = {
  userLogged: null,
};

export default Menu;
