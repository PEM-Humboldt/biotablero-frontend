import { getUserLevels } from "pages/monitoring/api/services/user";
import type { UserLevel } from "pages/monitoring/types/catalog";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

/**
 * Creates a function that retrieves the user levels and caches the response.
 *
 * @returns A function that, when invoked, returns a promise resolving to
 * an array containing all user levels or the cached info.
 */
function fetchUserLevels() {
  let userLevels: UserLevel[] = [];

  return async () => {
    if (userLevels.length > 0) {
      return userLevels;
    }
    const res = await getUserLevels();
    if (isMonitoringAPIError(res)) {
      return [];
    }

    userLevels = res;

    return userLevels;
  };
}

export const userLevels = fetchUserLevels();
