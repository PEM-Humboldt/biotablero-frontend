import axios from "axios";
import { SCIHF } from "pages/search/types/forest";
import {
  currentPAConn,
  currentSEPAConn,
  DPC,
  timelinePAConn,
} from "pages/search/types/connectivity";
import {
  currentHFValue,
  currentHFCategories,
  hfPersistence,
} from "pages/search/types/humanFootprint";
import { TextObject } from "pages/search/types/texts";
class SearchAPI {
  /** ****** */
  /** FOREST */
  /** ****** */
  /**
   * Get the structural condition index with human footprint persistence categories in the given
   * area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Objects with value for the SCI and HF persistence
   */
  static requestSCIHF(
    areaType: string,
    areaId: string | number
  ): Promise<Array<SCIHF>> {
    return SearchAPI.makeGetRequest(
      `forest/sci/hf?areaType=${areaType}&areaId=${areaId}`
    );
  }

  /** ************ */
  /** CONNECTIVITY */
  /** ************ */
  /**
   * Get the area distribution for each category of protected area connectivity in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Array of objects with data of current PA connectivity
   */
  static requestCurrentPAConnectivity(
    areaType: string,
    areaId: string | number
  ): Promise<Array<currentPAConn>> {
    return SearchAPI.makeGetRequest(
      `connectivity/current?areaType=${areaType}&areaId=${areaId}`
    );
  }

  /**
   * Get the area distribution for each category of protected area connectivity in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Array of objects with data of current PA connectivity
   */
   static requestCurrentSEPAConnectivity(
    areaType: string,
    areaId: string | number,
    seType: string | number
  ): Promise<Array<currentSEPAConn>> {
    return SearchAPI.makeGetRequest(
      `connectivity/current/se?areaType=${areaType}&areaId=${areaId}&seType=${seType}`
    );
  }


  /**
   * Get the values of connectivity for the protected areas with higher dPC value in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Array of objects with data of the protected areas
   */
  static requestDPC(
    areaType: string,
    areaId: string | number,
    paNumber: number
  ): Promise<Array<DPC>> {
    return SearchAPI.makeGetRequest(
      `connectivity/dpc?areaType=${areaType}&areaId=${areaId}&paNumber=${paNumber}`
    );
  }

  /**
   *  Get the timeline for each category of protected area connectivity in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} category category of index, fe. "prot", "prot_conn"
   *
   * @return {Promise<Array>} Array of objects with data of timeline PA connectivity
   */
  static requestTimelinePAConnectivity(
    areaType: string,
    areaId: string | number,
    category: string
  ): Promise<timelinePAConn> {
    return SearchAPI.makeGetRequest(
      `connectivity/timeline?areaType=${areaType}&areaId=${areaId}&category=${category}`
    );
  }

  /** *************** */
  /** HUMAN FOOTPRINT */
  /** *************** */
  /**
  /**
   * Get the current human footprint value in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Object} Object with value and category for the current human footprint
   */
  static requestCurrentHFValue(
    areaType: string,
    areaId: string | number
  ): Promise<currentHFValue> {
    return SearchAPI.makeGetRequest(`${areaType}/${areaId}/hf/current/value`);
  }

  /**
   * Get the current human footprint data by categories in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with data for the current human footprint
   */
  static requestCurrentHFCategories(
    areaType: string,
    areaId: string | number
  ): Promise<Array<currentHFCategories>> {
    return SearchAPI.makeGetRequest(
      `${areaType}/${areaId}/hf/current/categories`
    );
  }

  /**
   * Get the persistence of human footprint data in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with data for the persistence of human footprint
   */
  static requestHFPersistence(
    areaType: string,
    areaId: string | number
  ): Promise<Array<hfPersistence>> {
    return SearchAPI.makeGetRequest(`${areaType}/${areaId}/hf/persistence`);
  }

  /** ************ */
  /** CROSS MODULE */
  /** ************ */

  /**
   * Get texts associated to one section
   *
   * @param {String} key section key
   *
   * @return {Promise<Object>} Object with texts
   */
  static requestSectionTexts(key: string): Promise<TextObject> {
    return SearchAPI.makeGetRequest(`util/texts?key=${key}`);
  }

  /** ************** */
  /** BASE FUNCTIONS */
  /** ************** */

  /**
   * Request an endpoint through a GET request
   *
   * @param {String} endpoint endpoint to attach to url
   */
  static makeGetRequest(endpoint: string, options = {}, completeRes = false) {
    const config = {
      ...options,
      headers: {
        Authorization: `apiKey ${process.env.REACT_APP_BACKEND_KEY}`,
      },
    };
    return axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/${endpoint}`, config)
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
}

export default SearchAPI;
