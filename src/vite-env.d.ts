/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_GEOSERVER_URL: string;
  readonly VITE_BACKEND_KEY: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_API_KEY: string;
  readonly VITE_DOMAIN: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_STORAGE_BUCKET: string;
  readonly VITE_SENDER_ID: string;
  readonly VITE_APP_ID: string;
  readonly VITE_SEARCH_BACKEND_URL: string;
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_YM_ID: string;
  readonly VITE_AUTH_BACKEND_URL: string;
  readonly VITE_MONITORING_BACKEND_URL: string;
  readonly VITE_KC_CLIENT: string;
}

interface Window {
  _env_: ImportMetaEnv;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
