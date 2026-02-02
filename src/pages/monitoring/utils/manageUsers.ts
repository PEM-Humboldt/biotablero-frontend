import { getUserLevels } from "pages/monitoring/api/monitoringAPI";
import type {
  User,
  UserKC,
  UserLevel,
} from "pages/monitoring/types/monitoring";

export const USER_LEVELS: UserLevel[] = await getUserLevels();
export const NEW_ADMIN_CREDENTIALS = USER_LEVELS[0];

export function normalizeUsersFromKC(usersRaw: UserKC[]): Partial<User>[] {
  return usersRaw.map((user) => {
    const userInfo: Partial<User> = {};
    userInfo.userName = user.username;

    return userInfo as User;
  });
}
