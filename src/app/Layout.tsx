import Footer from "app/layout/Footer";
import Header from "app/layout/Header";

import { LogosConfig } from "types/layoutTypes";

interface Names {
  parent?: string;
  child?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  moduleName: string;
  footerLogos: keyof LogosConfig | null;
  headerNames: Names;
  uim: React.ReactNode;
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
    <Header activeModule={moduleName} headerNames={headerNames} uim={uim} />
    {children}
    <Footer logosId={footerLogos} />
  </div>
);

export default Layout;
