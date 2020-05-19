/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const Layout = ({
  children,
  moduleName,
  showFooterLogos,
  headerNames,
}) => (
  <div>
    <Header
      activeModule={moduleName}
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
  headerNames: PropTypes.object,
};

Layout.defaultProps = {
  children: null,
  moduleName: '',
  showFooterLogos: true,
  headerNames: {},
};

export default Layout;
