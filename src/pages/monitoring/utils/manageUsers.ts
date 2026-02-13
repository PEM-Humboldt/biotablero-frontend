import { getUserLevels } from "pages/monitoring/api/monitoringAPI";
import type { UserItem, UserLevel } from "pages/monitoring/types/monitoring";
import type { ODataUserInfo } from "pages/monitoring/types/requestParams";

export const USER_LEVELS: UserLevel[] = await getUserLevels();
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
