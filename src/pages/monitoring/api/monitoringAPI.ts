import {
  deleteTokensFromLS,
  getTokensFromLS,
  setTokensInLS,
} from "@utils/JWTstorage";
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
import type { ODataParams } from "@appTypes/odata";
import type {
  ODataInitiative,
  ODataLog,
} from "pages/monitoring/types/requestParams";
import { oDataToString } from "@utils/odata";
import type { Location } from "pages/monitoring/types/monitoring";

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

/**
 * Type guard to determine whether a response object is a `RequestError`.
 *
 * Useful for distinguishing between successful API responses and normalized
 * error objects returned by `monitoringAPI`.
 *
 * @param response - The value to check.
 * @returns `true` if the value is a `RequestError`, otherwise `false`.
 */
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

/**
 * Wrapper around Axios to standardize requests to the Monitoring module.
 *
 * Handles query parameter encoding, OData query composition, error normalization,
 * and optional custom headers. Automatically appends `client_id` for non-GET requests.
 *
 * @typeParam T - The expected response payload type.
 * @param type - The HTTP method (`get`, `post`, `put`, or `delete`).
 * @param endpoint - The API endpoint relative to the Monitoring backend base URL.
 * @param options - Optional request configuration, including:
 *  - `data`: Key-value pairs to send as query parameters or form data.
 *  - `headers`: Custom request headers.
 *  - `oData`: OData query parameters for GET requests.
 * @returns A `Promise` resolving to the parsed response of type `T`, or a `RequestError` on failure.
 */
export async function monitoringAPI<T>({
  type,
  endpoint,
  options,
}: MonitoringAPIParams): Promise<T | RequestError> {
  try {
    const baseURL = import.meta.env.VITE_MONITORING_BACKEND_URL;
    let response: AxiosResponse<T>;
    const { data, headers } = options ?? {};
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

/**
 * Creates a specialized async function to fetch data from a given API endpoint.
 *
 * This function is a generator that wraps `monitoringAPI` and specializes
 * it for a specific endpoint.
 *
 * @template T The expected OData data structure for the specific endpoint
 * @param endpoint The name of the API endpoint to be fetched
 * @returns An async function that accepts {@link ODataParams} and returns a `Promise<T>`.
 * @throws If the API returns a `RequestError` or the underlying request fails.
 */
function createODataGetter<T>(endpoint: string) {
  return async (odataParams: ODataParams): Promise<T> => {
    const result = await monitoringAPI<T>({
      endpoint,
      type: "get",
      options: { oData: odataParams },
    });

    if (isMonitoringAPIError(result)) {
      throw new Error(result.message);
    }

    return result;
  };
}

/**
 * Fetches log records from the "Logs" endpoint of the Monitoring API.
 *
 * @param odataParams Optional OData query parameters (filtering, pagination, etc.).
 * @returns A `Promise` that resolves to an `ODataLog` object.
 */
export const getLogs = createODataGetter<ODataLog>("Logs");

/**
 * Fetches initiative data from the "Initiative" endpoint of the Monitoring API.
 *
 * @param odataParams Optional OData query parameters (filtering, pagination, etc.).
 * @returns A `Promise` that resolves to an `ODataInitiatives` object.
 */
export const getInitiatives = createODataGetter<ODataInitiative>("Initiative");

/**
 * Fetches all the parent locations
 */
export async function getLocation(parentId?: number | string) {
  try {
    const queryParam = parentId !== undefined ? `?parentId=${parentId}` : "";
    const res = await monitoringAPI<Location[]>({
      type: "get",
      endpoint: `Location${queryParam}`,
    });
    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }

    return res.map(({ name, id }) => ({ name, value: id }));
  } catch (err) {
    console.error(err);
    return [];
  }
}
