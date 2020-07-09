import axios, { CancelToken } from 'axios';
import tmpCurrentHF from './tmp_current_hf.json';
import tmpCurrentHFGeo from './tmp_current_hf_geo.json';
import tmpHFPersistence from './tmp_hf_persistence.json';
import tmpHFPersistenceGeo from './tmp_hf_persistence_geo.json';
import tmpHFTimeline from './tmp_hf_timeline.json';
import tmpHFTimelineGeo from './tmp_hf_timeline_geo.json';

class RestAPI {
  /**
   * Request the user information
   *
   * @param {String} username name in database
   * @param {String} password password in database
   */
  static requestUser(username, password) {
    return RestAPI.makePostRequest(
      'users/login',
      {
        username: `${username}`,
        password: `${password}`,
      },
    );
  }

  /** ************* */
  /** SEARCH MODULE */
  /** ************* */

  /**
   * Recover biomes located in the selected area
   * @param {Number} idArea id area to request, f.e. ea
   * @param {Number} idGeofence id geofence to request, f.e. idCAR
   */
  static requestBiomes(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/generalBiome`);
  }

  /**
   * Recover biotic units by selected area
   * @param {Number} idArea id area to request, f.e. ea
   * @param {Number} idGeofence id geofence to request, f.e. idCAR
   */
  static requestBioticUnits(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/bioticUnit`);
  }

  /**
   * Recover compensation Factor values by selected area
   * @param {Number} idArea id area to request, f.e. ea
   * @param {Number} idGeofence id geofence to request, f.e. idCAR
   */
  static requestCompensationFactor(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/compensationFactor`);
  }

  /**
   * Recover coverage area by selected area
   * @param {Number} idArea id area to request
   * @param {Number} idGeofence id geofence to request the coverage
   */
  static requestCoverage(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/coverage`);
  }

  /**
   * Recover protected areas values by selected area
   * @param {Number} idArea id area to request
   * @param {Number} idGeofence id geofence to request the protected areas
   */
  static requestProtectedAreas(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/pa`);
  }

  /**
   * Recover the national area by selected strategic ecosystems
   * @param {Number} idGeofence id geofence to request the strategic ecosystems
   */
  static requestNationalSE(idGeofence) {
    return RestAPI.makeGetRequest(`se/${idGeofence}/national`);
  }

  /**
   * Recover the national coverage by selected strategic ecosystems
   * @param {Number} idGeofence id geofence to request the strategic ecosystems
   */
  static requestNationalCoverage(idGeofence) {
    return RestAPI.makeGetRequest(`se/${idGeofence}/coverage`);
  }

  /**
   * Recover the national protected area by selected strategic ecosystems
   * @param {Number} idGeofence id geofence to request the strategic ecosystems
   */
  static requestNationalPA(idGeofence) {
    return RestAPI.makeGetRequest(`se/${idGeofence}/pa`);
  }

  /**
   * Recover the strategic ecosystems values by selected area
   * @param {Number} idArea id area to request
   * @param {Number} idGeofence id geofence to request the strategic ecosystems
   */
  static requestStrategicEcosystems(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/se`);
  }

  /**
   * Recover the strategic ecosystems values according to the selected strategic ecosystems
   * @param {Number} idArea id area to request
   * @param {Number} idGeofence id geofence to request
   * @param {Number} idSE id geofence to request details
   */
  static requestSEDetails(idArea, idGeofence, idSE) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/se/${idSE}`);
  }

  /**
   * Recover the coverage by selected strategic ecosystems and geofence
   * @param {Number} idArea id area to request
   * @param {Number} idGeofence id geofence to request
   * @param {Number} idSE id geofence to request details
   */
  static requestSECoverageByGeofence(idArea, idGeofence, idSE) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/se/${idSE}/coverage`);
  }

  /**
   * Recover the protected area by selected strategic ecosystems and geofence
   * @param {Number} idArea id area to request
   * @param {Number} idGeofence id geofence to request
   * @param {Number} idSE id geofence to request details
   */
  static requestSEPAByGeofence(idArea, idGeofence, idSE) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/se/${idSE}/pa`);
  }

  /**
   * Recover details in the selected area
   * @param {Number} idArea id area to request, f.e. ea
   * @param {Number} idGeofence id geofence to request, f.e. idCAR
   */
  static requestGeofenceDetails(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}`);
  }

  /**
   * Recover a list with all protected areas available in the database
   */
  static getAllProtectedAreas() {
    return RestAPI.makeGetRequest('pa/categories');
  }

  /**
   * Recover a list with all basin areas available in the database
   */
  static getAllBasinAreas() {
    return RestAPI.makeGetRequest('basinAreas');
  }

  /**
   * Recover a list with all basin zones available in the database
   */
  static getAllZones() {
    return RestAPI.makeGetRequest('basinZones');
  }

  /**
   * Recover a list with all basin subzones available in the database
   */
  static getAllSubzones() {
    return RestAPI.makeGetRequest('basinSubzones');
  }

  /**
   * Recover a list with all States available in the database
   */
  static getAllStates() {
    return RestAPI.makeGetRequest('states');
  }

  /**
   * Recover a list with all Strategic Ecosystems availables in the database
   */
  static getAllSEs() {
    return RestAPI.makeGetRequest('se/primary');
  }

  /**
   * Recover a list with all Environmental Authorities availables in the database
   */
  static getAllEAs() {
    return RestAPI.makeGetRequest('ea');
  }

  /**
   * Get the current footprint data in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with data for the current human footprint
   */
  static requestCurrentHF() {
    return Promise.resolve(tmpCurrentHF);
  }

  /**
   * Get the persistence of human footprint data in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with data for the persistence of human footprint
   */
  static requestHFPersistence() {
    return Promise.resolve(tmpHFPersistence);
  }

  /**
   * Get the human footprint timeline data in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects separated by strategic ecosystem with human
   * footprint timeline data
   */
  static requestHFTimeline() {
    return Promise.resolve(tmpHFTimeline);
  }

  /**
   * Request area information for biomes by subzones
   *
   * @param {String} eaId EA id to request
   * @param {String} biome biome's name to request
   */
  static requestBiomeBySZH(eaId, biomeName) {
    return RestAPI.makeGetRequest(`ea/${eaId}/biome/${biomeName}/subzone`);
  }

  /** ******************** */
  /** MAPS - SEARCH MODULE */
  /** ******************** */

  /**
   * Request the geometry of the biomes by EA
   * @param {String} eaId id ea to request
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestBiomesbyEAGeometry(eaId) {
    return RestAPI.makeGetRequest(`biomes/ea/${eaId}`);
  }

  /**
   * Request area geometry by id
   *
   * @param {String} areaId area id to request
   *
   * @return {Object} Including Promise with layer object to load in map and source reference to
   * cancel the request
   */
  static requestGeofenceGeometry(areaId) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`${areaId}/layers/national`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * Get the geometry associated for the current footprint in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestCurrentHFGeometry() {
    return Promise.resolve(tmpCurrentHFGeo);
  }

  /**
   * Get the geometry associated for the footprint timeline in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestHFTimelineGeometry() {
    return Promise.resolve(tmpHFTimelineGeo);
  }

  /**
   * Get the geometry associated for the footprint persistence in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestHFPersistenceGeometry() {
    return Promise.resolve(tmpHFPersistenceGeo);
  }


  /** ******************* */
  /** COMPENSATION MODULE */
  /** ******************* */

  /**
   * Request the project impacted biomes
   *
   * @param {String} companyId id company to request
   * @param {String} projectId id project to request
   */
  static requestImpactedBiomes(companyId, projectId) {
    return RestAPI.makeGetRequest(`companies/${companyId}/projects/${projectId}/biomes`);
  }

  /**
   * Request the project impacted biomes
   *
   * @param {String} companyId id company to request
   * @param {String} projectId id project to request
   */
  static requestImpactedBiomesDecisionTree(companyId, projectId) {
    return RestAPI.makeGetRequest(`companies/${companyId}/projects/${projectId}/decisionTree`);
  }

  /**
   * Request available strategies information for the given parameters
   *
   * @param {Number} biomeId biome id
   * @param {Number} subzoneId sub-basin id
   * @param {String} eaId environmental authority id
   */
  static requestAvailableStrategies(biomeId, subzoneId, eaId) {
    return RestAPI.makePostRequest('strategies/biomeSubzoneEA', {
      id_biome: biomeId,
      id_subzone: subzoneId,
      id_ea: eaId,
    });
  }

  /**
   * Request the project information (props and geometry)
   *
   * @param {String} companyId id company to request
   * @param {String} projectId id project to request
   */
  static requestProjectByIdAndCompany(companyId, projectId) {
    return RestAPI.makeGetRequest(`companies/${companyId}/projects/${projectId}`);
  }

  /**
   * Request the project info by company, organized by region and state
   * @param {String} companyId id company to request
   */
  static requestProjectsAndRegionsByCompany(companyId) {
    return RestAPI.makeGetRequest(`companies/${companyId}/projects?group_props=id_region,prj_status`);
  }

  /**
   * Recover all biomes available in the database
   */
  static getAllBiomes() {
    return RestAPI.makeGetRequest('biomes');
  }

  /**
   * Create a new project
   */
  static createProject(companyId, regionId, statusId, name) {
    const requestBody = {
      name: `${name}`,
      id_company: companyId,
      id_region: `${regionId}`,
      prj_status: `${statusId}`,
      details: 'Project created by user',
    };
    return RestAPI.makePostRequest(`companies/${companyId}/projects`, requestBody)
      .then(res => ({
        id_project: res.gid,
        id_company: res.id_company,
        region: res.id_region,
        state: res.prj_status,
        name: res.name,
        type: 'button',
        project: res.name.toUpperCase(),
        label: res.name,
        area: 0,
      }));
  }

  /**
   * Associate a set of biomes as impacted by the given project
   *
   * @param {Number} companyId company id
   * @param {Bumber} projectId project id
   * @param {Object[]} biomes Array of biomes info to associate
   */
  static addImpactedBiomesToProject(companyId, projectId, biomes) {
    const cleanBiomes = biomes.map(biome => ({
      id_biome: biome.id_biome,
      natural_area_ha: biome.natural_area_ha,
      secondary_area_ha: biome.secondary_area_ha,
      transformed_area_ha: biome.transformed_area_ha,
      area_impacted_ha: biome.area_impacted_ha,
      area_to_compensate_ha: biome.area_to_compensate_ha,
      area_impacted_pct: biome.area_impacted_pct,
    }));
    return RestAPI.makePostRequest(`companies/${companyId}/projects/${projectId}/biomes`, cleanBiomes);
  }

  /**
   * Create a new strategy as selected for the given project
   *
   * @param {Numer} companyId company id
   * @param {Number} projectId project id
   * @param {Object} strategy strategy to save information
   */
  static createProjectStrategy = (companyId, projectId, strategy) => RestAPI.makePostRequest(
    `companies/${companyId}/projects/${projectId}/strategies`,
    strategy,
  )

  /**
   * Save many strategies as selected for the given project
   *
   * @param {Numer} companyId company id
   * @param {Number} projectId project id
   * @param {Object[]} strategies list of strategies to save
   */
  static bulkSaveStrategies = (companyId, projectId, strategies) => Promise.all(
    strategies.map(strategy => RestAPI.createProjectStrategy(companyId, projectId, strategy)),
  )

  /**
   * Request the selected strategies for the given project
   *
   * @param {Numer} companyId company id
   * @param {Number} projectId project id
   */
  static getSavedStrategies = (companyId, projectId) => RestAPI.makeGetRequest(
    `companies/${companyId}/projects/${projectId}/strategies`,
  )

  /**
   * Download the strategies saved in the given project
   */
  static downloadProjectStrategiesUrl = (companyId, projectId) => RestAPI.getEndpointUrl(
    `companies/${companyId}/projects/${projectId}/strategies/download`,
  )

  /** ************** */
  /** BASE FUNCTIONS */
  /** ************** */

  /**
   * Request an endpoint through a GET request
   *
   * @param {String} endpoint endpoint to attach to url
   */
  static makeGetRequest(endpoint, options) {
    return axios.get(RestAPI.getEndpointUrl(endpoint), options)
      .then(res => res.data)
      .catch((error) => {
        let message = 'Bad GET response. Try later';
        if (error.response) message = error.response.status;
        if (error.request && error.request.statusText === '') message = 'no-data-available';
        return Promise.reject(message);
      });
  }

  /**
   * Request an endpoint through a POST request
   *
   * @param {String} endpoint endpoint to attach to url
   * @param {Object} requestBody JSON object with the request body
   */
  static makePostRequest(endpoint, requestBody) {
    return axios.post(RestAPI.getEndpointUrl(endpoint), requestBody)
      .then(res => res.data)
      .catch((error) => {
        let message = 'Bad POST response. Try later';
        if (error.response) message = error.response.status;
        if (error.request.statusText === '') message = 'no-data-available';
        return Promise.reject(message);
      });
  }

  static getEndpointUrl(endpoint) {
    const port = process.env.REACT_APP_REST_PORT ? `:${process.env.REACT_APP_REST_PORT}` : '';
    return `${process.env.REACT_APP_REST_HOST}${port}/${endpoint}`;
  }
}

export default RestAPI;
