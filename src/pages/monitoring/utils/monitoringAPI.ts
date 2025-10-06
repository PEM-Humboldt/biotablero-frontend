import { getTokensFromLS, setTokensInLS } from "app/uim/utils/JWTstorage";
import axios, {
  isAxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";
import {
  isResponseRequestError,
  refreshAccessToken,
  type RequestError,
} from "core/utils/authAPI";

// NOTE: Implementación base con interceptor para todos los requests de
// usuario en el módulo de monitoreo

interface ExtendedAxiosReqConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BACKEND_URL,
});

authClient.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokensFromLS();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

authClient.interceptors.response.use(
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
        return Promise.reject(err);
      }

      setTokensInLS(newTokens.access_token, newTokens.refresh_token);
      originalReq.headers.set(
        "Authorization",
        `Bearer ${newTokens.access_token}`,
      );
      return authClient(originalReq);
    } catch (refreshError) {
      console.error("Refresh token failed:", refreshError);
    }

    return Promise.reject(err);
  },
);

/**
 * Wrapper around Axios to standardize requests to the Auth module.
 *
 * Handles query parameter encoding, error normalization, and token injection through interceptors.
 *
 * @typeParam T - The expected response payload type.
 * @param type - The HTTP method (`get`, `post`, `put`, or `delete`).
 * @param endpoint - The API endpoint relative to the Auth backend base URL.
 * @param data - Optional key-value pairs to send as query parameters or request body.
 * @param headers - Optional custom headers for the request.
 * @returns A `Promise` resolving to the parsed response of type `T`, or a `RequestError` on failure.
 */
export async function authRequest<T>(
  type: "get" | "post" | "put" | "delete",
  endpoint: string,
  data?: Record<string, string>,
  headers?: Record<string, string>,
): Promise<T | RequestError> {
  try {
    let response: AxiosResponse<T>;
    const reqParams = new URLSearchParams();
    if (data) {
      Object.entries(data).forEach(([key, value]) =>
        reqParams.append(key, value),
      );
    }

    if (type === "get" || type === "delete") {
      const fullEndpoint = `${endpoint}?${reqParams.toString()}`;
      response = await authClient[type]<T>(fullEndpoint);
    } else {
      reqParams.append("client_id", "bt-mc-client");
      response = await authClient[type]<T>(endpoint, reqParams, { headers });
    }

    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return {
        status: err.response.status,
        message: err?.message || "Request failed",
      };
    }
    return { status: 503, message: "Couldn't connect with the server" };
  }
}
