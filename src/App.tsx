import { RouterProvider, createBrowserRouter } from "react-router";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import { MainLayout } from "app/Layout";
import { Home } from "pages/Home";
import { Search } from "pages/Search";
import { Indicators } from "pages/Indicators";
import { Monitoring } from "pages/Monitoring";
import { Portfolio } from "pages/Portfolio";
import { InitiativesMap } from "pages/monitoring/outlet/InitiativesMap";
import {
  DashboardAdmin,
  DashboardUser,
} from "pages/monitoring/outlet/Dashboard";
import { RenderCompensation } from "pages/CompensationAuth";

import { checkNLoad } from "app/utils/userLoader";
import type { UserType } from "app/uim/types";
import "main.css";

const randomNum = (_user: UserType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 10_000));
    }, 3000);
  });
};

const randomNumCritical = (_user: UserType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 10_000));
    }, 1000);
  });
};

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "Consultas",
        Component: Search,
      },
      {
        path: "Monitoreo",
        Component: Monitoring,
        loader: () => checkNLoad({ requirements: { username: "geb" } }),
        children: [
          { index: true, Component: InitiativesMap },
          {
            path: "dashboard",
            children: [
              {
                path: "admin",
                Component: DashboardAdmin,
                loader: () =>
                  checkNLoad({
                    requirements: { roles: ["Admin"] },
                    redirectPath: "/Monitoreo",
                    fetchData: randomNum,
                    fetchCriticalData: randomNumCritical,
                  }),
              },
              {
                path: "user",
                Component: DashboardUser,
                loader: () =>
                  checkNLoad({
                    requirements: { roles: ["User"] },
                    redirectPath: "/Monitoreo",
                    fetchData: randomNum,
                    fetchCriticalData: randomNumCritical,
                  }),
              },
            ],
          },
        ],
      },
      {
        path: "Indicadores",
        Component: Indicators,
      },
      {
        path: "/:user/Compensaciones",
        Component: RenderCompensation,
      },
      {
        path: "Portafolios",
        Component: Portfolio,
      },
    ],
  },
]);

export function App() {
  const yandexMetrikaId = Number(import.meta.env.VITE_YM_ID);

  return (
    <>
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
      <RouterProvider router={routes} />
    </>
  );
}
