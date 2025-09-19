import { isUserType, type UserType } from "app/uim/types";

export function checkCredentials(
  required: Partial<UserType>,
  user: UserType,
): boolean {
  if (!isUserType(user)) {
    return false;
  }

  // NOTE: Esta función queda para poder hacer una
  // comprobación más robusta de los permisos de un usuario

  return required.roles?.[0] === user.roles[0];
}
