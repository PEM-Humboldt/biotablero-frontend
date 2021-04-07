import React from 'react';
import PropTypes from 'prop-types';

import Footer from 'app/layout/Footer';
import Header from 'app/layout/Header';

const Layout = ({
  children,
  moduleName,
  footerLogos,
  headerNames,
  uim,
  className,
}) => (
  <div className={className}>
    <Header
      activeModule={moduleName}
      headerNames={headerNames}
      uim={uim}
    />
    {children}
    <Footer logosId={footerLogos} />
  </div>
);

Layout.propTypes = {
  children: PropTypes.any,
  moduleName: PropTypes.string,
  footerLogos: PropTypes.string,
  headerNames: PropTypes.object,
  uim: PropTypes.node,
  className: PropTypes.string,
};

Layout.defaultProps = {
  children: null,
  moduleName: '',
  footerLogos: null,
  headerNames: {},
  uim: null,
  className: '',
};

export default Layout;
