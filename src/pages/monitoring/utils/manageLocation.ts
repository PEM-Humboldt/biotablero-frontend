import {
  getLocationInfo,
  getLocationList,
} from "pages/monitoring/api/monitoringAPI";
import type { LocationBasicInfo } from "pages/monitoring/types/requestParams";

export const getColombianDepartments = (() => {
  let cachedDeps: { name: string; value: number }[] = [];
  let currentPromise: Promise<{ name: string; value: number }[]> | null = null;

  return async () => {
    if (cachedDeps.length > 0) {
      return cachedDeps;
    }

    if (currentPromise) {
      return currentPromise;
    }

    currentPromise = getLocationList()
      .then((deps) => {
        cachedDeps = deps;
        return deps;
      })
      .catch((err) => {
        console.error("Cannot fetch departments list", err);
        return [];
      })
      .finally(() => {
        currentPromise = null;
      });

    return currentPromise;
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
