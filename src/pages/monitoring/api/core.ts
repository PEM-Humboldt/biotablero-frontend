import { isAxiosError, type AxiosResponse } from "axios";
import type { ApiRequestError, DataError } from "@appTypes/api";
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
    console.error("Error trace", err);

    if (isAxiosError(err) && err.response) {
      const errors = err.response.data as {
        data: DataError[];
      };

      const responseUI =
        typeof errors === "string"
          ? [
              {
                msg:
                  apiErrorMsg[err.status ?? 500] ??
                  commonErrorMessage[err.response.status],
                field: undefined,
              },
            ]
          : errors.data.map((error) => {
              const category = apiErrorCategory[error.code.slice(0, 3)];
              const message = apiErrorMsg[error.code];
              const fieldStr = error.field
                ? ` dentro del campo '${error.field}'`
                : "";

              return {
                msg: `Error en ${category}${fieldStr}: ${message}.`,
                field: error.field,
              };
            });

      return {
        status: err.response.status,
        message: commonErrorMessage[err.response.status] || "Request failed",
        data:
          responseUI.length === 0
            ? [{ msg: "Error desconocido", field: undefined }]
            : responseUI,
      };
    }

    return {
      status: 503,
      message: "Couldn't connect with the server",
      data: [],
    };
  }
}
