import { type ODataParams } from "@appTypes/odata";
import type { ODataLog } from "pages/monitoring/types/requestParams";

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

  if (isMonitoringAPIError(result)) {
    throw new Error(result.message);
  }

  return result;
}
