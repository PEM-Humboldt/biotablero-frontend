import React, { useReducer } from "react";
import { Outlet } from "react-router";

import { Footer } from "core/layout/mainLayout/Footer";
import { Header } from "core/layout/mainLayout/Header";

import "core/layout/headerFooter.css";

import {
  layoutReducer,
  type LayoutActions,
  type LayoutState,
} from "core/layout/mainLayout/hooks/layoutReducer";
import { UserCTX } from "@hooks/UserContext";

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
