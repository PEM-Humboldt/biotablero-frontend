/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

import Menu from './header/Menu';
import Title from './header/Title';
import Uim from './Uim';
import './assets/main.css';

const Header = ({ activeModule, userLogged, callbackUser }) => (
  <header className="cabezote">
    <div>
      <nav>
        <Menu />
      </nav>
      <Title title="BioTablero" subTitle={activeModule} />
    </div>
    {/* TODO: Sending active user information: image, userName, ...
        to be upload when user is active */}
    <Uim
      value="Uim"
      userLogged={userLogged}
      callbackUser={callbackUser}
    />
  </header>
);

Header.propTypes = {
  activeModule: PropTypes.string,
  userLogged: PropTypes.object,
  callbackUser: PropTypes.func.isRequired,
};

Header.defaultProps = {
  activeModule: '',
  userLogged: null,
};

export default Header;
