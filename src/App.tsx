import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import AppContext from "app/AppContext";
import Layout from "app/Layout";
import Uim from "app/Uim";
import Compensation from "pages/Compensation";
import Home from "pages/Home";
import Search from "pages/Search";
import CBMDashboard from "pages/CBMDashboard";
import Indicator from "pages/Indicator";
import Portfolio from "pages/Portfolio";

import "main.css";
import "cbm-dashboard/dist/bundle.css";
import "indicators/dist/bundle.css";

import isFlagEnabled from "utils/isFlagEnabled";

import { LogosConfig, Names } from "types/layoutTypes";

import { UserTypes } from "types/loginUimProps";

interface LoadComponentTypes {
  logoSet: keyof LogosConfig | null;
  name: string;
  component: React.ReactNode;
  className?: string;
}

const App: React.FunctionComponent = () => {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [headerNames, setHeaderNames] = useState<Names>({
    parent: "",
    child: "",
  });
  const [showCBMDashboard, setShowCBMDashboard] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    isFlagEnabled("CBMModule").then((value) => setShowCBMDashboard(value));
  }, []);

  const buildQuery = (queryString: string) => new URLSearchParams(queryString);

  const loadHome = () =>
    loadComponent({
      logoSet: "default",
      name: "",
      component: <Home referrer={location.pathname} />,
    });

  const loadSearch = () => {
    const query = buildQuery(location.search);
    return loadComponent({
      logoSet: null,
      name: "Consultas geográficas",
      component: (
        <Search
          selectedAreaTypeId={query.get("area_type")}
          selectedAreaId={query.get("area_id")}
          setHeaderNames={setHeaderNames}
        />
      ),
      className: "fullgrid",
    });
  };

  const loadIndicator = () =>
    loadComponent({
      logoSet: null,
      name: "Indicadores",
      component: <Indicator />,
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

  const loadCBMDashboard = () =>
    loadComponent({
      logoSet: "monitoreo",
      name: "Monitoreo comunitario",
      component: <CBMDashboard />,
      className: "fullgrid",
    });

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

  const yandexMetrikaId = Number(process.env.REACT_APP_YM_ID);

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
        <Switch>
          <Route exact path="/" render={loadHome} />
          <Route path="/Consultas" render={loadSearch} />
          <Route path="/Indicadores" render={loadIndicator} />
          <Route path="/GEB/Compensaciones" render={loadCompensator} />
          <Route path="/Portafolios" render={loadPortfolio} />
          <Route path="/Alertas" render={loadHome} />
          <Route
            path="/Monitoreo"
            render={showCBMDashboard ? loadCBMDashboard : loadHome}
          />
        </Switch>
      </main>
    </AppContext.Provider>
  );
};

export default App;
