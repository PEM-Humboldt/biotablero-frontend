import type { ApiRequestError } from "@appTypes/api";

/**
 * Creates a curried API error parser that maps backend validation errors
 * to their corresponding form input fields.
 * * This function captures a list of valid field names to ensure type safety
 * and maps any unrecognized or missing fields to a fallback "root" key.
 *
 * @template T - String union representing the valid form field names.
 * @param inputFields - Readonly array of allowed field names (should match backend field definitions).
 * @returns A specialized function to transform `ApiRequestError` into a grouped error object.
 *
 * @example
 * const parseTSErrors = createErrorObjectParser(TS_ERROR_FIELDS);
 * const errors = parseTSErrors(apiErrorResponse);
 * // Output: { title: ["Too short"], root: ["Server connection failed"] }
 */
export function createErrorObjectParser<T extends string>(
  inputFields: readonly T[],
) {
  const fields = inputFields as readonly string[];
  return function makeApiResponseErrorObject(errors: ApiRequestError) {
    return errors.data.reduce<Partial<Record<T | "root", string[]>>>(
      (all, crr) => {
        const key = (
          !crr.field || !fields.includes(crr.field) ? "root" : crr.field
        ) as T;

        if (!all[key]) {
          all[key] = [];
        }
        all[key].push(crr.msg);

        return all;
      },
      {},
    );
  };
}
