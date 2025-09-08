import React, { useMemo, useState } from "react";
import { Navigate, useLocation, Route, Routes } from "react-router-dom";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import { AppContext } from "app/AppContext";
import { Layout } from "app/Layout";
import { Uim } from "app/Uim";
import { Compensation } from "pages/Compensation";
import { Home } from "pages/Home";
import { Indicators } from "pages/Indicators";
import { Search } from "pages/Search";
import { Portfolio } from "pages/Portfolio";
import { Monitoring } from "pages/Monitoring";
import "main.css";

import type { Names } from "types/layoutTypes";
import type { UserTypes } from "types/loginUimProps";

interface MakeComponentWrapperArgs {
  logoSet: string | null;
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
      // footerLogos={new Set(["nasa", "temple", "siac"])}
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
      name: "Consultas Geográficas",
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
        name: "Compensación Ambiental",
        component: <Compensation setHeaderNames={setHeaderNames} />,
        className: "fullgrid",
      })
    ) : (
      <Navigate to="/" state={{ prevUrl: location.pathname }} />
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
        <Routes>
          <Route path="/" element={loadHome()} />
          <Route path="/Consultas" element={loadSearch()} />
          <Route path="/Indicadores" element={loadIndicator()} />
          <Route path="/GEB/Compensaciones" element={loadCompensator()} />
          <Route path="/Portafolios" element={loadPortfolio()} />
          <Route path="/Alertas" element={loadHome()} />
          <Route path="/Monitoreo" element={loadMonitoring()} />
        </Routes>
      </main>
    </AppContext.Provider>
  );
}
