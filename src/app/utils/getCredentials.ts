import type { UserType } from "app/uim/types";
import {
  deleteTokensFromLS,
  getTokensFromLS,
  parseUserFromJwt,
  setTokensInLS,
} from "app/uim/utils/JWTstorage";
import { isResponseRequestError, refreshAccessToken } from "utils/cmAPI";

/**
 * Gets the current user from stored tokens.
 * Refreshes the access token if needed and updates storage.
 *
 * @returns The authenticated user or `null` if unavailable/invalid.
 */
export async function getCredentials(): Promise<UserType | null> {
  const { refreshToken: oldRefreshToken } = getTokensFromLS();
  if (!oldRefreshToken) {
    return null;
  }

  const res = await refreshAccessToken(oldRefreshToken);
  if (isResponseRequestError(res)) {
    console.error(`status ${res.status}, ${res.message}`);
    deleteTokensFromLS();

    // TODO: No ser tan guache y redirigir a página de logout
    window.location.reload();
    return null;
  }

  const { access_token, refresh_token } = res;
  setTokensInLS(access_token, refresh_token);
  const updatedUser = parseUserFromJwt(access_token);
  return updatedUser;
}

/**
 * Compares if an object matches the shape and values of a partial object.
 *
 * @param thisObject - The source object.
 * @param has - The partial object to check against.
 * @returns `true` if `thisObject` matches `has`, otherwise `false`.
 */
export function partialComparison<T extends Record<string, unknown>>(
  thisObject: T,
  has: Partial<T>,
): boolean {
  if (typeof has !== typeof thisObject) {
    return false;
  }

  for (const key of Object.keys(has)) {
    const required = has[key];
    const userHas = thisObject[key];

    if (required && typeof required === "object") {
      const result = partialComparison(
        userHas as Record<string, unknown>,
        required as Record<string, unknown>,
      );

      if (!result) {
        return false;
      }
      continue;
    }

    if (Array.isArray(required) && Array.isArray(userHas)) {
      for (let i = 0; i < required.length; i++) {
        if (required[i] !== userHas[i]) {
          return false;
        }
      }
      continue;
    }

    if (required !== userHas) {
      return false;
    }
  }

  return true;
}
