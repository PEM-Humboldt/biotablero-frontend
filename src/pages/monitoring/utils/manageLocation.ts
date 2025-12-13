import { getLocation } from "pages/monitoring/api/monitoringAPI";

export const COLOMBIAN_DEPARTMENTS = await getLocation();

const municipalitiesCache: {
  [key: string | number]: { name: string; value: number }[];
} = {};

export async function getMunicipalitiesByDepartment(
  departmentId: number | string,
) {
  if (departmentId in municipalitiesCache) {
    return municipalitiesCache[departmentId];
  }

  municipalitiesCache[departmentId] = await getLocation(departmentId);
  return municipalitiesCache[departmentId];
}
