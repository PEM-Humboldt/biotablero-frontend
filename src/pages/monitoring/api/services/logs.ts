import { type ODataParams } from "@appTypes/odata";

import type {
  LogEntryFull,
  ODataLog,
} from "pages/monitoring/types/requestParams";
import type { LogTypeValue } from "pages/monitoring/api/types/definitions";
import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";

/**
 * Fetches log records from the "Logs" endpoint of the Monitoring API.
 *
 * @param odataParams Optional OData query parameters (filtering, pagination, etc.).
 * @returns A `Promise` that resolves to an `ODataLog` object.
 */
export const getLogs = createODataGetter<ODataLog>("Logs");

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

  return result;
}

/**
 * Retrieves a list of available log categories.
 *
 * @returns A `Promise<string[]>`.
 *
 * @remarks
 * - Internally maps LogTypeValue objects to extract only the `name` property.
 * - API errors are intercepted via `isMonitoringAPIError` to ensure a safe fallback.
 */
export async function getLogTypes() {
  const res = await monitoringAPI<LogTypeValue[]>({
    type: "get",
    endpoint: "LogType",
  });

  return res;
}

/**
 * Retrieves the full details of a specific log entry by its ID.
 *
 * @param logId - The unique identifier of the log entry.
 * @returns A `Promise` resolving to a LogEntryFull object.
 */
export async function fetchLogDetails(logId: string) {
  const res = await monitoringAPI<LogEntryFull>({
    type: "get",
    endpoint: `Logs/${logId}`,
  });

  return res;
}
