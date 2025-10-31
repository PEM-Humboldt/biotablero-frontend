import { getTokensFromLS, setTokensInLS } from "@utils/JWTstorage";
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
} from "@api/auth";
import type {
  ODataLog,
  ODataParams,
} from "pages/monitoring/types/requestParams";

interface ExtendedAxiosReqConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface MonitoringAPIOptions {
  data?: Record<string, string>;
  oData?: Partial<ODataParams>;
  headers?: Record<string, string>;
}

type MonitoringAPIParams = {
  endpoint: string;
} & (
  | {
      type: "get";
      options?: MonitoringAPIOptions;
    }
  | {
      type: "put" | "delete" | "post";
      options?: Omit<MonitoringAPIOptions, "oData">;
    }
);

const monitoringClient = axios.create({
  baseURL: import.meta.env.VITE_MONITORING_BACKEND_URL,
});

export function isMonitoringAPIError(
  response: unknown,
): response is RequestError {
  return (
    typeof response === "object" &&
    response !== null &&
    "status" in response &&
    "message" in response
  );
}

function oDataToString(oDataParams: ODataParams): string {
  return Object.entries(oDataParams)
    .map(([param, value]) => `$${param}=${encodeURIComponent(String(value))}`)
    .join("&");
}

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
        return Promise.reject(err);
      }

      setTokensInLS(newTokens.access_token, newTokens.refresh_token);
      originalReq.headers.set(
        "Authorization",
        `Bearer ${newTokens.access_token}`,
      );
      return monitoringClient(originalReq);
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
export async function monitoringAPI<T>({
  type,
  endpoint,
  options,
}: MonitoringAPIParams): Promise<T | RequestError> {
  const { data, headers } = options || {};

  try {
    const baseURL = import.meta.env.VITE_MONITORING_BACKEND_URL;
    let response: AxiosResponse<T>;
    const reqParams = new URLSearchParams();
    if (data) {
      Object.entries(data).forEach(([key, value]) =>
        reqParams.append(key, value),
      );
    }

    if (type === "get" || type === "delete") {
      const oDataParams =
        type === "get" && options?.oData !== undefined
          ? oDataToString(options.oData)
          : "";

      const params = [reqParams.toString(), oDataParams]
        .filter(Boolean)
        .join("&");

      const fullEndpoint = `${baseURL}/${endpoint}${params ? `?${params}` : ""}`;

      response = await monitoringClient[type]<T>(fullEndpoint);
    } else {
      reqParams.append("client_id", "bt-mc-client");

      response = await monitoringClient[type]<T>(
        `${baseURL}/${endpoint}`,
        reqParams,
        { headers },
      );
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

export async function getLogs(
  odataParams: ODataParams = {},
): Promise<ODataLog> {
  const result = await monitoringAPI<ODataLog>({
    endpoint: "Logs",
    type: "get",
    options: { oData: odataParams },
  });

  if (isMonitoringAPIError(result)) {
    throw new Error(result.message);
  }

  return result;
}
