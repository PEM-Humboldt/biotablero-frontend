import { createBrowserRouter } from "react-router";

import { MainLayout } from "core/layout/MainLayout";
import { Home } from "pages/Home";
import { Indicators } from "pages/Indicators";
import { Portfolio } from "pages/Portfolio";
import { InitiativesMap } from "pages/monitoring/outlet/InitiativesMap";
import {
  DashboardAdmin,
  DashboardUser,
} from "pages/monitoring/outlet/Dashboard";

import { checkNLoad } from "@utils/userLoader";
import type { UserType } from "@appTypes/user";

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
        lazy: async () => {
          const { Search } = await import("pages/Search");
          return { Component: Search };
        },
      },
      {
        path: "Monitoreo",
        loader: () => checkNLoad({ requirements: { username: "geb" } }),
        lazy: async () => {
          const { Monitoring } = await import("pages/Monitoring");
          return { Component: Monitoring };
        },
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
        lazy: async () => {
          const { RenderCompensation } = await import("pages/CompensationAuth");
          return { Component: RenderCompensation };
        },
      },
      {
        path: "Portafolios",
        Component: Portfolio,
      },
    ],
  },
]);
