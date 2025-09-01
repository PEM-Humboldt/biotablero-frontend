import React, { useMemo, useState } from "react";
import { Switch, Redirect, useLocation } from "react-router-dom";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import { CompatRoute, CompatRouter } from "react-router-dom-v5-compat";

import { AppContext } from "app/AppContext";
import { Layout } from "app/Layout";
import { Uim } from "app/Uim";
import { Compensation } from "pages/Compensation";
import { Home } from "pages/Home";
import { Indicators } from "pages/Indicators";
<<<<<<< HEAD
import { Search } from "pages/Search";
import Portfolio from "pages/Portfolio";
=======
import { Portfolio } from "pages/Portfolio";
>>>>>>> a22a6f97 (updates 1 level componens of Home and Portfolio to the new router)
import { Monitoring } from "pages/Monitoring";
import "main.css";

import type { LogosConfig, Names } from "types/layoutTypes";
import type { UserTypes } from "types/loginUimProps";

interface MakeComponentWrapperArgs {
  logoSet: keyof LogosConfig | null;
  name: string;
  component: React.ReactNode;
  className?: string;
}

export function App() {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [headerNames, setHeaderNames] = useState<Names>({
    parent: "",
    child: "",
  });

  const location = useLocation();

  const makeComponentWrapper = ({
    logoSet,
    name,
    component,
    className = "",
  }: MakeComponentWrapperArgs) => (
    <Layout
      moduleName={name}
      footerLogos={logoSet}
      headerNames={headerNames}
      uim={<Uim setUser={setUser} />}
      className={className}
    >
      {component}
    </Layout>
  );

  const loadHome = () =>
    makeComponentWrapper({
      logoSet: "default",
      name: "",
      component: <Home />,
    });

  const loadSearch = () =>
    makeComponentWrapper({
      logoSet: null,
      name: "Consultas geográficas",
      component: <Search setHeaderNames={setHeaderNames} />,
      className: "fullgrid",
    });

  const loadMonitoring = () =>
    makeComponentWrapper({
      logoSet: "monitoreo",
      name: "Monitoreo Comunitario",
      component: <Monitoring />,
      className: "fullgrid",
    });

  const loadIndicator = () =>
    makeComponentWrapper({
      logoSet: null,
      name: "Indicadores",
      component: <Indicators />,
      className: "fullgrid",
    });

  const loadCompensator = () =>
    user ? (
      makeComponentWrapper({
        logoSet: null,
        name: "Compensación ambiental",
        component: <Compensation setHeaderNames={setHeaderNames} />,
        className: "fullgrid",
      })
    ) : (
      <Redirect to={{ pathname: "/", state: { prevUrl: location.pathname } }} />
    );

  const loadPortfolio = () =>
    makeComponentWrapper({
      logoSet: null,
      name: "Portafolios",
      component: <Portfolio />,
      className: "fullgrid",
    });

  const yandexMetrikaId = Number(import.meta.env.VITE_YM_ID);
  const contextValue = useMemo(() => ({ user }), [user]);

  return (
    <AppContext.Provider value={contextValue}>
      <YMInitializer
        accounts={yandexMetrikaId ? [yandexMetrikaId] : []}
        options={{
          webvisor: true,
          trackHash: true,
          clickmap: true,
          accurateTrackBounce: true,
          trackLinks: true,
          params: {
            cookieDomain: ".humboldt.org.co",
            cookieFlags: "SameSite=None; Secure",
          },
        }}
      />
      <main>
        <CompatRouter>
          <Switch>
            <CompatRoute exact path="/" render={loadHome} />
            <CompatRoute path="/Consultas" render={loadSearch} />
            <CompatRoute path="/Indicadores" render={loadIndicator} />
            <CompatRoute path="/GEB/Compensaciones" render={loadCompensator} />
            <CompatRoute path="/Portafolios" render={loadPortfolio} />
            <CompatRoute path="/Alertas" render={loadHome} />
            <CompatRoute path="/Monitoreo" render={loadMonitoring} />
          </Switch>
        </CompatRouter>
      </main>
    </AppContext.Provider>
  );
}
