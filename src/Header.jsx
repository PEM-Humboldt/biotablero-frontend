/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

import Menu from './header/Menu';
import Title from './header/Title';
import Uim from './header/Uim';
import './assets/main.css';

const Header = ({ activeModule }) => (
  <header className="cabezote">
    <div>
      <nav>
        <Menu />
      </nav>
      <Title title="BioTablero" subTitle={activeModule} />
    </div>
    {/* TODO: Crear componente para manejo de usuarios,
        con actualización de la imagen y usuario en el
        Header en la página */}
    <Uim value="Uim" />
  </header>
);

Header.propTypes = {
  activeModule: PropTypes.string,
};

Header.defaultProps = {
  activeModule: '',
};

export default Header;
