import { LOCALE } from "@config/global";
import { LocationObj } from "pages/monitoring/types/initiative";
import { LocationCompleteInfo } from "pages/monitoring/types/odataResponse";

/**
 * Give format to a number and set max number of decimals
 *
 * @param value - number to be formatted
 * @param decimals - max amount of decimals percentage value
 */
export function formatNumber(value: string | number, decimals: number) {
  return Number(value).toLocaleString(LOCALE, {
    maximumFractionDigits: decimals,
  });
}

/*
 * Transforms fast any string to a number within a range from 0 to a fixed and consistent number
 */
export function hashStringToRange(str: string, range: number = 10): number {
  let hash = 5381;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }

  return Math.abs(hash) % (range + 1);
}

export function capitalize(name?: string) {
  if (!name) {
    return "";
  }

  return name
    .split(" ")
    .map(
      (w) =>
        `${w[0].toLocaleUpperCase(LOCALE)}${w.slice(1).toLocaleLowerCase(LOCALE)}`,
    )
    .join(" ");
}

/*
 * Creates locations string to render in the ui
 *
 * @param locations - An array of the locations info
 * @param locationSeparator - An optional string to separate the locations
 */
export function makeInitiativeLocationsString(
  locations: (LocationCompleteInfo | LocationObj)[],
  locationSeparator = " - ",
) {
  return locations
    .map((l) => {
      const isLocationComplete = "municipality" in l;
      const localityStr = l.locality;
      const municipalityStr = isLocationComplete
        ? l.municipality
        : l.location.name;
      const department = isLocationComplete
        ? l.department
        : (l.location?.parent?.name ?? "");

      const municipality = municipalityStr ? `, ${municipalityStr}` : "";
      const locality = localityStr ? ` - ${localityStr}` : "";

      return `${department}${municipality}${locality}`;
    })
    .join(locationSeparator);
}
