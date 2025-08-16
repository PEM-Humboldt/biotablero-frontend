import axios from "axios";

class ExternalRequests {
  /**
   * Get values of feature flags from an external url
   *
   * @param {String} URL file's url
   *
   * @return {Promise<Array>} Array of objects with feature flags
   */
  static requestFeaturesFlags() {
    const objectId = `https://biotablero.s3.amazonaws.com/featureFlags_${
      import.meta.env.VITE_ENVIRONMENT
    }.json`;
    return ExternalRequests.makeGetRequest(objectId);
  }

  /** ************** */
  /** BASE FUNCTIONS */
  /** ************** */

  /**
   * Make Request to an external URL through a GET request
   *
   * @param {String} url external url
   */
  static makeGetRequest(URL) {
    return axios
      .get(URL)
      .then((res) => res.data)
      .catch((error) => {
        let message = "Bad GET response. Try later";
        if (error.response) message = error.response.status;
        if (error.request && error.request.statusText === "")
          message = "no-data-available";
        return Promise.reject(message);
      });
  }
}

export default ExternalRequests;
