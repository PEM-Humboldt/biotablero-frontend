import type { ODataParams, SearchBarComponent } from "@appTypes/odata";

/**
 * Converts an OData parameters object into a URL query string.
 *
 * @param oDataParams - Object containing OData query parameters (e.g., filter, select, orderby)
 * @returns URI-encoded query string with OData syntax ($param=value&...)
 */
export function oDataToString(oDataParams: ODataParams): string {
  return Object.entries(oDataParams)
    .filter(([_, value]) => value !== "" && value != null)
    .map(([param, value]) => `$${param}=${encodeURIComponent(String(value))}`)
    .join("&");
}

/**
 * Generates an OData filter string based on component type and value.
 *
 * @template T - Type of the OData object model
 * @param component - Search bar component with type element type
 * @param value - the value from the input
 * @returns OData filter expression or null if value is empty
 *
 * Filter generation by type:
 * - `text`: `contains(field, 'value')` for partial matches
 * - `number`: `field eq value` for exact numeric matches
 * - `date`: `field {operator} value` where operator is eq/ge/le from component config
 * - `select`: `field eq 'value'` for exact string matches
 */
export function MakeODataFilterString<T>(
  component: SearchBarComponent<T>,
  value: string,
): string | null {
  if (!value) {
    return null;
  }

  switch (component.type) {
    case "text":
      return `contains(${component.source as string}, '${value}')`;
    case "number":
      return `${component.source as string} eq ${value}`;
    case "date": {
      const operator = component.dateOperator ?? "eq";
      return `${component.source as string} ${operator} ${value}`;
    }
    case "select":
      return `${component.source as string} eq '${value}'`;
    default:
      return null;
  }
}
