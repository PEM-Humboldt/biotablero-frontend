import { createBrowserRouter } from "react-router";

import { MainLayout } from "core/layout/MainLayout";
import { Home } from "pages/Home";
import { Indicators } from "pages/Indicators";
import { Portfolio } from "pages/Portfolio";
import { InitiativesMap } from "pages/monitoring/outlets/InitiativesMap";
import { Initiatives } from "pages/monitoring/outlets/Initiatives";

import { checkNLoad } from "@utils/userLoader";
import { Logs } from "pages/monitoring/outlets/Logs";
import { InitiativesAdmin } from "pages/monitoring/outlets/InitiativesAdmin";
import { InitiativesManagement } from "pages/monitoring/outlets/InitiativesManagement";
import { InitiativeError } from "pages/monitoring/outlets/initiatives/InitiativeError";

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
        lazy: async () => {
          const { Monitoring } = await import("pages/Monitoring");
          return { Component: Monitoring };
        },
        children: [
          { index: true, Component: InitiativesMap },
          {
            path: "Iniciativas/:initiativeId?/:tabSection?/:detailItem?",
            children: [
              {
                index: true,
                Component: Initiatives,
              },
            ],
          },
          {
            path: "gestionarIniciativas",
            Component: InitiativesManagement,
            loader: () =>
              checkNLoad({
                requirements: { roles: ["User"] },
                redirectPath: "/Monitoreo",
              }),
          },
          {
            path: "administrarIniciativas",
            Component: InitiativesAdmin,
            loader: () =>
              checkNLoad({
                requirements: { roles: ["Admin"] },
                redirectPath: "/Monitoreo",
              }),
          },
          {
            path: "logs",
            Component: Logs,
            loader: () =>
              checkNLoad({
                requirements: { roles: ["Admin"] },
                redirectPath: "/Monitoreo",
              }),
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
