import axios, { isAxiosError } from "axios";
import Keycloak from "keycloak-js";

import type { ApiRequestError } from "@appTypes/api";
import type { UserKeycloak } from "@appTypes/user";

let keycloak: Keycloak | undefined;

const backUrl =
  window._env_?.VITE_APP_KEYCLOAK_URL || import.meta.env.VITE_APP_KEYCLOAK_URL;
const realmUrl =
  window._env_?.VITE_APP_KEYCLOAK_REALM ||
  import.meta.env.VITE_APP_KEYCLOAK_REALM;

const authClient = axios.create({
  baseURL: `${backUrl}/realms/${realmUrl}/protocol/openid-connect/userinfo`,
});

export async function getKeycloak() {
  if (keycloak) {
    return keycloak;
  }

  keycloak = new Keycloak({
    url:
      window._env_?.VITE_APP_KEYCLOAK_URL ||
      import.meta.env.VITE_APP_KEYCLOAK_URL ||
      "http://localhost:8080",
    realm:
      window._env_?.VITE_APP_KEYCLOAK_REALM ||
      import.meta.env.VITE_APP_KEYCLOAK_REALM ||
      "InstitutoHumboldt",
    clientId:
      window._env_?.VITE_APP_KEYCLOAK_CLIENT_ID ||
      import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID ||
      "Biotablero",
  });

  try {
    await keycloak.init({
      checkLoginIframe: false,
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    });
  } catch (err) {
    console.error("Auth server unavailable:", err);
  }

  return keycloak;
}

export async function getUserInfo(
  token: string,
): Promise<UserKeycloak | ApiRequestError> {
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data }: { data: unknown } = await authClient.get("/", config);
    return data as UserKeycloak;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return {
        status: err.response.status,
        message: err?.message || "Wrong request",
      } as ApiRequestError;
    }

    return {
      status: 503,
      message: "Couldn't connect with the server",
    } as ApiRequestError;
  }
}
