import { ExternalRequests } from "@utils/externalRequests";

// TODO: verificar si todavía son requeridos los featureFlags
export const isFlagEnabled = (id: string) =>
  ExternalRequests.requestFeaturesFlags()
    .then((res) => {
      const feature = res.find((obj) => obj.id === id);
      return feature ? feature.enabled : false;
    })
    .catch(() => false);
