import Keycloak from 'keycloak-js';

const keycloakConfig = {
    // url: import.meta.env.VITE_APP_KEYCLOAK_URL || "http://192.168.11.44:8080",
    url: import.meta.env.VITE_APP_KEYCLOAK_URL || "https://keycloakdev.humboldt.org.co",
    realm: import.meta.env.VITE_APP_KEYCLOAK_REALM || "humboldt-dev",
    clientId: import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID || "front-dev-humboldt"
}

let keycloakInstance: Keycloak | null = null;

const getKeycloakInstance = (): Keycloak => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig);
  }
  return keycloakInstance;
};

const keycloak = getKeycloakInstance();

export const keycloakInitOptions = {
  onLoad: 'check-sso' as const,
  pkceMethod: 'S256' as const,
  checkLoginIframe: true,
  checkLoginIframeInterval: 5,
  silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  enableLogging: import.meta.env.DEV,
};

export const kongConfig = {
  enabled: import.meta.env.VITE_APP_KONG_ENABLED === 'true',
  apiUrl: import.meta.env.VITE_APP_KONG_API_URL || 'http://localhost:8000',
  headers: {
    'X-Kong-Request-ID': true,
  },
};

export default keycloak;
