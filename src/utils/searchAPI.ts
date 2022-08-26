import axios from "axios";
import { SCIHF, ForestLP } from "pages/search/types/forest";
import { cfData } from "pages/search/types/compensationFactor";
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
  hfTimeline,
} from "pages/search/types/humanFootprint";
import { seDetails } from "pages/search/types/ecosystems";
import { TextObject } from "pages/search/types/texts";
import { SECoverage, SEPAData } from "pages/search/types/ecosystems";
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

  /**
   * Get the forest loss and persistence data by periods and categories in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with data for the forest loss and persistence
   */
  static requestForestLP(
    areaType: string,
    areaId: string | number
  ): Promise<Array<ForestLP>> {
    return SearchAPI.makeGetRequest(
      `forest/lp?areaType=${areaType}&areaId=${areaId}`
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
   * Get the area distribution for each category of protected area connectivity for an specific
   * strategic ecosystem in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type
   *
   * @return {Promise<Object>} Array of objects with data of current PA connectivity by SE
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

  /** ******************* */
  /** COMPENSATION FACTOR */
  /** ******************* */
  /**
   * Recover biomes located in the selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestBiomes(
    areaType: string,
    areaId: string | number
  ): Promise<Array<cfData>> {
    return SearchAPI.makeGetRequest(`${areaType}/${areaId}/generalBiome`);
  }

  /**
   * Recover biotic units by selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestBioticUnits(
    areaType: string,
    areaId: string | number
  ): Promise<Array<cfData>> {
    return SearchAPI.makeGetRequest(`${areaType}/${areaId}/bioticUnit`);
  }

  /**
   * Recover compensation Factor values by selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestCompensationFactor(
    areaType: string,
    areaId: string | number
  ): Promise<Array<cfData>> {
    return SearchAPI.makeGetRequest(`${areaType}/${areaId}/compensationFactor`);
  }

  /** *************** */
  /** HUMAN FOOTPRINT */
  /** *************** */
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

  /**
   * Get the human footprint timeline data in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Object with human footprint timeline data in the given area
   */
  static requestTotalHFTimeline(
    areaType: string,
    areaId: string | number
  ): Promise<hfTimeline> {
    return SearchAPI.makeGetRequest(`${areaType}/${areaId}/hf/timeline`);
  }

  /**
   * Get the human footprint timeline data for a specific strategic ecosystem in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type, f.e. "Páramo"
   *
   * @return {Promise<Object>} Object with human footprint timeline data in the given area
   * and selected strategic ecosystem
   */
  static requestSEHFTimeline(
    areaType: string,
    areaId: string | number,
    seType: string
  ): Promise<hfTimeline> {
    return SearchAPI.makeGetRequest(
      `${areaType}/${areaId}/se/${seType}/hf/timeline`
    );
  }

  /** ************ */
  /** ECOSYSTEMS   */
  /** **************/
  /**
   * Recover the strategic ecosystems values in the area selected
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {Number} seType strategic ecosystem type to request details
   */
  static requestSEDetailInArea(
    areaType: string,
    areaId: string | number,
    seType: string
  ): Promise<seDetails> {
    return SearchAPI.makeGetRequest(`${areaType}/${areaId}/se/${seType}`);
  }

  /**
   * Get the coverage area distribution by selected strategic ecosystem and geofence
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type
   */
  static requestSECoverageByGeofence(
    areaType: string,
    areaId: string | number,
    seType: string
  ): Promise<Array<SECoverage>> {
    return SearchAPI.makeGetRequest(
      `ecosystems/coverage/se?areaType=${areaType}&areaId=${areaId}&seType=${seType}`
    );
  }

  /**
   * Get the the protected area by selected strategic ecosystems and geofence
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {Number} seType type of strategic ecosystem to request
   */
  static requestSEPAByGeofence(
    areaType: string,
    areaId: string | number,
    seType: string
  ): Promise<Array<SEPAData>> {
    return SearchAPI.makeGetRequest(
      `/pa/se?areaType=${areaType}&areaId=${areaId}&seType=${seType}`
    );
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
