/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const Layout = ({
  children, moduleName, showFooterLogos, userLogged,
}) => (
  <div>
    <Header
      activeModule={moduleName}
      userLogged={userLogged}
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
};

Layout.defaultProps = {
  children: null,
  moduleName: '',
  showFooterLogos: true,
  userLogged: null,
};

export default Layout;
