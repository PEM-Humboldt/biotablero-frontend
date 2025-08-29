import React, { useState, useEffect } from "react";
import { Switch, Redirect, useLocation } from "react-router-dom";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import { CompatRoute, CompatRouter } from "react-router-dom-v5-compat";

import AppContext from "app/AppContext";
import Layout from "app/Layout";
import Uim from "app/Uim";
import Compensation from "pages/Compensation";
import { Home } from "pages/Home";
import { Search } from "pages/Search";
import { Indicators } from "pages/Indicators";
import Portfolio from "pages/Portfolio";
import { Monitoring } from "pages/Monitoring";
import "main.css";

import isFlagEnabled from "utils/isFlagEnabled";

import type { LogosConfig, Names } from "types/layoutTypes";
import type { UserTypes } from "types/loginUimProps";

interface LoadComponentTypes {
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

  const loadComponent = ({
    logoSet,
    name,
    component,
    className = "",
  }: LoadComponentTypes) => {
    return (
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
  };

  const loadHome = () =>
    loadComponent({
      logoSet: "default",
      name: "",
      component: <Home />,
    });

  const loadSearch = () => {
    return loadComponent({
      logoSet: null,
      name: "Consultas geográficas",
      component: <Search setHeaderNames={setHeaderNames} />,
      className: "fullgrid",
    });
  };

  const loadMonitoring = () => {
    return loadComponent({
      logoSet: null,
      name: "Monitoreo Comunitario",
      component: <Monitoring />,
      className: "fullgrid",
    });
  };

  const loadIndicator = () =>
    loadComponent({
      logoSet: null,
      name: "Indicadores",
      component: <Indicators />,
      className: "fullgrid",
    });

  const loadCompensator = () => {
    if (user) {
      return loadComponent({
        logoSet: null,
        name: "Compensación ambiental",
        component: <Compensation setHeaderNames={setHeaderNames} />,
        className: "fullgrid",
      });
    }
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { prevUrl: location.pathname },
        }}
      />
    );
  };

  const loadPortfolio = () =>
    loadComponent({
      logoSet: null,
      name: "Portafolios",
      component: <Portfolio />,
      className: "fullgrid",
    });

  const yandexMetrikaId = Number(import.meta.env.VITE_YM_ID);

  return (
    <AppContext.Provider value={{ user }}>
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
