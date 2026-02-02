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
 * Generates an OData filter string based on the component type, value, and config.
 *
 * This function handles multi-field filtering, nested collection filtering,
 * apply 'any(l: ...)' when 'oDataEntity' is set, and ensures case-insensitivity
 * for 'text' searches.
 *
 * @template T - Type of the OData object model
 * @param component - Search bar component with type element type
 * @param value - the value from the input
 * @returns OData filter expression or null if value is empty
 *
 * ---
 *
 * **Filter Generation Logic:**
 *
 * * **'text'**: `contains(tolower(field), 'value')` for case-insensitive partial matches.
 * * **'number'**: `field eq value` for exact numeric matches.
 * * **'select'**: `field eq 'value'` for exact string matches (quotes non-num values).
 * * **'date'**: `field {operator} value` where operator is eq/ge/le.
 */
export function makeODataFilterString<T>(
  component: SearchBarComponent<T>,
  value: string,
): string | null {
  if (!value) {
    return null;
  }

  const alias = "l";
  const prefix = component.oDataEntity ? `${alias}/` : "";
  const filterStrings: string[] = [];

  const selectFormatters: Record<string, (val: string) => string> = {
    boolean: (val) => val,
    number: (val) => val,
    string: (val) => `'${val}'`,
  };

  for (const source of component.source) {
    let base: string | null;

    switch (component.type) {
      case "text": {
        const normalizaedSource = `tolower(${prefix}${source as string})`;
        base = `contains(${normalizaedSource}, '${value.toLowerCase()}')`;
        break;
      }

      case "number":
      case "select": {
        let type: keyof typeof selectFormatters = "string";

        if (value === "true" || value === "false") {
          type = "boolean";
        } else if (!isNaN(Number(value)) && value.trim() !== "") {
          type = "number";
        }

        const valueFormatted = selectFormatters[type](value);
        base = `${prefix}${source as string} eq ${valueFormatted}`;
        break;
      }

      case "date": {
        const operator = component.dateOperator ?? "eq";
        base = `${prefix}${source as string} ${operator} ${value}`;
        break;
      }

      default:
        base = "";
    }

    filterStrings.push(base);
  }

  return prefix
    ? `${component.oDataEntity}/any(${alias}: ${filterStrings.join(" or ")})`
    : filterStrings.join(" or ");
}
