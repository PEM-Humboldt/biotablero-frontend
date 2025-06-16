import axios, { AxiosRequestConfig } from "axios";
import { RasterAPIObject } from "pages/search/types/api";
import {
  AreaIdBasic,
  AreaType,
  AreaId,
  polygonFeature,
} from "pages/search/types/dashboard";
import { CoverageRawDataPolygon } from "pages/search/types/ecosystems";
import { ForestLPRawDataPolygon } from "pages/search/types/forest";
import * as geojson from "geojson";

export type MetricsTypes = "LossPersistence" | "Coverage";

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
   * @param {string | number} areaId Area identifier
   *
   * @returns {Promise<AreaId>} Object with area information
   */
  static requestAreaInfo(areaId: string | number): Promise<AreaId> {
    return SearchAPI.makeGetRequest(`areas/${areaId}`);
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
    return SearchAPI.makeGetRequest("areas/types");
  }

  /**
   * Get the list of areaIds for a given area type
   *
   * @param {areaType} areaType areaType to filter areas ids
   *
   * @return {Promise<Array<AreaIdBasic>>} array of area types
   */
  static requestAreaIds(areaType: string): Promise<Array<AreaIdBasic>> {
    return SearchAPI.makeGetRequest(`areas?type=${areaType}`);
  }

  /**
   * Returns the identifier of a polygon
   * @param polygon Polygon search data
   * @returns Polygon identifier
   */
  static requestAreaPolygon(polygon: geojson.Feature<geojson.Polygon>): Promise<{ polygon_id: number }> {
    const requestBody = {
      polygon: polygon,
    };

    return SearchAPI.makePostRequest(
      "areas/polygon",
      requestBody,
      { responseType: "json" }
    );
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

  /** ******* */
  /** METRICS */
  /** ******* */

  /**
   * Get metrics values
   * @param metricId Metric identifier
   * @param polygonId Polygon identifier
   * @returns List of metrics values
   */
  static requestMetricsValues(
    metricId: MetricsTypes,
    polygonId: number
  ): Promise<Array<ForestLPRawDataPolygon | CoverageRawDataPolygon>> {
    return SearchAPI.makeGetRequest(`metrics/${metricId}/values/${polygonId}`);
  }

  /**
   * Get metrics layers
   * @param metricId Metric identifier
   * @param itemId Item identifier
   * @param category Category identifier
   * @param polygonId Polygon identifier
   * @returns URL with layer image
   */
  static requestMetricsLayer(
    metricId: MetricsTypes,
    itemId: string,
    category: number,
    polygonId: number
  ): RasterAPIObject {
    const source = axios.CancelToken.source();
    return {
      request: SearchAPI.makeGetRequest(
        `metrics/${metricId}/layer?item_id=${itemId}&polygon_id=${polygonId}&category=${category}`
      ),
      source: source,
    };
  }

  /**
   * Get layer image data
   * @param url Layer image url
   * @returns Blob image data
   */
  static getLayerData(response: { layer: string }): Promise<Blob> {
    return axios
      .get(response.layer, {
        responseType: "blob",
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        let message = "Bad GET response. Try later";
        if (error.request && error.request.statusText === "")
          message = "no-data-available";
        return Promise.reject(message);
      });
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
