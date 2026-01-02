import { StrValidator } from "@utils/strValidator";
import {
  getInitiatives,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
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
    ? StrValidator.normalize(lookfor.locality)
    : null;

  return inLocations.some((location) => {
    if (normalizedLookfor && location.locality) {
      const nomalizedInLocation = StrValidator.normalize(location.locality);

      if (normalizedLookfor !== nomalizedInLocation) {
        return false;
      }

      return lookfor.locationId === location.locationId;
    }

    return lookfor.locationId === location.locationId;
  });
}

/*
 * Checks if a initiative name does not exist
 *
 * @param initiativeName - the name of the initiative
 * @returns `true` if the initiative name does not exist; otherwise, `false`.
 */
export async function initiativeNameNotExist(initiativeName: string) {
  const existingInitiative = await getInitiatives({
    filter: `name eq '${initiativeName}'`,
  });

  if (isMonitoringAPIError(existingInitiative)) {
    throw new Error(existingInitiative.message);
  }

  return existingInitiative["@odata.count"] === 0;
}
