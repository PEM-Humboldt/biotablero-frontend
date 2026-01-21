import React, { useReducer } from "react";
import { Outlet, useNavigation } from "react-router";

import { Footer } from "core/layout/mainLayout/Footer";
import { Header } from "core/layout/mainLayout/Header";

import {
  layoutReducer,
  type LayoutActions,
  type LayoutState,
} from "core/layout/mainLayout/hooks/layoutReducer";
import { UserCTX } from "@hooks/UserContext";
import { OnLoadingModal } from "@ui/OnLoadingModal";

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

  const navigation = useNavigation();

  return (
    <UserCTX>
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
        <Header
          activeModule={layoutState.moduleName}
          headerNames={layoutState.headerNames}
          className="z-10"
        />

        <main className="">
          <OnLoadingModal open={navigation.state === "loading"} />
          <Outlet context={{ layoutState, layoutDispatch }} />
        </main>

        <Footer logos={layoutState.logos} className="z-10" />
      </div>
    </UserCTX>
  );
}
