import { getUserLevels } from "pages/monitoring/api/services/user";
import type { User, UserLevel } from "pages/monitoring/types/monitoring";
import type { ODataUserInfo } from "pages/monitoring/types/requestParams";

export const USER_LEVELS: UserLevel[] = await getUserLevels();
export const NEW_ADMIN_CREDENTIALS = USER_LEVELS[0];

export function normalizeUsersFromOData(
  usersRaw: ODataUserInfo,
): Partial<User>[] {
  const { value: users } = usersRaw;

  return users.map((user) => {
    const userInfo: Partial<User> = {};
    userInfo.userName = user.username;

    return userInfo as User;
  });
}
