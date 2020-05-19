/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const Layout = ({
  children,
  moduleName,
  showFooterLogos,
  userLogged,
  callbackUser,
  headerNames,
}) => (
  <div>
    <Header
      activeModule={moduleName}
      userLogged={userLogged}
      callbackUser={callbackUser}
      headerNames={headerNames}
    />
    {children}
    <Footer showLogos={showFooterLogos} />
  </div>
);

Layout.propTypes = {
  children: PropTypes.any,
  moduleName: PropTypes.string,
  showFooterLogos: PropTypes.bool,
  userLogged: PropTypes.object,
  callbackUser: PropTypes.func.isRequired,
  headerNames: PropTypes.object,
};

Layout.defaultProps = {
  children: null,
  moduleName: '',
  showFooterLogos: true,
  userLogged: null,
  headerNames: {},
};

export default Layout;
