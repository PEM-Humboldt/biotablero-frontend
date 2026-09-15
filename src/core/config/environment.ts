export const environment = (
  window._env_?.VITE_ENVIRONMENT ||
  import.meta.env.VITE_ENVIRONMENT ||
  (import.meta.env.DEV ? "develop" : "production")
)
  .trim()
  .toLowerCase();

const environmentLabels: Record<string, string | undefined> = {
  develop: "Desarrollo",
  staging: "Pruebas",
};

export const environmentLabel = environmentLabels[environment];
