import {
  deleteTokensFromLS,
  getTokensFromLS,
  setTokensInLS,
} from "@utils/JWTstorage";
import axios, { type AxiosError } from "axios";
import { isResponseRequestError, refreshAccessToken } from "@api/auth";
import type { ExtendedAxiosReqConfig } from "pages/monitoring/api/types/definitions";

const monitoringClient = axios.create({
  baseURL:
    window._env_?.VITE_MONITORING_BACKEND_URL ||
    import.meta.env.VITE_MONITORING_BACKEND_URL,
});

monitoringClient.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokensFromLS();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

monitoringClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalReq = err.config as ExtendedAxiosReqConfig;

    if (err.response?.status !== 401 || originalReq?._retry) {
      return Promise.reject(err);
    }

    originalReq._retry = true;

    try {
      const { refreshToken } = getTokensFromLS();
      if (refreshToken === null) {
        return Promise.reject(err);
      }

      const newTokens = await refreshAccessToken(refreshToken);
      if (isResponseRequestError(newTokens)) {
        deleteTokensFromLS();
        return Promise.reject(err);
      }

      setTokensInLS(newTokens.access_token, newTokens.refresh_token);
      originalReq.headers.set(
        "Authorization",
        `Bearer ${newTokens.access_token}`,
      );
      return monitoringClient(originalReq);
    } catch (refreshError) {
      deleteTokensFromLS();
      console.error("Refresh token failed:", refreshError);
      throw refreshError;
    }
  },
);

export { monitoringClient };
