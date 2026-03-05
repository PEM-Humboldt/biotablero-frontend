import { type ODataParams } from "@appTypes/odata";

import type {
  LogEntryFull,
  ODataLog,
} from "pages/monitoring/types/odataResponse";
import type { LogTypeValue } from "pages/monitoring/api/types/definitions";
import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";

/**
 * Fetches log records from the "Logs" endpoint of the Monitoring API.
 *
 * @param odataParams Optional OData query parameters (filtering, pagination, etc.).
 *
 * @returns A Promise that resolves to:
 * - On success: A `ODataLog` object.
 * - On failure: A `ApiRequestError` object.
 */
export const getLogs = createODataGetter<ODataLog>("Logs");

/**
 * Makes the request for the xslx file with optional OData query parameters.
 *
 * @param odataParams - Optional OData query parameters to filter, sort, or paginate results.
 *
 * @returns A Promise that resolves to:
 * - On success: a `Blob` object containing the logs data.
 * - On failure: A `ApiRequestError` object.
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
 * @returns A Promise that resolves to:
 * - On success: a list with the LogTypeValues.
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A Promise that resolves to:
 * - On success: the entire log object.
 * - On failure: A `ApiRequestError` object.
 */
export async function fetchLogDetails(logId: string) {
  const res = await monitoringAPI<LogEntryFull>({
    type: "get",
    endpoint: `Logs/${logId}`,
  });

  return res;
}
