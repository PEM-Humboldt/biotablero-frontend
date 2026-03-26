import { RouterProvider } from "react-router";
import { YMInitializer } from "@appigram/react-yandex-metrika";
import { routes } from "Routes";

import "core/styles/main.css";
import "core/styles/legacy.css";

export function App() {
  const yandexMetrikaId = Number(
    window._env_?.VITE_YM_ID || import.meta.env.VITE_YM_ID,
  );
  const viteEnvironment =
    window._env_?.VITE_ENVIRONMENT || import.meta.env.VITE_ENVIRONMENT;

  return (
    <>
      {viteEnvironment === "production" && (
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
