import type { LocationBasicInfo } from "pages/monitoring/types/requestParams";
import type { Location } from "pages/monitoring/types/monitoring";

import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

/**
 * Retrieves the list of available all the locations from the Monitoring API.
 * This function is typically used to populate cascading dropdown selectors.
 *
 * @param parentId [Optional] The ID of the parent location from which to fetch
 * sub-locations. If omitted, the function returns all the parent locations.
 *
 * @returns A Promise that resolves to an array of location objects formatted
 * for a selector:
 * - `name`: The location's name.
 * - `value`: The location's numeric ID.
 */
export async function getLocationList(parentId?: number | string) {
  try {
    const queryParam = parentId !== undefined ? `?parentId=${parentId}` : "";
    const res = await monitoringAPI<Location[]>({
      type: "get",
      endpoint: `Location${queryParam}`,
    });
    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }

    return res.map(({ name, id }) => ({ name, value: id }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * Retrieves detailed information for a specific location from the Monitoring API.
 * This function is used to fetch the full data of a single location, such as
 * its department and municipality names, based on its unique identifier.
 *
 * @param locationId - The unique numeric or string ID of the location to retrieve.
 *
 * @returns A Promise that resolves to:
 * - A `LocationBasicInfo` object containing the location's details if successful.
 * - `undefined` if an error occurs during the fetch process.
 */
export async function getLocationInfo(locationId: number | string) {
  try {
    const res = await monitoringAPI<LocationBasicInfo>({
      type: "get",
      endpoint: `Location/${locationId}`,
    });
    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }

    return res;
  } catch (err) {
    console.error(err);
  }
}
