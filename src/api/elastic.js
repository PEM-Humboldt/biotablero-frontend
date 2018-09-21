/** eslint verified */
import axios from 'axios';

class ElasticAPI {
  /**
   * Request the template with information about 'donde compensar' in Sogamoso project
   *
   * @param {String} biome biome's name to request
   */
  static requestProjectStrategiesByBiome(projectName, biomeName) {
    if (projectName === 'SOGAMOSO') {
      return ElasticAPI.makeRequest(
        'proyecto_sogamoso/_search/template?filter_path=aggregations.szh.buckets.key,aggregations.szh.buckets.car.buckets.key,aggregations.szh.buckets.car.buckets.results.hits.hits._source',
        {
          id: 'donde_compensar_sogamoso',
          params: { bioma_name: biomeName },
        },
      );
    } return null; // TODO: Set this request for a generical search and keeping response structure
  }

  /**
   * Request the template with information about 'Que y Cuanto compensar'
   */
  static requestQueYCuantoCompensar(project) {
    return ElasticAPI.makeRequest(
      'biomas_compensaciones/_search/template?filter_path=hits.hits._source',
      {
        id: 'queYCuantoCompensar',
        params: {
          field: 'BIOMA_IAVH',
          order: 'asc',
          project_name: project,
        },
      },
    );
  }

  /**
   * Request the template to load a given biome by subzona hidrografica.
   * Here is defined the filter_path options for this template
   *
   * @param {String} biome biome's name to request
   */
  static requestBiomeBySZH(biome) {
    return ElasticAPI.makeRequest(
      'corporacion_biomas/_search/template?filter_path=aggregations.areas.buckets,aggregations.total_area',
      {
        id: 'biomaBySZH',
        params: { bioma: biome },
      },
    );
  }

  /**
   * Request the template to load CAR by distritos Area.
   * Here is defined the filter_path options for this template
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByDistritosArea(idCAR) {
    return ElasticAPI.makeRequest(
      'corporacion_distritos/_search/template?filter_path=aggregations.areas.buckets,aggregations.total_area',
      {
        id: 'carByDistritoArea',
        params: { id_car: idCAR },
      },
    );
  }

  /**
   * Request the template to load CAR by FC Area.
   * Here is defined the filter_path options for this template
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByFCArea(idCAR) {
    return ElasticAPI.makeRequest(
      'corporacion_biomas/_search/template?filter_path=aggregations.areas.buckets,aggregations.total_area',
      {
        id: 'carByFCArea',
        params: { id_car: idCAR },
      },
    );
  }

  /**
   * Request the template to load CAR by biome Area.
   * Here is defined the filter_path options for this template
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByBiomeArea(idCAR) {
    return ElasticAPI.makeRequest(
      'corporacion_biomas/_search/template?filter_path=aggregations.areas.buckets.key,aggregations.areas.buckets.area,aggregations.areas.buckets.fc.hits.hits._source,aggregations.total_area',
      {
        id: 'carByBiomaArea',
        params: { id_car: idCAR },
      },
    );
  }

  /**
   * Request an endpoint to the elasticsearch server
   *
   * @param {String} endpoint endpoint to attach to url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequest(endpoint, requestBody) {
    const port = process.env.REACT_APP_ELASTIC_PORT ? `:${process.env.REACT_APP_ELASTIC_PORT}` : '';
    const url = `${process.env.REACT_APP_ELASTIC_HOST}${port}/${endpoint}`;
    return axios.post(url, requestBody)
      .then(res => res.data);
  }
}

export default ElasticAPI;
