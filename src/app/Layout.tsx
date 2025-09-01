import { Footer } from "app/layout/Footer";
import Header from "app/layout/Header";

import type { LogosConfig, Names } from "types/layoutTypes";

interface LayoutProps {
  children: React.ReactNode;
  moduleName: string;
  footerLogos: keyof LogosConfig | null;
  headerNames: Names;
  uim: React.ReactNode;
  className: string;
}

export function Layout({
  children,
  moduleName,
  footerLogos,
  headerNames,
  uim,
  className,
}: LayoutProps) {
  return (
    <div className={className}>
      <Header activeModule={moduleName} headerNames={headerNames} uim={uim} />
      {children}
      <Footer logosId={footerLogos} />
    </div>
  );
}
