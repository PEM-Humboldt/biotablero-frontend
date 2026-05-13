import { getUserLevels } from "pages/monitoring/api/services/user";
import type { UserItem, UserLevel } from "pages/monitoring/types/catalog";
import type { ODataUserInfo } from "pages/monitoring/types/odataResponse";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

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

/*
 * It takes the sources of info and makes a normalized user object
 *
 * @param usersRaw - The OData response containig basic user info
 * @returns An array containigg all the users info
 */
export function normalizeUsersFromOData(
  usersRaw: ODataUserInfo,
): Partial<UserItem>[] {
  const { value: users } = usersRaw;

  return users.map((user) => {
    const userInfo: Partial<UserItem> = {};
    userInfo.userName = user.username;

    return userInfo as UserItem;
  });
}
