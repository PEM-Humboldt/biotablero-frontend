import axios, { CancelTokenSource } from "axios";
import { SCIHF } from "pages/search/types/forest";
import { cfData } from "pages/search/types/compensationFactor";
import {
  currentPAConn,
  currentSEPAConn,
  DPC,
  timelinePAConn,
} from "pages/search/types/connectivity";
import { hfPersistence, hfTimeline } from "pages/search/types/humanFootprint";
import {
  helperText,
  textResponse,
  textsObject,
} from "pages/search/types/texts";
import { SEPAData, seDetails } from "pages/search/types/ecosystems";
import {
  concentration,
  gaps,
  NOSNational,
  NOSThresholds,
  numberOfSpecies,
} from "pages/search/types/richness";
import {
  portfoliosByTarget,
  targetOrPortfolio,
} from "pages/search/types/portfolios";
import { geofenceDetails } from "pages/search/types/dashboard";

class BackendAPI {
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
    areaId: string | number,
  ): Promise<Array<SCIHF>> {
    return BackendAPI.makeGetRequest(
      `forest/sci/hf?areaType=${areaType}&areaId=${areaId}`,
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
   * @return {Promise<Array>} Array of objects with data of current PA connectivity
   */
  static requestCurrentPAConnectivity(
    areaType: string,
    areaId: string | number,
  ): Promise<Array<currentPAConn>> {
    return BackendAPI.makeGetRequest(
      `connectivity/current?areaType=${areaType}&areaId=${areaId}`,
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
   * @return {Promise<Array>} Array of objects with data of current PA connectivity by SE
   */
  static requestCurrentSEPAConnectivity(
    areaType: string,
    areaId: string | number,
    seType: string | number,
  ): Promise<Array<currentSEPAConn>> {
    return BackendAPI.makeGetRequest(
      `connectivity/current/se?areaType=${areaType}&areaId=${areaId}&seType=${seType}`,
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
    category: string,
  ): Promise<timelinePAConn> {
    return BackendAPI.makeGetRequest(
      `connectivity/timeline?areaType=${areaType}&areaId=${areaId}&category=${category}`,
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
    areaId: string | number,
  ): Promise<Array<cfData>> {
    return BackendAPI.makeGetRequest(`${areaType}/${areaId}/generalBiome`);
  }

  /**
   * Recover biotic units by selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestBioticUnits(
    areaType: string,
    areaId: string | number,
  ): Promise<Array<cfData>> {
    return BackendAPI.makeGetRequest(`${areaType}/${areaId}/bioticUnit`);
  }

  /**
   * Recover compensation Factor values by selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestCompensationFactor(
    areaType: string,
    areaId: string | number,
  ): Promise<Array<cfData>> {
    return BackendAPI.makeGetRequest(
      `${areaType}/${areaId}/compensationFactor`,
    );
  }

  /**
   * Request the layer of the biomes by EA
   * @param {Number | String} areaId id ea to request
   *
   * @return {ShapeAPIObject} layer object to be loaded in the map
   */
  static requestBiomesbyEALayer(areaId: number | string) {
    const source = axios.CancelToken.source();
    return {
      request: BackendAPI.makeGetRequest(`ea/layers/${areaId}/biomes`, {
        cancelToken: source.token,
      }),
      source,
    };
  }

  /** *************** */
  /** HUMAN FOOTPRINT */
  /** *************** */
  /**

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
    areaId: string | number,
  ): Promise<Array<hfPersistence>> {
    return BackendAPI.makeGetRequest(`${areaType}/${areaId}/hf/persistence`);
  }

  /** ******** */
  /** RICHNESS */
  /** ******** */

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
    areaId: number | string,
  ): Promise<Array<gaps>> {
    return BackendAPI.makeGetRequest(
      `richness/gaps?areaType=${areaType}&areaId=${areaId}`,
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
    areaId: number | string,
  ): Promise<Array<concentration>> {
    return BackendAPI.makeGetRequest(
      `richness/concentration?areaType=${areaType}&areaId=${areaId}`,
    );
  }

  /** ********** */
  /** PORTFOLIOS */
  /** ********** */

  /**
   * Get all portfolios for a specific target within a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {Number} targetId target id to get results
   *
   * @return {Promise<Object>} Object with portfolios data
   */
  static requestPortfoliosByTarget(
    areaType: string,
    areaId: number | string,
    targetId: number,
  ): Promise<portfoliosByTarget> {
    return BackendAPI.makeGetRequest(
      `portfolios-ca/targets/${targetId}/values?areaType=${areaType}&areaId=${areaId}`,
    );
  }

  /**
   * Get list of targets with portfolios values within a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with targets list
   */
  static requestTargetsList(
    areaType: string,
    areaId: number | string,
  ): Promise<Array<targetOrPortfolio>> {
    return BackendAPI.makeGetRequest(
      `portfolios-ca/targets/list?areaType=${areaType}&areaId=${areaId}`,
    );
  }

  /**
   * Get list of portfolios
   *
   * @return {Promise<Array>} Array of objects with targets list
   */
  static requestPortfoliosList(): Promise<Array<targetOrPortfolio>> {
    return BackendAPI.makeGetRequest(`portfolios-ca/portfolios/list`);
  }

  /**
   * Get the layer associated to a portfolio id in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {Number} portfolioId portfolio id to get layer
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */

  static requestPortfoliosCALayer(
    areaType: string,
    areaId: string,
    portfolioId: number,
  ): { request: Promise<Object>; source: CancelTokenSource } {
    const source = axios.CancelToken.source();
    return {
      request: BackendAPI.makeGetRequest(
        `portfolios-ca/portfolios/layer?areaType=${areaType}&areaId=${areaId}&portfolioId=${portfolioId}`,
        { cancelToken: source.token, responseType: "arraybuffer" },
        true,
      ),
      source,
    };
  }

  /**
   * Get the layer of a strategic ecosystem in a given area.
   * Data obtained from connectivity service
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type to request geometry
   *
   * @return {ShapeAPIObject} layer object to be loaded in the map
   */
  static requestPAConnSELayer(
    areaType: string,
    areaId: string,
    seType: string,
  ) {
    const source = axios.CancelToken.source();
    return {
      request: BackendAPI.makeGetRequest(
        `connectivity/se/layer?areaType=${areaType}&areaId=${areaId}&seType=${seType}`,
        { cancelToken: source.token },
      ),
      source,
    };
  }

  /**
   * Get the geometry associated for the structural condition index with human footprint persistence
   * in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {ShapeAPIObject} layer object to be loaded in the map
   */
  static requestSCIHFGLayer(areaType: string, areaId: number | string) {
    const source = axios.CancelToken.source();
    return {
      request: BackendAPI.makeGetRequest(
        `forest/sci/hf/layer?areaType=${areaType}&areaId=${areaId}`,
        { cancelToken: source.token },
      ),
      source,
    };
  }

  /**
   * Get the geometry associated to protected areas in a given combination of structural condition
   * index and human footprint persistence in an specific area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} sciCat sci category
   * @param {String} hfPers hf persistence category
   *
   * @return {ShapeAPIObject} layer object to be loaded in the map
   */
  static requestSCIHFPALayer(
    areaType: string,
    areaId: string | number,
    sciCat: string,
    hfPers: string,
  ) {
    const source = axios.CancelToken.source();
    return {
      request: BackendAPI.makeGetRequest(
        `forest/sci/${sciCat}/hf/${hfPers}/layer?areaType=${areaType}&areaId=${areaId}`,
        { cancelToken: source.token },
      ),
      source,
    };
  }

  /**
   * Get the geometry associated for the human footprint persistence in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {ShapeAPIObject} layer object to be loaded in the map
   */
  static requestHFPersistenceLayer(areaType: string, areaId: string | number) {
    const source = axios.CancelToken.source();
    return {
      request: BackendAPI.makeGetRequest(
        `${areaType}/${areaId}/hf/layers/persistence`,
        { cancelToken: source.token },
      ),
      source,
    };
  }

  /**
   * According to the strategic ecosystem type, get the footprint timeline geometry
   * associated to the selected area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type to request geometry
   *
   * @return {ShapeAPIObject} layer object to be loaded in the map
   */
  static requestHFLayerBySEInGeofence(
    areaType: string,
    areaId: string | number,
    seType: string,
  ) {
    const source = axios.CancelToken.source();
    return {
      request: BackendAPI.makeGetRequest(
        `${areaType}/${areaId}/se/layers/${seType}`,
        { cancelToken: source.token },
      ),
      source,
    };
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
    return BackendAPI.makeGetRequest(`util/texts?key=${key}`);
  }

  /** Same as previous function, but specifically for section texts */
  static requestSectionTexts(key: string): Promise<textsObject> {
    return BackendAPI.requestTexts(key) as Promise<textsObject>;
  }

  /** Same as previous function, but specifically for helper texts */
  static requestHelperTexts(key: string): Promise<helperText> {
    return BackendAPI.requestTexts(key) as Promise<helperText>;
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
        Authorization: `apiKey ${window._env_?.VITE_BACKEND_KEY || import.meta.env.VITE_BACKEND_KEY}`,
      },
    };
    return axios
      .get(
        `${window._env_?.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL}/${endpoint}`,
        config,
      )
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
    idGeofence: string | number,
  ): Promise<geofenceDetails> {
    return BackendAPI.makeGetRequest(`${idArea}/${idGeofence}`);
  }
}

export default BackendAPI;
