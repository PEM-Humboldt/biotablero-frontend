import { getLocation } from "pages/monitoring/api/monitoringAPI";

export const COLOMBIAN_DEPARTMENTS = await getLocation();

export async function getMunicipalitiesByDepartment(
  departmentId: number | string,
) {
  return await getLocation(departmentId);
}
