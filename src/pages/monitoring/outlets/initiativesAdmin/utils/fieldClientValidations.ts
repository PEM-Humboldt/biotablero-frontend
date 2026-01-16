import { StrValidator } from "@utils/strValidator";
import {
  getInitiatives,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import {
  isLocationObj,
  type LocationDataBasic,
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
  lookfor: LocationDataBasic,
  inLocations: (LocationDataBasic | LocationObj)[],
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

/**
 * Higher-order function that makes a validation bypass based on an exception flag.
 *
 * @template T - The return type of the callback, either `boolean` or `Promise<boolean>`.
 * @param callback - The validation function to execute if exemption is false.
 * @param exception - If `true`, the validation is bypassed and returns a callback tthat return true.
 * @returns  returns a callback that resolves in boolean.
 */
export function validationExemption<T extends boolean | Promise<boolean>>(
  callback: (str: string) => T,
  exception: boolean,
): (str: string) => T {
  if (exception) {
    return (_: string) => true as T;
  }

  return callback;
}
