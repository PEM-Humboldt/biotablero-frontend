/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const Layout = ({ moduleName, showFooterLogos, children }) => (
  <div>
    <Header activeModule={moduleName} />
    {children}
    <Footer showLogos={showFooterLogos} />
  </div>
);

Layout.propTypes = {
  moduleName: PropTypes.string,
  showFooterLogos: PropTypes.bool,
  children: PropTypes.any,
};

Layout.defaultProps = {
  moduleName: '',
  showFooterLogos: true,
  children: null,
};

export default Layout;
