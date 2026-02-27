import axios from "axios";
import { BlobAPIObject } from "pages/search/types/api";

class LayerAPI {
  /**
   * Get layer image data
   * @param url Layer image url
   * @returns Blob image data
   */
  static getLayerData(response: { layer: string }): BlobAPIObject {
    const source = axios.CancelToken.source();
    return {
      request: axios
        .get(response.layer, {
          responseType: "blob",
        })
        .then((res) => res.data)
        .catch((error) => {
          if (axios.isCancel(error)) {
            return Promise.resolve("request canceled");
          }
          let message = "Bad GET response. Try later";
          if (error.response) message = error.response.status;
          if (error.request && error.request.statusText === "")
            message = "no-data-available";
          return Promise.reject(message);
        }),
      source: source,
    };
  }
}
export default LayerAPI;
