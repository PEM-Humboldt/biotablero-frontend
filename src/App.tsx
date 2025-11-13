import { RouterProvider } from "react-router";
import { YMInitializer } from "@appigram/react-yandex-metrika";
import { routes } from "Routes";

import "core/styles/main.css";

export function App() {
  const yandexMetrikaId = Number(import.meta.env.VITE_YM_ID);

  return (
    <>
      {import.meta.env.VITE_ENVIRONMENT === "production" && (
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
      )}
      <RouterProvider router={routes} />
    </>
  );
}
