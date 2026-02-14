import { getLocationInfoById } from "pages/monitoring/utils/manageLocation";
import type {
  LocationDataBasic,
  LocationObj,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { LocationCompleteInfo } from "pages/monitoring/types/odataResponse";

export async function fetchAndMakeLocationObj(
  value: LocationDataBasic,
): Promise<LocationObj | null> {
  const { locationId, locality } = value;
  const info = await getLocationInfoById(locationId);
  if (!info) {
    return null;
  }
  const isMunicipality = !!info.parent;

  return {
    id: info.id,
    departmentId: isMunicipality ? info.parent!.id : info.id,
    department: isMunicipality ? info.parent!.name : info.name,
    municipalityId: isMunicipality ? info.id : null,
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
    id: locationInfo.id,
    departmentId: isMunicipality ? location.parent!.id : location.id,
    department: isMunicipality ? location.parent!.name : location.name,
    municipalityId: isMunicipality ? location.id : null,
    municipality: isMunicipality ? location.name : null,
    locality: locality ?? null,
  };
}
