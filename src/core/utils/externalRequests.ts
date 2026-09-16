import axios, { type AxiosError } from "axios";

type FeatureObject = {
  id: string;
  enabled: boolean;
};

export class ExternalRequests {
  /**
   * Get values of feature flags from an external url
   *
   * @returns Array of objects with feature flags
   */
  static requestFeaturesFlags(): Promise<FeatureObject[]> {
    const objectId = `https://biotablero.s3.amazonaws.com/featureFlags_${
      window._env_?.VITE_ENVIRONMENT || import.meta.env.VITE_ENVIRONMENT
    }.json`;
    return ExternalRequests.makeGetRequest<FeatureObject[]>(objectId);
  }

  /** ************** */
  /** BASE FUNCTIONS */
  /** ************** */

  /**
   * Make Request to an external URL through a GET request
   *
   * @param URL the target of the request
   */
  static async makeGetRequest<T>(URL: string) {
    return axios
      .get<T>(URL)
      .then((res) => res.data)
      .catch((error: AxiosError) => {
        let message = "Bad GET response. Try later";

        if (error.response) {
          message = String(error.response.status);
        } else if (error.request) {
          const req = error.request as XMLHttpRequest;
          if (req.statusText === "") {
            message = "no-data-available";
          }
        }

        return Promise.reject(new Error(message));
      });
  }
}
