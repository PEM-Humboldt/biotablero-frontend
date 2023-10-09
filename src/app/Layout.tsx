import React from 'react';
import PropTypes from 'prop-types';

import Footer from 'app/layout/Footer';
import Header from 'app/layout/Header';

interface Names {
  parent: string | null;
  child: string | null;
}

interface LayoutProps {
  children: any | null,
  moduleName: string;
  footerLogos: any;
  headerNames: Names;
  uim: React.ReactNode | null;
  className: string;
}

const Layout: React.FunctionComponent<LayoutProps> = ({
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


export default Layout;
