import axios, { AxiosRequestConfig } from "axios";
import { RasterAPIObject } from "pages/search/types/api";
import {
  AreaId,
  AreaIdBasic,
  AreaType,
  polygonFeature,
} from "pages/search/types/dashboard";
import { ForestLPRawDataPolygon } from "pages/search/types/forest";
import RestAPI from "./restAPI";

class SearchAPI {
  /**
   * Check if search backend is up
   */
  static requestTestBackend(): Promise<Array<String>> {
    return SearchAPI.makeGetRequest(`redoc`);
  }

  /** ****** */
  /** SEARCH */
  /** ****** */

  /**
   * Get complete information about an area
   *
   * @param {areaType} string TEMPORAL
   * @param {areaId} string | number area id
   *
   * @returns {Promise<AreaId>} object with area information
   */
  static requestAreaInfo(areaType: string, areaId: string | number) {
    // TODO: Ajustar con los llamados al nuevo backend
    // (por url) traer toda la lista de areaType
    // traer el área
    // Traer la geometria
  }

  /** *************** */
  /** SEARCH SELECTOR */
  /** *************** */

  /**
   * Get the list of area types
   *
   * @return {Promise<Array<AreaType>>} array of area types
   */
  static requestAreaTypes(): Promise<Array<AreaType>> {
    // TODO: Esto es un mockup
    const areaTypes: Array<AreaType> = [
      { id: "states", name: "Departamentos" },
      { id: "ea", name: "Jurisdicciones ambientales" },
      { id: "basinSubzones", name: "Subzonas hidrográficas" },
      { id: "se", name: "Ecosistemas Estratégicos" },
      { id: "custom", name: "Consulta Personalizada" },
    ];

    return Promise.resolve(areaTypes);
  }

  /**
   * Get the list of areaIds for a given area type
   *
   * @param {areaType} areaType areaType to filter areas ids
   *
   * @return {Promise<Array<AreaIdBasic>>} array of area types
   */
  static requestAreaIds(areaType: string): Promise<Array<AreaIdBasic>> {
    switch (areaType) {
      case "states":
        return RestAPI.getAllStates();
      case "ea":
        return RestAPI.getAllEAs();
      case "basinSubzones":
        return RestAPI.getAllSubzones();
      default:
        return Promise.resolve([]);
    }
  }

  /** *********************** */
  /** FOREST LOSS PERSISTENCE */
  /** *********************** */

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
      { responseType: "json" }
    );
  }

  /**
   * Get the layer associated to a polygon query for Forest LP
   *
   * @param {String} period item id to get
   * @param {Number} category index of the category to get
   * @param {Polygon} polygon selected polygon in GEOJson format
   * @param {String} category;
   * @return {ShapeAPIObject} layer object to be loaded in the map
   */

  static requestForestLPLayer(
    period: string,
    category: number,
    polygon: polygonFeature
  ): RasterAPIObject {
    const requestBody = { polygon };
    const source = axios.CancelToken.source();

    return {
      request: SearchAPI.makePostRequest(
        `metrics/LossPersistence/layer?item_id=${period}&category=${category}`,
        requestBody,
        { responseType: "json" }
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
   */
  static makePostRequest(endpoint: string, requestBody: {}, options = {}) {
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
      .then((res) => res.data)
      .catch((error) => {
        let message = "Bad POST response. Try later";
        if (error.response) message = error.response.status;
        if (error.request.statusText === "") message = "no-data-available";
        return Promise.reject(message);
      });
  }
}

export default SearchAPI;
