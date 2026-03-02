import type { ApiRequestError } from "@appTypes/api";

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
