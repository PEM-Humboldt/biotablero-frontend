import axios, { CancelTokenSource } from "axios";
import { toMultipolygonWKT } from "utils/transformations";
import { Polygon } from "pages/search/types/drawer";

class biabAPI {
  /**
   * Get the list of current scripts.
   */
  static requestScriptList(): Promise<Array<String>> {
    return biabAPI.makeGetRequest(`script/list`);
  }

  /**
   * Get the forest loss and persistence data by periods and categories in the given polygon.
   *
   * @param {Polygon} polygon selected polygon
   *
   * @return {Promise<Array>} Array of objects with data for the forest loss and persistence
   */
  static requestForestLPData(
    polygon: Polygon | null,
    polygonFolder: string
  ): Promise<{
    logs: string;
    files: {
      table_pp: string;
    };
  }> {
    const wkt = toMultipolygonWKT(polygon);
    const requestBody = {
      dir_wkt_polygon:
        "/scripts/perdidaPersistencia/input/wkt_polygon_test.txt",
      wkt_polygon: wkt,
      epsg_polygon: 4326,
      dir_colection: "/scripts/perdidaPersistencia/input/ppCollection",
      resolution: 1000,
      folder_output: polygonFolder,
    };

    return biabAPI.makePostRequest(
      "script/perdidaPersistencia%3E01_pp.R/run",
      requestBody
    );
  }

  /**
   * Get the layer associated to a polygon query for Forest LP
   *
   * @param {String} layer layer file name to get
   * @param {String} polygonFolder result folder name
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */

  static requestForestLPLayer(
    layer: string,
    polygonFolder: string
  ): { request: Promise<Object>; source: CancelTokenSource } {
    const source = axios.CancelToken.source();
    polygonFolder = "png_layers";
    return {
      request: biabAPI.makeGetRequest(
        `output/${polygonFolder}/${layer}.png`,
        { cancelToken: source.token, responseType: "arraybuffer" },
        true
      ),
      source,
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
      .get(`${process.env.REACT_APP_BACKEND_BIAB_URL}/${endpoint}`, config)
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
   */
  static makePostRequest(endpoint: string, requestBody: {}) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return axios
      .post(
        `${process.env.REACT_APP_BACKEND_BIAB_URL}/${endpoint}`,
        requestBody,
        config
      )
      .then((res) => res.data)
      .catch((error) => {
        let message = "Bad POST response. Try later";
        if (error.response) message = error.response.status;
        if (error.request.statusText === "") message = "no-data-available";
        return Promise.reject(message);
      });
  }
}

export default biabAPI;
