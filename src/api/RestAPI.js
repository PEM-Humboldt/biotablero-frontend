/** eslint verified */
import axios from 'axios';

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
   * Recover the strategic ecosystems values by selected area
   * @param {Number} idArea id area to request
   * @param {Number} idGeofence id geofence to request the strategic ecosystems
   */
  static requestStrategicEcosystems(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/se`);
  }

  /**
   * Recover the national moor values
   */
  static requestNationalMoor() {
    return RestAPI.makeGetRequest('nmoor');
  }

  /**
   * Recover the national tropical dry forest values
   */
  static requestNationalTDForest() {
    return RestAPI.makeGetRequest('ntdforest');
  }

  /**
   * Recover the national wetland values
   */
  static requestNationalWetland() {
    return RestAPI.makeGetRequest('nwetland');
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
   * Request the geometry of the biomes by EA
   * @param {String} eaId id ea to request
   */
  static requestBiomesbyEA(eaId) {
    return RestAPI.makeGetRequest(`biomes/ea/${eaId}`);
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

  /**
   * Request an endpoint through a GET request
   *
   * @param {String} endpoint endpoint to attach to url
   */
  static makeGetRequest(endpoint) {
    return axios.get(RestAPI.getEndpointUrl(endpoint))
      .then(res => res.data)
      .catch((error) => {
        let message = 'Bad GET response. Try later';
        if (error.response) message = error.response.status;
        if (error.request.statusText === '') message = 'no-data-available';
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
