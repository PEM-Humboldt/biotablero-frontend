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
import { isResponseRequestError, refreshAccessToken } from "@api/auth";
import type { ApiRequestError } from "@appTypes/api";
import type { ODataParams } from "@appTypes/odata";
import type {
  LocationBasicInfo,
  ODataInitiative,
  ODataLog,
} from "pages/monitoring/types/requestParams";
import { oDataToString } from "@utils/odata";
import type {
  Location,
  UserLevel,
  UserKC,
} from "pages/monitoring/types/monitoring";
import { serializeQueryParams } from "@utils/htmlRequest";
import type { QueryParams, RequestBody } from "@appTypes/htmlRequest";
import usersMock from "pages/monitoring/api/usersMock.json";
import type { InitiativeFullInfo } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { commonErrorMessage } from "@utils/ui";

interface ExtendedAxiosReqConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type RequestData = RequestBody | FormData;

type MonitoringAPIParams = {
  endpoint: string;
  getStatus?: boolean;
} & (
  | {
      type: "get";
      options?: {
        data?: QueryParams;
        oData?: Partial<ODataParams>;
        headers?: Record<string, string>;
      };
    }
  | {
      type: "delete";
      options?: {
        data?: QueryParams;
        headers?: Record<string, string>;
      };
    }
  | {
      type: "put" | "post";
      options?: {
        data?: RequestData;
        headers?: Record<string, string>;
      };
    }
);

