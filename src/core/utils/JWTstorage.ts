import type { Tokens, UserType } from "@appTypes/user";

/**
 * Retrieves the JWT tokens stored in `localStorage`.
 *
 * @returns An object containing the access and refresh tokens, or `null` values if not set.
 */
export function getTokensFromLS(): Tokens {
  return {
    accessToken: localStorage.getItem("BT_access"),
    refreshToken: localStorage.getItem("BT_refresh"),
  };
}

/**
 * Removes all JWT tokens from `localStorage`.
 *
 * Use this when the user logs out or when tokens need to be invalidated.
 */
export function deleteTokensFromLS(): void {
  localStorage.removeItem("BT_access");
  localStorage.removeItem("BT_refresh");
}

/**
 * Stores the given tokens in `localStorage`.
 *
 * @param accessToken - The JWT access token to store.
 * @param refreshToken - (Optional) The JWT refresh token to store.
 */
export function setTokensInLS(
  accessToken: string,
  refreshToken?: string,
): void {
  localStorage.setItem("BT_access", accessToken);
  if (refreshToken !== undefined) {
    localStorage.setItem("BT_refresh", refreshToken);
  }
}

/**
 * Decodes a JWT and extracts its payload.
 *
 * @typeParam T - The expected shape of the payload.
 * @param token - A valid JWT string.
 * @returns The decoded payload cast to type `T`.
 *
 * @throws Will throw if the token is malformed or cannot be decoded.
 */
export function getJwtPayload<T>(token: string): T {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const binaryString = window.atob(base64);
  const jsonPayload = new TextDecoder().decode(
    Uint8Array.from(binaryString, (byte) => byte.charCodeAt(0)),
  );
  return JSON.parse(jsonPayload) as T;
}

/**
 * Type guard that checks if a given object matches the `UserType` structure.
 *
 * @param userObj - The object to validate.
 * @returns `true` if the object matches `UserType`, otherwise `false`.
 */
export function isPayloadUserType(userObj: unknown): userObj is UserType {
  return (
    userObj !== undefined &&
    userObj !== null &&
    typeof userObj === "object" &&
    "username" in userObj &&
    "email" in userObj &&
    "roles" in userObj &&
    Array.isArray(userObj.roles)
  );
}

/**
 * Extracts user information from a JWT payload.
 *
 * @param token - A valid JWT string containing user-related claims.
 * @returns A `UserType` object with the parsed user data.
 *
 * @throws Will throw if the payload does not match the `UserType` structure.
 */
export function parseUserFromJwt(token: string): UserType {
  const payload = getJwtPayload(token);
  if (!isPayloadUserType(payload)) {
    throw new Error("Cannot parse the user's object from the response");
  }

  const { roles, username, email, company, name } = payload;
  return { roles, username, email, company, name };
}
