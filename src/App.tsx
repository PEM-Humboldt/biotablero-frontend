import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { YMInitializer } from "@appigram/react-yandex-metrika";

import { MainLayout } from "app/Layout";
import { Home } from "pages/Home";
import { Search } from "pages/Search";
import { Indicators } from "pages/Indicators";
import { Monitoring } from "pages/Monitoring";
import { Portfolio } from "pages/Portfolio";
import { UpdatedLayout } from "app/layout/layoutReducer";

import "main.css";

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
        handle: {
          layout: {
            type: UpdatedLayout.SECTION,
            sectionData: {
              moduleName: "Consultas Geográficas",
              logos: new Set(),
              className: "fullgrid",
            },
          },
        },
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
  // const makeComponentWrapper = ({
  //   logoSet,
  //   name,
  //   component,
  //   className = "",
  // }: MakeComponentWrapperArgs) => (
  //   <Layout
  //     moduleName={name}
  //     // footerLogos={new Set(["nasa", "temple", "siac"])}
  //     headerNames={headerNames}
  //     uim={<Uim setUser={setUser} />}
  //     className={className}
  //   >
  //     {component}
  //   </Layout>
  // );
  //
  // const loadCompensator = () =>
  //   user ? (
  //     makeComponentWrapper({
  //       logoSet: null,
  //       name: "Compensación Ambiental",
  //       component: <Compensation setHeaderNames={setHeaderNames} />,
  //       className: "fullgrid",
  //     })
  //   ) : (
  //     <Navigate to="/" state={{ prevUrl: location.pathname }} />
  //   );
  //
  //
  // const contextValue = useMemo(() => ({ user }), [user]);
  // return (
  //   <AppContext.Provider value={contextValue}>
  //     <main>
  //       <Routes>
  //         <Route path="/" element={loadHome()} />
  //         <Route path="/Consultas" element={loadSearch()} />
  //         <Route path="/Indicadores" element={loadIndicator()} />
  //         <Route path="/GEB/Compensaciones" element={loadCompensator()} />
  //         <Route path="/Portafolios" element={loadPortfolio()} />
  //         <Route path="/Alertas" element={loadHome()} />
  //         <Route path="/Monitoreo" element={loadMonitoring()} />
  //       </Routes>
  //     </main>
  //   </AppContext.Provider>
  // );
}
