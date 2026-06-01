import axios, { type AxiosError } from "axios";
import { getKeycloak } from "@api/auth";

const monitoringClient = axios.create({
  baseURL:
    window._env_?.VITE_MONITORING_BACKEND_URL ||
    import.meta.env.VITE_MONITORING_BACKEND_URL,
});

monitoringClient.interceptors.request.use(
  async (config) => {
    const keycloak = await getKeycloak();

    if (keycloak && keycloak.authenticated) {
      try {
        await keycloak.updateToken(30);

        config.headers.set("Authorization", `Bearer ${keycloak.token}`);
      } catch (error) {
        console.error("Failed to refresh Keycloak token during request", error);
        // TODO: Forzar logout o redirección si el refresh token también expiró
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

export { monitoringClient };
