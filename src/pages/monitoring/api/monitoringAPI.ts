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
import { isODataParams, type ODataParams } from "@appTypes/odata";
import type {
  InitiativeUser,
  LocationBasicInfo,
  ODataInitiative,
  ODataLog,
  ODataUserInfo,
  ODataUserRequest,
  UserInInitiative,
} from "pages/monitoring/types/odataResponse";
import { oDataToString } from "@utils/odata";
import type { Location, UserLevel } from "pages/monitoring/types/catalog";
import { serializeQueryParams } from "@utils/htmlRequest";
import type { QueryParams, RequestBody } from "@appTypes/htmlRequest";
import type { InitiativeFullInfo } from "pages/monitoring/types/initiative";
import { commonErrorMessage } from "@utils/ui";
import type { RoleInInitiative } from "pages/monitoring/types/catalog";
import type { UserJoinRequestData } from "pages/monitoring/types/userJoinRequest";

interface ExtendedAxiosReqConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type RequestData = RequestBody | FormData;

type ResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";

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
        responseType?: ResponseType;
      };
    }
  | {
      type: "delete";
      options?: {
        data?: QueryParams;
        headers?: Record<string, string>;
        responseType?: ResponseType;
      };
    }
  | {
      type: "put" | "post";
      options?: {
        data?: RequestData;
        headers?: Record<string, string>;
        responseType?: ResponseType;
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

      response = await monitoringClient[type]<T>(fullEndpoint, {
        responseType: options?.responseType,
      });
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
  return async (odataParams?: ODataParams): Promise<T> => {
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
 * Retrieves users from the Monitoring API.
 *
 * @param idOrOdata - OPTIONAL. Can be an Initiative ID (number/string) to get associated users, or an ODataParams object to filter the general user list. If no param is passed, it will return all the users
 * @returns A `Promise` resolving to:
 * - `InitiativeUser[]` if an Initiative ID is provided.
 * - `ODataUserInfo[]` if an OData object is provided or if called without arguments.
 */
export async function getUsers(
  oDataParams?: ODataParams,
): Promise<ODataUserInfo>;
export async function getUsers(
  byInitiativeId: number | string,
): Promise<InitiativeUser[]>;
export async function getUsers(
  idOrOdata?: ODataParams | number | string,
): Promise<InitiativeUser[] | ODataUserInfo> {
  const isId = typeof idOrOdata === "string" || typeof idOrOdata === "number";
  const endpoint = isId
    ? `InitiativeUser/GetByInitiative/${idOrOdata}`
    : "User";
  const oDataParams =
    idOrOdata !== undefined && !isId && isODataParams(idOrOdata)
      ? idOrOdata
      : undefined;

  try {
    const res = await monitoringAPI<InitiativeUser[] | ODataUserInfo>({
      type: "get",
      endpoint,
      options: { oData: oDataParams },
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

/**
 * Fetches the basic information of initiatives associated with the current user.
 *
 * @returns a `Promise<UserInitiatives[]>`. An array of {@link UserInInitiative}; returns an empty array if the request fails or no initiatives are found.
 *
 * @remarks
 * - This function handles API errors internally by logging them to the console and returning an empty collection.
 * - It specifically catches both structured API errors (via `isMonitoringAPIError`) and unexpected runtime exceptions.
 */
export async function getUserInitiativesInfo() {
  try {
    const res = await monitoringAPI<UserInInitiative[]>({
      type: "get",
      endpoint: "Auth/InitiativesData",
    });

    if (isMonitoringAPIError(res)) {
      const { status, message, data } = res;
      console.error(
        commonErrorMessage[status] ?? message,
        data ? `: ${data}` : ".",
      );
      return [];
    }

    return res;
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * Retrieves a paginated and filtered list of join requests for a specific initiative using OData parameters.
 *
 * @param initiativeId The unique identifier of the initiative.
 * @param oData An object of type {@link ODataParams} containing query transformations.
 * @returns a `Promise<ODataUserRequest | null>`.
 *
 * @remarks
 * - Failed requests are logged to the console and return `null` to be handled by the caller's state management.
 * - A `try/catch` block is included to prevent network-level exceptions from bubbling up unhandled.
 */
export async function getInitiativeRequests(
  initiativeId: number,
  oData: ODataParams,
) {
  try {
    const res = await monitoringAPI<ODataUserRequest>({
      type: "get",
      endpoint: "JoinRequest",
      options: { data: { initiativeId }, oData },
    });

    if (isMonitoringAPIError(res)) {
      console.error(res.message);
      return null;
    }

    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Retrieves the list of join requests submitted by the current authenticated user.
 *
 * @returns a `Promise<UserJoinRequestData[]>`.
 *
 * @remarks
 * - If the request fails or an error is detected, it logs the error and returns an empty array `[]`.
 */
export async function getUserJoinRequests() {
  const res = await monitoringAPI<UserJoinRequestData[]>({
    type: "get",
    endpoint: "JoinRequest/MyRequests",
  });

  if (isMonitoringAPIError(res)) {
    console.error(res);
    return [];
  }

  return res;
}

/**
 * Submits a new request for the current authenticated user to join a specific initiative with a designated role.
 *
 * @param initiativeId - The unique identifier of the initiative.
 * @param asRole - The role defined by {@link RoleInInitiative} the user is requesting.
 * @returns a `Promise<string | null>` containing a formatted error message if the request fails, or `null` on success.
 *
 * @remarks
 * - Error messages are localized using `commonErrorMessage` and may include additional server-provided data.
 * - Success is represented by `null`, indicating the request was processed correctly.
 */
export async function makeJoinRequestToInitiative(
  initiativeId: number,
  asRole: RoleInInitiative,
) {
  const res = await monitoringAPI({
    type: "post",
    endpoint: "JoinRequest",
    options: { data: { initiativeId, level: { id: asRole } } },
  });

  if (isMonitoringAPIError(res)) {
    const { status, message, data } = res;
    console.error(message);

    return `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`;
  }

  return null;
}

/**
 * Cancels a pending join request.
 *
 * @param requestId - The id of the user's relation with the request.
 * @returns a `Promise<string | null>` containing a formatted error message if the deletion fails, or `null` on success.
 */
export async function cancelJoinRequestToInitiative(requestId: number) {
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `JoinRequest/Cancel/${requestId}`,
  });

  if (isMonitoringAPIError(res)) {
    const { status, message, data } = res;
    console.error(message);

    return `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`;
  }

  return null;
}

/**
 * Removes the current user from an initiative they are already a member of.
 *
 * @param userIdInInitiative - The unique identifier of the membership record.
 * @returns a `Promise<string | null>` containing a formatted error message if the operation fails, or `null` on success.
 */
export async function leaveInitiative(userIdInInitiative: number) {
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `InitiativeUser/${userIdInInitiative}`,
  });

  if (isMonitoringAPIError(res)) {
    const { status, message, data } = res;
    console.error(message);

    return `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`;
  }

  return null;
}

/**
 * Makes the reques for the xslx file with optional OData query parameters.
 *
 * This function is a thin wrapper around `monitoringAPI` specialized for the `"Logs/xlsx"` endpoint.
 * Throws an error if the request fails or the backend returns an error response.
 *
 * @param odataParams - Optional OData query parameters to filter, sort, or paginate results.
 * @returns A `Promise` resolving to a `Blob` object containing the logs data.
 * @throws If the API returns a `RequestError` or the request fails.
 */
export async function downloadLogs(odataParams: ODataParams = {}) {
  const result = await monitoringAPI<Blob>({
    endpoint: "Logs/xlsx",
    type: "get",
    options: { oData: odataParams, responseType: "blob" },
  });

  if (isMonitoringAPIError(result)) {
    throw new Error(result.message);
  }

  return result;
}
