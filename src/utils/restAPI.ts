import axios, { AxiosResponse, isAxiosError, isCancel } from "axios";

const LOGIN_ENDPOINT = `/realms/bt-cm/protocol/openid-connect/token?password`;

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
 * Request the user access JWT tokens
 */
export async function requestLogin(
  username: string,
  password: string,
): Promise<LoginData | LoginError> {
  const url = `${import.meta.env.VITE_BACKEND_CM_URL}${LOGIN_ENDPOINT}`;
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

/**
 * Request an endpoint through a GET request
 */
// static async makeGetRequest<T>(
//   endpoint: string,
//   options = {},
//   completeRes = false,
// ): Promise<AxiosResponse<T> | T | string> {
//   const config = {
//     ...options,
//     headers: {
//       Authorization: `apiKey ${import.meta.env.VITE_BACKEND_KEY}`,
//     },
//   };
//   console.log(">>>> carajo GET");
//
//   try {
//     const res = await axios.get<T>(
//       `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`,
//       config,
//     );
//     return completeRes ? res : res.data;
//   } catch (err) {
//     if (isCancel(err)) {
//       return "request canceled";
//     }
//
//     let errorMessage = "Unknown error";
//     if (isAxiosError(err)) {
//       if (err.response) {
//         errorMessage = `Request failed with status ${err.response.status}`;
//       } else if (err.request) {
//         errorMessage = "Network Error";
//       } else {
//         errorMessage = err.message;
//       }
//     } else if (err instanceof Error) {
//       errorMessage = err.message;
//     }
//
//     throw new Error(errorMessage);
//   }
// }

/**
 * Request an endpoint through a POST request
 */
// static async makePostRequest<Tresponse, Tbody>(
//   endpoint: string,
//   requestBody: Tbody,
// ): Promise<Tresponse> {
//   const config = {
//     headers: {
//       Authorization: `apiKey ${import.meta.env.VITE_BACKEND_KEY}`,
//     },
//   };
//
//   console.log(">>>> carajo POST");
//   try {
//     const res = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`,
//       requestBody,
//       config,
//     );
//     return res.data as Tresponse;
//   } catch (error) {
//     if (isCancel(error)) {
//       throw new Error("Request canceled");
//     }
//
//     let errorMessage = "Unknown error on POST request";
//
//     if (isAxiosError(error)) {
//       if (error.response) {
//         errorMessage = `Request failed with status ${error.response.status}`;
//       } else if (error.request) {
//         errorMessage = "Network Error: No response received";
//       } else {
//         errorMessage = error.message;
//       }
//     } else if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//
//     throw new Error(errorMessage);
//   }
// }
