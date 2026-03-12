import type { ApiRequestError } from "@appTypes/api";
import { type YoutubeVideoMetadata } from "pages/monitoring/api/services/youtube";

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

/**
 * Type guard to determine if a response object is a Youtube video metadata.
 *
 * @param response - The value to check.
 * @returns `true` if the value is a `YoutubeVideoMetadata`, otherwise `false`.
 */
export function isYoutubeVideoMetadata(
  data: unknown,
): data is YoutubeVideoMetadata {
  return (
    typeof data === "object" &&
    data !== null &&
    "youtubeId" in data &&
    "title" in data &&
    "author" in data &&
    "thumbnail" in data &&
    "url" in data
  );
}
