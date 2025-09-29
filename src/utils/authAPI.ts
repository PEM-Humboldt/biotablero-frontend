import { getTokensFromLS, setTokensInLS } from "app/uim/utils/JWTstorage";
import axios, {
  isAxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";

const AUTH_SERVER = "/realms/bt-cm/protocol/openid-connect/token";
const LOGIN_ENDPOINT = `${AUTH_SERVER}?password`;
const TOKEN_REFRESH_ENDPOINT = `${AUTH_SERVER}?refresh`;

type AuthData = {
  access_token: string;
  refresh_token: string;
};

type RequestError = {
  status: number;
  message: string;
};

interface ExtendedAxiosReqConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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
export function isResponseRequestError(res: unknown): res is RequestError {
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
): Promise<AuthData | RequestError> {
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
    console.error(err);

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
): Promise<AuthData | RequestError> {
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
): Promise<AuthData | RequestError> {
  return makeAuthRequest(TOKEN_REFRESH_ENDPOINT, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

// NOTE: Interceptor para todos los requests de usuario en el módulo AUTH
const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BACKEND_URL,
});

authClient.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokensFromLS();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

authClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalReq = err.config as ExtendedAxiosReqConfig;

    if (err.response?.status !== 401 || originalReq?._retry) {
      return Promise.reject(err);
    }

    originalReq._retry = true;

    try {
      const { refreshToken } = getTokensFromLS();
      if (refreshToken === null) {
        return Promise.reject(err);
      }

      const newTokens = await refreshAccessToken(refreshToken);
      if (isResponseRequestError(newTokens)) {
        return Promise.reject(err);
      }

      setTokensInLS(newTokens.access_token, newTokens.refresh_token);
      originalReq.headers.set(
        "Authorization",
        `Bearer ${newTokens.access_token}`,
      );
      return authClient(originalReq);
    } catch (refreshError) {
      console.error("Refresh token failed:", refreshError);
    }

    return Promise.reject(err);
  },
);

/**
 * Wrapper around Axios to standardize requests to the Auth module.
 *
 * Handles query parameter encoding, error normalization, and token injection through interceptors.
 *
 * @typeParam T - The expected response payload type.
 * @param type - The HTTP method (`get`, `post`, `put`, or `delete`).
 * @param endpoint - The API endpoint relative to the Auth backend base URL.
 * @param data - Optional key-value pairs to send as query parameters or request body.
 * @param headers - Optional custom headers for the request.
 * @returns A `Promise` resolving to the parsed response of type `T`, or a `RequestError` on failure.
 */
export async function authRequest<T>(
  type: "get" | "post" | "put" | "delete",
  endpoint: string,
  data?: Record<string, string>,
  headers?: Record<string, string>,
): Promise<T | RequestError> {
  try {
    let response: AxiosResponse<T>;
    const reqParams = new URLSearchParams();
    if (data) {
      Object.entries(data).forEach(([key, value]) =>
        reqParams.append(key, value),
      );
    }

    if (type === "get" || type === "delete") {
      const fullEndpoint = `${endpoint}?${reqParams.toString()}`;
      response = await authClient[type]<T>(fullEndpoint);
    } else {
      reqParams.append("client_id", "bt-mc-client");
      response = await authClient[type]<T>(endpoint, reqParams, { headers });
    }

    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return {
        status: err.response.status,
        message: err?.message || "Request failed",
      };
    }
    return { status: 503, message: "Couldn't connect with the server" };
  }
}
