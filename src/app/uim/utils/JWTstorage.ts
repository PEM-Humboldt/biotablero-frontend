import type { Tokens } from "app/uim/types";

/*
 * Gets the tokens in the localStorage object
 */
export function getTokensFromLS(): Tokens {
  return {
    accessToken: localStorage.getItem("BT_access"),
    refreshToken: localStorage.getItem("BT_refresh"),
  };
}

/*
 * Save the tokens in the localStorage object
 */
export function setTokensInLS(
  accessToken: string,
  refreshToken?: string,
): void {
  localStorage.setItem("BT_access", accessToken);
  if (refreshToken !== undefined) {
    localStorage.setItem("BT_refresh", accessToken);
  }
}

/*
 * Parse the JWT to get the payload
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
