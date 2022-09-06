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
import {
  helperText,
  textResponse,
  textsObject,
} from "pages/search/types/texts";
import { Coverage, SEPAData, seDetails } from "pages/search/types/ecosystems";
import {
  concentration,
  gaps,
  NOSNational,
  NOSThresholds,
  numberOfSpecies,
} from "pages/search/types/richness";
import { drawerGF } from "pages/search/types/drawer";
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

  /** ********** */
  /** ECOSYSTEMS */
  /** ************/
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
  ): Promise<Array<Coverage>> {
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

  /**
   * Get the area distribution for each SE type and total SE area within a given area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestStrategicEcosystems(
    areaType: string,
    areaId: string | number
  ): Promise<Array<SEPAData>> {
    return SearchAPI.makeGetRequest(
      `ecosystems/se?areaType=${areaType}&areaId=${areaId}`
    );
  }

  /**
   * Get the protected areas values by selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestProtectedAreas(
    areaType: string,
    areaId: string | number
  ): Promise<Array<SEPAData>> {
    return SearchAPI.makeGetRequest(
      `/pa?areaType=${areaType}&areaId=${areaId}`
    );
  }

  /**
   * Get coverage area by selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestCoverage(
    areaType: string,
    areaId: string | number
  ): Promise<Array<Coverage>> {
    return SearchAPI.makeGetRequest(
      `ecosystems/coverage?areaType=${areaType}&areaId=${areaId}`
    );
  }

  /** ******** */
  /** RICHNESS */
  /** ******** */

  /**
   * Get the number of species for the specified area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} group group to filter results, f.e. "total", "endemic"
   *
   * @return {Promise<Object>} Array of objects with observed, inferred and region number of species
   */
  static requestNumberOfSpecies(
    areaType: string,
    areaId: number | string,
    group: string
  ): Promise<Array<numberOfSpecies>> {
    return SearchAPI.makeGetRequest(
      `richness/number-species?areaType=${areaType}&areaId=${areaId}${
        group ? `&group=${group}` : ""
      }`
    );
  }

  /**
   * Get the thresholds for the number of species in the same biotic unit as the specified area id
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} group group to filter results, f.e. "total", "endemic"
   *
   * @return {Promise<Object>} Array of objects with minimum and maximun number of observed and
   * inferred species
   */
  static requestNSThresholds(
    areaType: string,
    areaId: number | string,
    group: string
  ): Promise<Array<NOSThresholds>> {
    return SearchAPI.makeGetRequest(
      `richness/number-species/thresholds?areaType=${areaType}&areaId=${areaId}${
        group ? `&group=${group}` : ""
      }`
    );
  }

  /**
   * Get the national max values specified area type
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {String} group group to filter results, f.e. "total", "endemic"
   *
   * @return {Promise<Object>} Array of objects with minimum and maximun number of observed and
   * inferred species
   */
  static requestNSNationalMax(
    areaType: string,
    group: string
  ): Promise<Array<NOSNational>> {
    return SearchAPI.makeGetRequest(
      `richness/number-species/nationalMax?areaType=${areaType}${
        group ? `&group=${group}` : ""
      }`
    );
  }

  /**
   * Get values for richness species gaps in the given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Object with values of richness species gaps
   */
  static requestGaps(
    areaType: string,
    areaId: number | string
  ): Promise<Array<gaps>> {
    return SearchAPI.makeGetRequest(
      `richness/gaps?areaType=${areaType}&areaId=${areaId}`
    );
  }

  /**
   * Get values for richness species concentration in the given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Object with values of richness species concentration
   */
  static requestConcentration(
    areaType: string,
    areaId: number | string
  ): Promise<Array<concentration>> {
    return SearchAPI.makeGetRequest(
      `richness/concentration?areaType=${areaType}&areaId=${areaId}`
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
  static requestTexts(key: string): Promise<textResponse> {
    return SearchAPI.makeGetRequest(`util/texts?key=${key}`);
  }

  /** Same as previous function, but specifically for section texts */
  static requestSectionTexts(key: string): Promise<textsObject> {
    return SearchAPI.requestTexts(key) as Promise<textsObject>;
  }

  /** Same as previous function, but specifically for helper texts */
  static requestHelperTexts(key: string): Promise<helperText> {
    return SearchAPI.requestTexts(key) as Promise<helperText>;
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

  /**
   * Recover details in the selected area
   * @param {Number | String} idArea id area to request, f.e. ea
   * @param {Number | String} idGeofence id geofence to request, f.e. idCAR
   *
   * @return {Promise<Object>} Object with values of selected area
   */
  static requestGeofenceDetails(
    idArea: string | number,
    idGeofence: string | number
  ): Promise<drawerGF> {
    return SearchAPI.makeGetRequest(`${idArea}/${idGeofence}`);
  }
}

export default SearchAPI;
