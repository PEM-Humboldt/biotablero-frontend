type EnvKey =
  | "REACT_APP_BACKEND_URL"
  | "REACT_APP_GEOSERVER_URL"
  | "REACT_APP_BACKEND_KEY"
  | "REACT_APP_ENVIRONMENT"
  | "REACT_APP_BACKEND_BIAB_URL"
  | "REACT_APP_GA_TRACKING_ID"
  | "REACT_APP_YM_ID";

declare global {
  interface Window {
    _env_?: Partial<Record<EnvKey, string>>;
  }
}

export const getEnv = (key: EnvKey): string | undefined => {
  if (typeof window !== "undefined" && window._env_ && window._env_[key]) {
    return window._env_[key];
  }
  return process.env[key];
};
