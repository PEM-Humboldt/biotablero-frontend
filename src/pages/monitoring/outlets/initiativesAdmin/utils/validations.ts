import { normalizeString } from "@utils/stringManipulation";
import type { LocationData } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

/**
 * Checks if a location already exists in a given collection.
 *
 * @param lookfor - The location object to validate.
 * @param inLocations - The array of existing locations to search within.
 * @returns `true` if a match is found based on name and ID; otherwise, `false`.
 */
export function locationAlreadyExist(
  lookfor: LocationData,
  inLocations: LocationData[],
): boolean {
  if (inLocations.length === 0) {
    return false;
  }

  const normalizedLookfor = lookfor?.locality
    ? normalizeString(lookfor.locality)
    : null;

  return inLocations.some((location) => {
    if (normalizedLookfor && location.locality) {
      const nomalizedInLocation = normalizeString(location.locality);
      if (normalizedLookfor !== nomalizedInLocation) {
        return false;
      }

      return lookfor.locationId === location.locationId;
    }

    return lookfor.locationId === location.locationId;
  });
}
