import { getLocationInfoById } from "pages/monitoring/utils/manageLocation";
import type { LocationObj } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export async function makeLocationObj(
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
