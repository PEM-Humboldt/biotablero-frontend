import type { QueryParams } from "@appTypes/htmlRequest";

/**
 * Serializes a flat object of query parameters into a URL-safe query string.
 *
 * @param params The object containing the key-value parameters to serialize.
 * The values can be strings, numbers, booleans, or arrays of these primitives.
 *
 * @returns The resulting query string, excluding the leading '?'.
 */
export function serializeQueryParams(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
