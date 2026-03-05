import { getUserLevels } from "pages/monitoring/api/services/user";
import type { UserItem, UserLevel } from "pages/monitoring/types/catalog";
import type { ODataUserInfo } from "pages/monitoring/types/odataResponse";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export const USER_LEVELS: UserLevel[] = await (async () => {
  const userLevels = await getUserLevels();
  if (isMonitoringAPIError(userLevels)) {
    return [];
  }
  return userLevels as UserLevel[];
})();

export const NEW_ADMIN_CREDENTIALS = USER_LEVELS[0];

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
