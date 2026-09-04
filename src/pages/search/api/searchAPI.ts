import axios, { AxiosRequestConfig } from "axios";
import { RequestAPIObject, RasterAPIObject } from "pages/search/types/api";
import { AreaIdBasic, AreaType, AreaId } from "pages/search/types/dashboard";
import {
  MetricInfoResponse,
  MetricTypesMap,
  MetricsTypes,
} from "pages/search/types/metrics";
import * as geojson from "geojson";

class SearchAPI {
  static readonly backEndUrl =
    window._env_?.VITE_SEARCH_BACKEND_URL ||
    import.meta.env.VITE_SEARCH_BACKEND_URL;

  /**
   * Check if search backend is up
   */
  static requestTestBackend(): Promise<Array<String>> {
    // TODO: Bext agregó un endpoit de health, mejor usar ese
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
  static requestAreaPolygon(
    polygon: geojson.Feature<geojson.Polygon>,
  ): Promise<{ polygon_id: number }> {
    const requestBody = {
      polygon: polygon,
    };

    return SearchAPI.makePostRequest("areas/polygon", requestBody, {
      responseType: "json",
    });
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
  static requestMetricsValues<Metric extends MetricsTypes>(
    metricId: Metric,
    polygonId: number,
    options: AxiosRequestConfig = {},
  ): RequestAPIObject<MetricTypesMap[Metric]> {
    const source = axios.CancelToken.source();
    return {
      request: SearchAPI.makeGetRequest(
        `metrics/${metricId}/values/${polygonId}`,
        {
          ...options,
          cancelToken: source.token,
        },
      ),
      source,
    };
  }

  /**
   * Get metrics layers
   * @param metricId Metric identifier
   * @param item_id Item identifier
   * @param category Category identifier
   * @param polygon_id Polygon identifier
   * @returns URL with layer image
   */
  static requestMetricsLayer(
    metricId: MetricsTypes,
    itemId: string,
    classId: string,
    polygonId: number,
    group?: string,
  ): RasterAPIObject {
    const source = axios.CancelToken.source();

    return {
      request: SearchAPI.makeGetRequest(`metrics/${metricId}/layer`, {
        params: {
          item_id: itemId,
          polygon_id: polygonId,
          class_id: classId,
          ...(group && { group }),
        },
      }) as Promise<{ layer: string }>,
      source,
    };
  }

  /**
   * Gets metrics info.
   *
   * @param metricId - Metric identifier.
   * @returns List of metric info.
   */
  static requestMetricsInfo(
    metricId: MetricsTypes,
  ): Promise<Array<MetricInfoResponse>> {
    return SearchAPI.makeGetRequest(`metrics/${metricId}/info`);
  }

  /** *********** */
  /** COLLECTIONS */
  /** *********** */

  /**
   * Get the list of available collections
   *
   * @returns Collections list
   */
  static reqestCollections(): Promise<Array<{ id: number; name: string }>> {
    return SearchAPI.makeGetRequest("collections");
  }

  /**
   * Guet the layer for a given value on the collection
   *
   * @param collectionId Collection id
   * @param value selected value
   *
   * @returns Object with the image url and associated bbox
   */
  static requestCollectionLayer(
    collectionId: number,
    value: number,
  ): RasterAPIObject {
    const source = axios.CancelToken.source();

    return {
      request: SearchAPI.makeGetRequest(`collections/${collectionId}/layer`, {
        params: {
          value: value,
        },
      }) as Promise<{ layer: string; bbox: [number, number, number, number] }>,
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
      .get(`${this.backEndUrl}/${endpoint}`, config)
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
      .post(`${this.backEndUrl}/${endpoint}`, requestBody, config)
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
