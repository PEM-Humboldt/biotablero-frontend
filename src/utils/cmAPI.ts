import { getTokensFromLS, setTokensInLS } from "app/uim/utils/JWTstorage";
import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
  type AxiosError,
  AxiosHeaders,
  AxiosRequestHeaders,
} from "axios";

const AUTH_SERVER = "/realms/bt-cm/protocol/openid-connect/token";
const LOGIN_ENDPOINT = `${AUTH_SERVER}?password`;
const TOKEN_REFRESH_ENDPOINT = `${AUTH_SERVER}?refresh`;

type LoginData = {
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

export function isResponseLoginData(res: unknown): res is LoginData {
  return (
    res !== undefined &&
    res !== null &&
    typeof res === "object" &&
    "access_token" in res &&
    "refresh_token" in res
  );
}

export function isResponseRequestError(res: unknown): res is RequestError {
  return (
    res !== undefined &&
    res !== null &&
    typeof res === "object" &&
    "status" in res &&
    "message" in res
  );
}

export async function makeAuthRequest(
  endpoint: string,
  params: AuthParams,
): Promise<LoginData | RequestError> {
  const url = `${import.meta.env.VITE_CM_BACKEND_URL}${endpoint}`;

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

    if (!isResponseLoginData(data)) {
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
 * Request the user access and gets its JWT tokens
 */
export async function requestLogin(
  username: string,
  password: string,
): Promise<LoginData | RequestError> {
  return makeAuthRequest(LOGIN_ENDPOINT, {
    grant_type: "password",
    username,
    password,
  });
}

/**
 * Gets the updated user JWT tokens
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<LoginData | RequestError> {
  return makeAuthRequest(TOKEN_REFRESH_ENDPOINT, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

// Interceptor para todos los requests de usuario en el módulo CM
const cmClient = axios.create({
  baseURL: import.meta.env.VITE_CM_BACKEND_URL as string,
});

cmClient.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokensFromLS();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

cmClient.interceptors.response.use(
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
      return cmClient(originalReq);
    } catch (refreshError) {
      console.error("Refresh token failed:", refreshError);
    }

    return Promise.reject(err);
  },
);

/*
 * Axios wrapper to handle all the http requests to the CM module
 */
export async function cmRequest<T>(
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
      response = await cmClient[type]<T>(fullEndpoint);
    } else {
      reqParams.append("client_id", "bt-mc-client");
      response = await cmClient[type]<T>(endpoint, reqParams, { headers });
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
