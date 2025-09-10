import React, { useReducer } from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "app/layout/Footer";
import { Header } from "app/layout/Header";

import {
  layoutReducer,
  type LayoutActions,
  type LayoutState,
} from "app/layout/layoutReducer";

// interface LayoutProps {
//   children: React.ReactNode;
//   moduleName: string;
//   footerLogos: Set<Collaborators> | null;
//   headerNames: Names;
//   uim: React.ReactNode;
//   className: string;
// }

// export function Layout({
//   children,
//   moduleName,
//   footerLogos,
//   headerNames,
//   uim,
//   className,
// }: LayoutProps) {
//   return (
//     <div className={className}>
//       <Header activeModule={moduleName} headerNames={headerNames} uim={uim} />
//       {children}
//       <Footer collaboratorsId={footerLogos} />
//     </div>
//   );
// }

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

export interface UiManager {
  layoutState: LayoutState;
  layoutDispatch: React.Dispatch<LayoutActions>;
}

export function MainLayout() {
  const [layoutState, layoutDispatch] = useReducer(
    layoutReducer,
    initialLayout
  );

  return (
    <div className={layoutState.className}>
      <Header
        activeModule={layoutState.moduleName}
        headerNames={layoutState.headerNames}
        user={layoutState.user}
        layoutDispatch={layoutDispatch}
      />
      <Outlet context={{ layoutState, layoutDispatch }} />
      <Footer collaboratorsId={layoutState.logos} />
    </div>
  );
}
