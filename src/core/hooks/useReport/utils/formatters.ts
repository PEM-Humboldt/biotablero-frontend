import type { LocationCompleteInfo } from "pages/monitoring/types/odataResponse";

export function makeLocationsString(locations: LocationCompleteInfo[]) {
  return locations
    .map((l) => {
      const municipality = l.location.name ? `, ${l.location.name}` : "";
      const locality = l.locality ? ` - ${l.locality}` : "";
      const department = l.location?.parent ? l.location.parent.name : "";

      return `${department}${municipality}${locality}`;
    })
    .join(" | ");
}
