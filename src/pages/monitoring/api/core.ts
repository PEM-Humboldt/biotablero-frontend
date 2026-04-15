import axios, { isAxiosError, type AxiosResponse } from "axios";
import type { ApiRequestError, DataError, ErrorUIMessage } from "@appTypes/api";
import { oDataToString } from "@utils/odata";
import { serializeQueryParams } from "@utils/htmlRequest";
import type { QueryParams } from "@appTypes/htmlRequest";
import { monitoringClient } from "pages/monitoring/api/client";

import type {
  RequestData,
  MonitoringAPIParams,
  ResponseWithStatus,
} from "pages/monitoring/api/types/definitions";
import {
  apiErrorCategory,
  apiErrorMsg,
  commonErrorMessage,
} from "pages/monitoring/api/errorsDictionary";

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
 * - On failure: A `ApiRequestError` object.
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
    const { data, headers, signal } = options ?? {};

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
        signal,
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
        { headers, signal },
      );
    }

    return getStatus
      ? { data: response.data, status: response.status }
      : response.data;
  } catch (err) {
    if (axios.isCancel(err)) {
      return {
        status: 0,
        message: "Request cancelled by the user",
        data: [],
      };
    }

    if (import.meta.env.VITE_ENVIRONMENT === "develop") {
      console.error("error trace", err);
    }

    if (isAxiosError(err) && err.response) {
      const responseData = err.response.data as {
        data: DataError[];
      };
      const responseUI: ErrorUIMessage[] = [];

      const errorItems =
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData
          ? responseData.data
          : [];

      if (errorItems.length > 0) {
        errorItems.forEach((error) => {
          const category = apiErrorCategory[error.code.slice(0, 3)] ?? "Error";
          const message = apiErrorMsg[error.code] ?? "Detalle no disponible";
          const fieldStr = error.field ? ` en el campo '${error.field}'` : "";

          responseUI.push({
            msg: `Error en ${category}${fieldStr}: ${message}.`,
            field: error.field,
          });
        });
      } else {
        responseUI.push({
          msg:
            apiErrorMsg[err.response.status] ??
            commonErrorMessage[err.response.status] ??
            "Error no especificado",
          field: undefined,
        });
      }

      return {
        status: err.response.status,
        message: commonErrorMessage[err.response.status] || "Request failed",
        data: responseUI,
      };
    }

    return {
      status: 503,
      message: "Couldn't connect with the server",
      data: [],
    };
  }
}
