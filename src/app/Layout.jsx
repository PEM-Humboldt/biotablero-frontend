import React from 'react';
import PropTypes from 'prop-types';

import Footer from 'app/layout/Footer';
import Header from 'app/layout/Header';

const Layout = ({
  children,
  moduleName,
  showFooterLogos,
  headerNames,
  uim,
}) => (
  <div>
    <Header
      activeModule={moduleName}
      headerNames={headerNames}
      uim={uim}
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
  uim: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
  moduleName: '',
  showFooterLogos: true,
  headerNames: {},
  uim: null,
};

export default Layout;