type ImageUploadInfo = { file: File | null | undefined | string; path: string };

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
): response is ApiRequestError {
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

type ResponseWithStatus<T> = {
  data: T;
  status: number;
};

/**
 * Wrapper around Axios to standardize requests to the Monitoring module.
 *
 * Handles query parameter encoding, OData query composition, error normalization,
 * and optional custom headers. Automatically appends `client_id` for non-GET requests.
 *
 * @typeParam T - The expected response payload type.
 * @param type - The HTTP method (`get`, `post`, `put`, or `delete`).
 * @param endpoint - The API endpoint relative to the Monitoring backend base URL.
 * @param options - Optional request configuration (data, headers, oData).
 * @param getStatus - If true, returns the data wrapped with the HTTP status code.
 * @returns A `Promise` resolving to:
 * - If `getStatus` is true: An object `{ data: T, status: number }`.
 * - If `getStatus` is false/omitted: The parsed response of type `T`.
 * - On failure: A `RequestError` object.
 */
export async function monitoringAPI<T>(
  params: MonitoringAPIParams & { getStatus: true },
): Promise<ResponseWithStatus<T> | ApiRequestError>;
export async function monitoringAPI<T>(
  params: MonitoringAPIParams & { getStatus?: false },
): Promise<T | ApiRequestError>;
export async function monitoringAPI<T>({
  type,
  endpoint,
  options,
  getStatus = false,
}: MonitoringAPIParams): Promise<T | ResponseWithStatus<T> | ApiRequestError> {
  try {
    const baseURL = import.meta.env.VITE_MONITORING_BACKEND_URL;
    let response: AxiosResponse<T>;
    const { data, headers } = options ?? {};

    if (type === "get" || type === "delete") {
      const queryParams = data ? serializeQueryParams(data as QueryParams) : "";

      const oDataParams =
        type === "get" && options?.oData !== undefined
          ? oDataToString(options.oData)
          : "";

      const params = [queryParams, oDataParams].filter(Boolean).join("&");
      const fullEndpoint = `${baseURL}/${endpoint}${params ? `?${params}` : ""}`;

      response = await monitoringClient[type]<T>(fullEndpoint);
    } else {
      let payload: RequestData;

      if (data instanceof FormData) {
        payload = data;
        if (!payload.has("client_id")) {
          payload.append("client_id", "bt-mc-client");
        }
      } else {
        payload = {
          client_id: "bt-mc-client",
          ...data,
        };
      }

      response = await monitoringClient[type]<T>(
        `${baseURL}/${endpoint}`,
        payload,
        { headers },
      );
    }

    return getStatus
      ? { data: response.data, status: response.status }
      : response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      const serverData =
        typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data);

      return {
        status: err.response.status,
        message: err?.message || "Request failed",
        data: serverData,
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
 * Retrieves all the info about the initiative that has the specified id.
 *
 * @param id - The number of the initiative in DB
 * @returns A Promise that resolves in a detailed object with all the initiative info
 */
export async function getInitiative(id: number) {
  try {
    const res = await monitoringAPI<InitiativeFullInfo>({
      type: "get",
      endpoint: `Initiative/${id}`,
    });
    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }
    return res;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Retrieves the list of available all the locations from the Monitoring API.
 * This function is typically used to populate cascading dropdown selectors.
 *
 * @param parentId [Optional] The ID of the parent location from which to fetch
 * sub-locations. If omitted, the function returns all the parent locations.
 *
 * @returns A Promise that resolves to an array of location objects formatted
 * for a selector:
 * - `name`: The location's name.
 * - `value`: The location's numeric ID.
 */
export async function getLocationList(parentId?: number | string) {
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

/**
 * Retrieves detailed information for a specific location from the Monitoring API.
 * This function is used to fetch the full data of a single location, such as
 * its department and municipality names, based on its unique identifier.
 *
 * @param locationId - The unique numeric or string ID of the location to retrieve.
 *
 * @returns A Promise that resolves to:
 * - A `LocationBasicInfo` object containing the location's details if successful.
 * - `undefined` if an error occurs during the fetch process.
 */
export async function getLocationInfo(locationId: number | string) {
  try {
    const res = await monitoringAPI<LocationBasicInfo>({
      type: "get",
      endpoint: `Location/${locationId}`,
    });
    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }

    return res;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserLevels() {
  try {
    const res = await monitoringAPI<UserLevel[]>({
      type: "get",
      endpoint: "InitiativeUserLevel",
    });

    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }

    return res;
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * Retrieves a list of users, optionally filtered by a specific Initiative ID.
 *
 * @param byInitiativeId - OPTIONAL. The ID of the initiative to retrieve all associated users. If omitted, all users are returned.
 *
 * @returns A `Promise` resolving to an array of User objects.
 * @throws An `Error` if the Monitoring API returns an error status or if the request fails.
 */
export async function getUsers(
  byInitiativeId?: number | string,
): Promise<UserKC[]> {
  if (byInitiativeId === undefined) {
    // NOTE: Llamado temporal al mock con la lista de usuarios
    return usersMock as UserKC[];
  }

  try {
    const res = await monitoringAPI<UserKC[]>({
      type: "get",
      endpoint:
        byInitiativeId === undefined
          ? `InitiativeUser/`
          : `InitiativeUser/GetByInitiative/${byInitiativeId}`,
    });

    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Uploads a collection of images to their respective API endpoints.
 *
 * @param images An array of {@link ImageUploadInfo} containing the File and its destination path.
 * @returns a `Promise<string[]>`. The array contains error messages for any failed uploads; an empty array indicates total success.
 *
 * @remarks
 * - Non-File instances in the input array are silently skipped.
 * - This function does not throw on API errors, it collects server error messages in the returned array to be handled by the caller.
 * - A `try/catch` is only necessary if you need to catch unexpected runtime or network exceptions not handled by `monitoringAPI`.
 */
export async function uploadImages(
  images: ImageUploadInfo[],
): Promise<string[]> {
  if (images.length === 0) {
    return [];
  }

  const imageUploadErrors: string[] = [];

  for (const image of images) {
    if (!(image.file instanceof File)) {
      continue;
    }

    const formData = new FormData();
    formData.append("formFile", image.file);
    const res = await monitoringAPI({
      type: "post",
      endpoint: image.path,
      options: { data: formData, headers: { accept: "*/*" } },
    });

    if (isMonitoringAPIError(res)) {
      const { status, message, data } = res;
      imageUploadErrors.push(
        `Error cargando ${image.file.name}: ${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
      );
      console.error(res);
    }
  }

  return imageUploadErrors;
}
