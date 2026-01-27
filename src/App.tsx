import { RouterProvider } from "react-router";
import { YMInitializer } from "@appigram/react-yandex-metrika";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { routes } from "Routes";

import "core/styles/main.css";
import "core/styles/legacy.css";
import { AuthProvider } from "core/context/AuthContext";
import { NavigationBridge } from "pages/utils/NavigationBridge";

// Tema de Material-UI (puedes personalizarlo según tu diseño)
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

export function App() {
  const yandexMetrikaId = Number(import.meta.env.VITE_YM_ID);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider
        fallback={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              gap: "1rem",
            }}
          >
            <div className="spinner" />
            {/* <p>Iniciando autenticación...</p> */}
          </div>
        }
        onAuthSuccess={(user) => {
          if (import.meta.env.VITE_ENVIRONMENT === "production") {
          }
        }}
        onAuthError={(error) => {
          console.error("Error de autenticación:", error);
        }}
      >
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
      </AuthProvider>
    </ThemeProvider>
  );
}
