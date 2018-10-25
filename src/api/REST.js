/** eslint verified */
import axios from 'axios';

class RestAPI {
  /**
   * TODO: Request the template with information about 'donde compensar'
   * for an specific project ID per biome
   *
   * @param {String} biome biome's name to request
   * @param {Integer} projectName project's name to request
   */
  static requestProjectStrategiesByBiome(projectName, biomeName) {
    // if (projectName === 'SOGAMOSO') {
    //   return RestAPI.makeGetRequest(
    //     'proyecto_sogamoso/_search/template?filter_path=aggregations.szh.buckets
    // .key,aggregations.szh.buckets.car.buckets.key,aggregations.szh.buckets.car
    // .buckets.results.hits.hits._source',
    //     {
    //       id: 'donde_compensar_sogamoso',
    //       params: { bioma_name: biomeName },
    //     },
    //   );
    // }
    console.log('requestProjectStrategiesByBiome', projectName, biomeName);
    return null;
  }

  /**
  * TODO: Request the template with information about 'Que y Cuanto compensar'
  * for an specific project ID
  * TODO: Set this request for a generical search and keeping response structure
  *
  * @param {Integer} projectName project's name to request
  */
  static requestQueYCuantoCompensar(projectName) {
    // return RestAPI.makeGetRequest(
    //   'biomas_compensaciones/_search/template?filter_path=hits.hits._source',
    //   {
    //     id: 'queYCuantoCompensar',
    //     params: {
    //       field: 'BIOMA_IAVH',
    //       order: 'asc',
    //       project_name: projectName,
    //     },
    //   },
    // );
    console.log('requestQueYCuantoCompensar', projectName);
    return null;
  }

  /**
   * TODO: Request the template to load a given biome by hydrographical subzone.
   * Here is defined the filter_path options for this template.
   * TODO: Set this request for a generical search and keeping response structure
   *
   * @param {String} biome biome's name to request
   */
  static requestBiomeBySZH(biome) {
    // return RestAPI.makeGetRequest(
    //   'corporacion_biomas/_search/template?filter_path=aggregations.areas
    // .buckets,aggregations.total_area',
    //   {
    //     id: 'biomaBySZH',
    //     params: { bioma: biome },
    //   },
    // );
    console.log('requestBiomeBySZH', biome);
    return null;
  }

  /**
   * TODO: Request the template to load CAR by distritos Area.
   * Here is defined the filter_path options for this template
   * TODO: Set this request for a generical search and keeping response structure
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByDistritosArea(idCAR) {
    // return RestAPI.makeGetRequest(
    //   'corporacion_distritos/_search/template?filter_path=aggregations
    // .areas.buckets,aggregations.total_area',
    //   {
    //     id: 'carByDistritoArea',
    //     params: { id_car: idCAR },
    //   },
    // );
    console.log('requestCarByDistritosArea', idCAR);
    return null;
  }

  /**
   * Request the template to load CAR by FC Area.
   * Here is defined the filter_path options for this template
   * TODO: Set this request for a generical search and keeping response structure
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByFCArea(idCAR) {
    // return RestAPI.makeGetRequest(
    //   'corporacion_biomas/_search/template?filter_path=aggregations
    // .areas.buckets,aggregations.total_area',
    //   {
    //     id: 'carByFCArea',
    //     params: { id_car: idCAR },
    //   },
    // );
    console.log('requestCarByFCArea', idCAR);
    return null;
  }

  /**
   * Request the template to load CAR by biome Area.
   * Here is defined the filter_path options for this template
   * TODO: Set this request for a generical search and keeping response structure
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByBiomeArea(idCAR) {
    // return RestAPI.makeGetRequest(
    //   'corporacion_biomas/_search/template?filter_path=aggregations
    // .areas.buckets.key,aggregations.areas.buckets.area,aggregations
    // .areas.buckets.fc.hits.hits._source,aggregations.total_area',
    //   {
    //     id: 'carByBiomaArea',
    //     params: { id_car: idCAR },
    //   },
    // );
    console.log('requestCarByBiomeArea', idCAR);
    return null;
  }

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
   * Request an endpoint through a GET request
   *
   * @param {String} endpoint endpoint to attach to url
   */
  static makeGetRequest(endpoint) {
    const port = process.env.REACT_APP_REST_PORT ? `:${process.env.REACT_APP_REST_PORT}` : '';
    const url = `${process.env.REACT_APP_REST_HOST}${port}/${endpoint}`;
    return axios.get(url)
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
    const port = process.env.REACT_APP_REST_PORT ? `:${process.env.REACT_APP_REST_PORT}` : '';
    const url = `${process.env.REACT_APP_REST_HOST}${port}/${endpoint}`;
    return axios.post(url, requestBody)
      .then(res => res.data)
      .catch((error) => {
        let message = 'Bad POST response. Try later';
        if (error.response) message = error.response.status;
        if (error.request.statusText === '') message = 'no-data-available';
        return Promise.reject(message);
      });
  }
}

export default RestAPI;
