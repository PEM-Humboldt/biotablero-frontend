import { getLocationInfoById } from "pages/monitoring/utils/manageLocation";
import type { LocationObj } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { LocationCompleteInfo } from "pages/monitoring/types/requestParams";

export async function fetchAndMakeLocationObj(
  locationId: number,
  locality?: string,
): Promise<LocationObj | null> {
  const info = await getLocationInfoById(locationId);
  if (!info) {
    return null;
  }
  const isMunicipality = !!info.parent;

  return {
    department: isMunicipality ? info.parent!.name : info.name,
    municipality: isMunicipality ? info.name : null,
    locality: locality ?? null,
  };
}

export function makeLocationObj(
  locationInfo: LocationCompleteInfo,
): LocationObj {
  const { location, locality } = locationInfo;
  const isMunicipality = !!location.parent;

  return {
    department: isMunicipality ? location.parent!.name : location.name,
    municipality: isMunicipality ? location.name : null,
    locality: locality ?? null,
  };
}
