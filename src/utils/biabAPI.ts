import axios from "axios";
import { toMultipolygonWKT } from "utils/transformations";
import { Polygon } from "pages/search/types/drawer";

class biabAPI {
  /**
   * Get the forest loss and persistence data by periods and categories in the given polygon.
   *
   * @param {Polygon} polygon selected polygon
   *
   * @return {Promise<Array>} Array of objects with data for the forest loss and persistence
   */
  static requestForestLPData(polygon: Polygon | null): Promise<{
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
      folder_output: "p_p_studyarea_1000m2",
    };

    return biabAPI.makePostRequest(
      "script/perdidaPersistencia%3E01_pp.R/run",
      requestBody
    );
  }

  /** ************** */
  /** BASE FUNCTIONS */
  /** ************** */

  /**
   * Request an endpoint through a GET request
   *
   * @param {String} endpoint endpoint to attach to url
   */
  static makeGetRequest(endpoint: string) {
    return axios
      .get(`${process.env.REACT_APP_BACKEND_BIAB_URL}/${endpoint}`)
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