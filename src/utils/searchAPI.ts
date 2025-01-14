import axios, { AxiosRequestConfig } from "axios";
import { polygonFeature } from "pages/search/types/drawer";
import { ForestLPRawDataPolygon } from "pages/search/types/forest";

class SearchAPI {
  /**
   * Get the list of current scripts.
   */
  static requestTestBackend(): Promise<Array<String>> {
    return SearchAPI.makeGetRequest(`docs`);
  }

  /**
   * Get the forest loss and persistence data by periods and categories in the given polygon.
   *
   * @param {Polygon} polygon selected polygon
   *
   * @return {Promise<Array>} Array of objects with data for the forest loss and persistence
   */
  static requestForestLPData(
    polygon: polygonFeature | null
  ): Promise<Array<ForestLPRawDataPolygon>> {
    const requestBody = {
      polygon: polygon,
    };

    return SearchAPI.makePostRequest(
      "metrics/LossPersistence/values",
      requestBody,
      { responseType: "json" },
      false
    );
  }

  /**
   * Get the layer associated to a polygon query for Forest LP
   *
   * @param {String} period item id to get
   * @param {Number} category index of the category to get
   * @param {Polygon} polygon selected polygon in GEOJson format
   * @return {Promise<Object>} layer object to be loaded in the map
   */

  static requestForestLPLayer(
    period: string,
    category: number,
    polygon: polygonFeature | null
  ): { request: Promise<any> } {
    const requestBody = { polygon };

    return {
      request: SearchAPI.makePostRequest(
        `metrics/LossPersistence/layer?item_id=${period}&category=${category}`,
        requestBody,
        { responseType: "json" },
        true
      ),
    };
  }

  /** ************** */
  /** BASE FUNCTIONS */
  /** ************** */

  /**
   * Request an endpoint through a GET request
   *
   * @param {String} endpoint endpoint to attach to url
   * @param {Array} options config params to the request
   * @param {Boolean} completeRes define if get all the response or only data part
   */
  static makeGetRequest(endpoint: string, options = {}, completeRes = false) {
    const config = {
      ...options,
    };
    return axios
      .get(`${process.env.REACT_APP_SEARCH_BACKEND_URL}/${endpoint}`, config)
      .then((res) => {
        if (completeRes) {
          return res;
        }
        return res.data;
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return Promise.resolve("request canceled");
        }
        let message = "Bad GET response. Try later";
        if (error.response) message = error.response.status;
        if (error.request && error.request.statusText === "")
          message = "no-data-available";
        return Promise.reject(message);
      });
  }

  /**
   * Request an endpoint through a POST request
   *
   * @param {String} endpoint endpoint to attach to url
   * @param {Object} requestBody JSON object with the request body
   * @param {Array} options config params to the request
   * @param {Boolean} completeRes define if get all the response or only data part
   */
  static makePostRequest(
    endpoint: string,
    requestBody: {},
    options = {},
    completeRes = false
  ) {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };
    return axios
      .post(
        `${process.env.REACT_APP_SEARCH_BACKEND_URL}/${endpoint}`,
        requestBody,
        config
      )
      .then((res) => {
        if (completeRes) {
          return res;
        }
        return res.data;
      })
      .catch((error) => {
        let message = "Bad POST response. Try later";
        if (error.response) message = error.response.status;
        if (error.request.statusText === "") message = "no-data-available";
        return Promise.reject(message);
      });
  }
}

export default SearchAPI;
