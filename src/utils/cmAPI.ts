import axios, { isAxiosError } from "axios";

const AUTH_SERVER = "/realms/bt-cm/protocol/openid-connect/token";
const LOGIN_ENDPOINT = `${AUTH_SERVER}?password`;
const TOKEN_REFRESH_ENDPOINT = `${AUTH_SERVER}?refresh`;

type LoginData = {
  access_token: string;
  refresh_token: string;
};

type LoginError = {
  status: number;
  message: string;
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

export function isResponseLoginError(res: unknown): res is LoginError {
  return (
    res !== undefined &&
    res !== null &&
    typeof res === "object" &&
    "status" in res &&
    "message" in res
  );
}

/**
 * Request the user access and gets its JWT tokens
 */
export async function requestLogin(
  username: string,
  password: string,
): Promise<LoginData | LoginError> {
  const url = `${import.meta.env.VITE_CM_BACKEND_URL}${LOGIN_ENDPOINT}`;
  const body = new URLSearchParams();
  body.append("grant_type", "password");
  body.append("client_id", "bt-mc-client");
  body.append("username", username);
  body.append("password", password);
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
