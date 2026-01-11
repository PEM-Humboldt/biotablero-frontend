import { StrValidator } from "@utils/strValidator";
import {
  getInitiatives,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import {
  isLocationObj,
  type LocationData,
  type LocationObj,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

/**
 * Checks if a location already exists in a given collection.
 *
 * @param lookfor - The location object to validate.
 * @param inLocations - The array of existing locations to search within.
 * @returns `true` if a match is found based on name and ID; otherwise, `false`.
 */
export function locationAlreadyExist(
  lookfor: LocationData,
  inLocations: (LocationData | LocationObj)[],
): boolean {
  if (inLocations.length === 0) {
    return false;
  }

  const normalizedLookforLocality = lookfor?.locality
    ? StrValidator.normalize(lookfor.locality)
    : null;

  return inLocations.some((location) => {
    const normalizedInLocationLocality = location.locality
      ? StrValidator.normalize(location.locality)
      : null;

    if (normalizedLookforLocality !== normalizedInLocationLocality) {
      return false;
    }

    if (isLocationObj(location)) {
      return (
        lookfor.locationId === location.municipalityId ||
        lookfor.locationId === location.departmentId
      );
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
