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
   * Request the project layers names, all projects or by project ID
   * TODO: Set this request for a generical search and keeping response structure
   *
   * @param {String} companyId id company to request
   * @param {String} projectId id proyect to request
   */
  static requestProjectsByCompany(companyId, projectId) {
    const request = projectId
      ? RestAPI.makeGetRequest(`companies/${companyId}/projects/${projectId}`)
      : RestAPI.makeGetRequest(`companies/${companyId}/projects`);
    const response = Promise.resolve(request)
      .then((res) => {
        const projectsFound = [];
        // TODO: Finalize new projects load structure
        if (res !== undefined && res.length !== undefined) {
          res.forEach(
            (element) => {
              const project = {
                id_project: element.gid,
                name: element.label,
                state: element.prj_status,
                region: element.id_region,
                area: element.area_ha,
                id_company: element.id_company,
                project: element.name,
              };
              projectsFound.push(project);
            },
          );
          return projectsFound;
        } return res;
      });
    return response;
  }

  /**
   * Request the project names by company, organized by region and state
   */
  static requestProjectsAndRegionsByCompany(companyId) {
    const response = Promise.resolve(RestAPI.requestProjectsByCompany(companyId))
      .then((res) => {
        if (res !== undefined) {
          const regions = [...new Set(res.map((item) => {
            if (item.region) {
              return (item.region).split(' ').map(str => str[0].toUpperCase() + str.slice(1)).join(' ');
            }
            return '(REGION SIN ASIGNAR)';
          }))];
          const states = [...new Set(res.map((item) => {
            if (item.state) return item.state;
            return '(ESTADO SIN ASIGNAR)';
          }))];
          const projectsSelectorData = regions.map(region => (
            {
              id: region,
              projectsStates: states.map(state => (
                {
                  id: state,
                  projects: res.filter(project => project.region
                    === region && project.state === state),
                })),
            }));
          return [res, projectsSelectorData];
        } return res;
      });
    return response;
  }

  /**
   * Request an endpoint to the elasticsearch server
   *
   * @param {String} endpoint endpoint to attach to url
   */
  static makeGetRequest(endpoint) {
    const port = process.env.REACT_APP_REST_PORT ? `:${process.env.REACT_APP_REST_PORT}` : '';
    const url = `${process.env.REACT_APP_REST_HOST}${port}/${endpoint}`;
    return axios.get(url)
      .then(res => res.data)
      .catch((e) => { console.error(e.message); });
  }
}

export default RestAPI;
