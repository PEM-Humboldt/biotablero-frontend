import React, { useReducer } from "react";
import { Outlet } from "react-router";

import { Footer } from "app/layout/Footer";
import { Header } from "app/layout/Header";

import {
  layoutReducer,
  type LayoutActions,
  type LayoutState,
} from "app/layout/layoutReducer";
import { UserCTX } from "app/UserContext";

const layoutInitial: LayoutState = {
  moduleName: "home",
  logos: new Set(),
  headerNames: {
    title: "",
    subtitle: "",
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
    layoutInitial,
  );

  return (
    <UserCTX>
      <div className={layoutState.className}>
        <Header
          activeModule={layoutState.moduleName}
          headerNames={layoutState.headerNames}
        />
        <Outlet context={{ layoutState, layoutDispatch }} />
        <Footer logos={layoutState.logos} />
      </div>
    </UserCTX>
  );
}
