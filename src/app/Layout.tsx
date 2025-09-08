import { useReducer } from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "app/layout/Footer";
import { Header } from "app/layout/Header";
import { Uim } from "app/Uim";
import type { Collaborators, Names } from "types/layoutTypes";
import { layoutReducer, type LayoutState } from "app/layout/layoutReducer";

interface LayoutProps {
  children: React.ReactNode;
  moduleName: string;
  footerLogos: Set<Collaborators> | null;
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
      <Footer collaboratorsId={footerLogos} />
    </div>
  );
}

// const logoSet: LogosConfig = {
//   default: ["nasa", "temple", "siac"],
//   monitoreo: ["usaid", "geobon", "umed", "temple"],
// };
// New shit

const initialLayout: LayoutState = {
  moduleName: "home",
  logos: new Set(),
  headerNames: {
    parent: "",
    child: "",
  },
  user: null,
  className: "",
};

export function MainLayout() {
  const [layout, dispatchLayout] = useReducer(layoutReducer, initialLayout);

  return (
    <div className={layout.className}>
      <Header
        activeModule={layout.moduleName}
        headerNames={layout.headerNames}
        uim={<Uim setUser={dispatchLayout} />}
      />
      <Outlet context={dispatchLayout} />
      <Footer collaboratorsId={layout.logos} />
    </div>
  );
}
