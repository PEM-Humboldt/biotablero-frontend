/** eslint verified */
import axios from 'axios';

class RestAPI {
  /**
   * TODO: Request the template with information about 'donde compensar'
   * for an specific project ID per biome
   * TODO: Set this request for a generical search and keeping response structure
   *
   * @param {String} biome biome's name to request
   * @param {Integer} projectName project's name to request
   */
  static requestProjectStrategiesByBiome(projectName, biomeName) {
    // if (projectName === 'SOGAMOSO') {
    //   return RestAPI.makeRequest(
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
    // return RestAPI.makeRequest(
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
    // return RestAPI.makeRequest(
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
    // return RestAPI.makeRequest(
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
    // return RestAPI.makeRequest(
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
    // return RestAPI.makeRequest(
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
   * Request the project layers names, all projects or by project ID
   * TODO: Set this request for a generical search and keeping response structure
   *
   * @param {String} companyId id company to request
   * @param {String} projectId id proyect to request
   */
  static requestProjectsByCompany(companyId, projectId) {
    const request = projectId
      ? RestAPI.makeRequest(`/company/'${companyId}'/projects/'${projectId}'`)
      : RestAPI.makeRequest(`/company/'${companyId}'/projects`);
    const response = Promise.resolve(request)
      .then((res) => {
        const projectsFound = [];
        // TODO: Finalize new projects load structure
        res.features.forEach(
          (element) => {
            const project = {
              id_project: element.properties.gid,
              name: element.properties.label,
              state: element.properties.prj_status,
              region: element.properties.region,
              area: element.properties.area_ha,
              id_company: element.properties.id_company,
              project: element.properties.name,
            };
            projectsFound.push(project);
          },
        );
        return projectsFound;
      });
    console.log('response', response);
    return response;
  }

  /**
   * Request an endpoint to the elasticsearch server
   *
   * @param {String} endpoint endpoint to attach to url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequest(endpoint, requestBody) {
    const port = process.env.REACT_APP_REST_PORT ? `:${process.env.REACT_APP_REST_PORT}` : '';
    const url = `${process.env.REACT_APP_REST_HOST}${port}/${endpoint}`;
    return axios.post(url, requestBody)
      .then(res => res.data);
  }
}

export default RestAPI;
