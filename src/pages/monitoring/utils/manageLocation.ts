import {
  getLocationInfo,
  getLocationList,
} from "pages/monitoring/api/monitoringAPI";
import type { LocationBasicInfo } from "pages/monitoring/types/requestParams";

export const COLOMBIAN_DEPARTMENTS = await getLocationList();

const municipalitiesCache: {
  [key: string | number]: { name: string; value: number }[];
} = {};

export async function getMunicipalitiesByDepartment(
  departmentId: number | string,
) {
  if (departmentId in municipalitiesCache) {
    return municipalitiesCache[departmentId];
  }

  municipalitiesCache[departmentId] = await getLocationList(departmentId);
  return municipalitiesCache[departmentId];
}

const locationDataCache: { [key: string]: LocationBasicInfo } = {};

export async function getLocationInfoById(id: string | number) {
  const idString = String(id);
  if (idString in locationDataCache) {
    return locationDataCache[idString];
  }

  const reqLocationData = await getLocationInfo(id);
  if (!reqLocationData) {
    return null;
  }

  locationDataCache[idString] = reqLocationData;
  return locationDataCache[idString];
}
