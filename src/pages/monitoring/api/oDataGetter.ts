import type { ApiRequestError } from "@appTypes/api";
import { type ODataParams } from "@appTypes/odata";
import { monitoringAPI } from "pages/monitoring/api/core";

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
export function createODataGetter<T>(endpoint: string) {
  return async (odataParams: ODataParams): Promise<T | ApiRequestError> => {
    const result = await monitoringAPI<T>({
      endpoint,
      type: "get",
      options: { oData: odataParams },
    });

    return result;
  };
}
