import {
  getLocationInfo,
  getLocationsList,
} from "pages/monitoring/api/services/location";
import type { LocationBasicInfo } from "pages/monitoring/types/odataResponse";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export const getColombianDepartments = (() => {
  let cachedDeps: { name: string; value: number }[] = [];

  return async () => {
    if (cachedDeps.length > 0) {
      return cachedDeps;
    }

    const departmentsList = await getLocationsList();
    if (isMonitoringAPIError(departmentsList)) {
      return [];
    }

    cachedDeps = departmentsList.map(({ name, id }) => ({ name, value: id }));

    return cachedDeps;
  };
})();

void getColombianDepartments();

const municipalitiesCache: {
  [key: string | number]: { name: string; value: number }[];
} = {};

export async function getMunicipalitiesByDepartment(
  departmentId: number | string,
) {
  if (departmentId in municipalitiesCache) {
    return municipalitiesCache[departmentId];
  }

  const municipalities = await getLocationsList(departmentId);
  if (isMonitoringAPIError(municipalities)) {
    return [];
  }

  municipalitiesCache[departmentId] = municipalities.map(({ name, id }) => ({
    name,
    value: id,
  }));

  return municipalitiesCache[departmentId];
}

const locationDataCache: { [key: string]: LocationBasicInfo } = {};

export async function getLocationInfoById(id: string | number) {
  const idString = String(id);
  if (idString in locationDataCache) {
    return locationDataCache[idString];
  }

  const reqLocationData = await getLocationInfo(id);
  if (isMonitoringAPIError(reqLocationData) || !reqLocationData) {
    return null;
  }

  locationDataCache[idString] = reqLocationData;
  return locationDataCache[idString];
}
