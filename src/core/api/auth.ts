import axios, { isAxiosError } from "axios";
import type { ApiRequestError } from "@appTypes/api";

const AUTH_SERVER = "/realms/bt-cm/protocol/openid-connect/token";
const LOGIN_ENDPOINT = `${AUTH_SERVER}?password`;
const TOKEN_REFRESH_ENDPOINT = `${AUTH_SERVER}?refresh`;

type AuthData = {
  access_token: string;
  refresh_token: string;
};

type AuthParams =
  | {
      grant_type: "password";
      username: string;
      password: string;
    }
  | {
      grant_type: "refresh_token";
      refresh_token: string;
    };

/**
 * Type guard that checks if a response object matches the `LoginData` shape.
 *
 * @param res - The value to validate.
 * @returns `true` if the object contains both `access_token` and `refresh_token`, otherwise `false`.
 */
export function isResponseAuthData(res: unknown): res is AuthData {
  return (
    res !== undefined &&
    res !== null &&
    typeof res === "object" &&
    "access_token" in res &&
    "refresh_token" in res
  );
}

/**
 * Type guard that checks if a response object matches the `RequestError` shape.
 *
 * @param res - The value to validate.
 * @returns `true` if the object contains both `status` and `message`, otherwise `false`.
 */
export function isResponseRequestError(res: unknown): res is ApiRequestError {
  return (
    res !== undefined &&
    res !== null &&
    typeof res === "object" &&
    "status" in res &&
    "message" in res
  );
}

async function makeAuthRequest(
  endpoint: string,
  params: AuthParams,
): Promise<AuthData | ApiRequestError> {
  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}${endpoint}`;

  const body = new URLSearchParams();
  body.append("client_id", "bt-mc-client");
  Object.entries(params).forEach(([key, value]) => body.append(key, value));

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const { data }: { data: unknown } = await axios.post(url, body, config);

    if (!isResponseAuthData(data)) {
      return { status: 500, message: "Unknown server error" };
    }

    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return {
        status: err.response.status,
        message: err?.message || "Wrong request",
      };
    }

    return { status: 503, message: "Couldn't connect with the server" };
  }
}

/**
 * Sends a login request to the authentication server and retrieves JWT tokens.
 *
 * @param username - The username to authenticate with.
 * @param password - The password associated with the username.
 * @returns A `LoginData` object containing the JWT tokens, or a `RequestError` if authentication fails.
 */
export async function requestAccessToken(
  username: string,
  password: string,
): Promise<AuthData | ApiRequestError> {
  return makeAuthRequest(LOGIN_ENDPOINT, {
    grant_type: "password",
    username,
    password,
  });
}

/**
 * Refreshes the access token using the provided refresh token.
 *
 * @param refreshToken - The refresh token to exchange for a new access token.
 * @returns A `LoginData` object containing the updated JWT tokens, or a `RequestError` if the refresh fails.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthData | ApiRequestError> {
  return makeAuthRequest(TOKEN_REFRESH_ENDPOINT, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}
