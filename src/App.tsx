import { RouterProvider, createBrowserRouter } from "react-router";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import { MainLayout } from "app/Layout";
import { Home } from "pages/Home";
import { Search } from "pages/Search";
import { Indicators } from "pages/Indicators";
import { Monitoring } from "pages/Monitoring";
import { Portfolio } from "pages/Portfolio";

import "main.css";
import { RenderCompensation } from "pages/CompensationAuth";

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
      },
      {
        path: "Indicadores",
        Component: Indicators,
      },
      {
        path: "/GEB/Compensaciones",
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
