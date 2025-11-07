import type { ODataParams } from "@appTypes/odata";

export function oDataToString(oDataParams: ODataParams): string {
  return Object.entries(oDataParams)
    .filter(([_, value]) => value !== "" && value != null)
    .map(([param, value]) => `$${param}=${encodeURIComponent(String(value))}`)
    .join("&");
}
