import axios from 'axios';

const ELASTIC_HOST = 'http://192.168.11.63';
const ELASTIC_PORT = '9250';

class ElasticAPI {
  /**
   * Request the template with information about 'donde compensar' in Sogamoso project
   *
   * @param {String} bioma bioma's name to request
   */
  static requestDondeCompensarSogamoso(bioma) {
    return ElasticAPI.makeRequest(
      'proyecto_sogamoso/_search/template?filter_path=aggregations.szh.buckets.key,aggregations.szh.buckets.car.buckets.key,aggregations.szh.buckets.car.buckets.results.hits.hits._source',
      {
        id: 'donde_compensar_sogamoso',
        params: { bioma_name: bioma },
      },
    );
  }

  /**
   * Request the template with information about 'Que y Cuanto compensar'
   */
  static requestQueYCuantoCompensar() {
    return ElasticAPI.makeRequest(
      'biomas_compensaciones/_search/template?filter_path=hits.hits.fields,aggregations',
      {
        id: 'queYCuantoCompensar',
        params: {
          field: 'BIOMA_IAVH',
          order: 'asc',
        },
      },
    );
  }

  /**
   * Request the template to load a given bioma by subzona hidrografica.
   * Here is defined the filter_path options for this template
   *
   * @param {String} bioma bioma's name to request
   */
  static requestBiomaBySZH(bioma) {
    return ElasticAPI.makeRequest(
      'corporacion_biomas/_search/template?filter_path=aggregations.areas.buckets,aggregations.total_area',
      {
        id: 'biomaBySZH',
        params: { bioma },
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
   * Request the template to load CAR by bioma Area.
   * Here is defined the filter_path options for this template
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByBiomaArea(idCAR) {
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
   * @param {String} url endpoint url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequest(endpoint, requestBody) {
    const url = `${ELASTIC_HOST}:${ELASTIC_PORT}/${endpoint}`;
    return axios.post(url, requestBody)
      .then(res => res.data);
  }
}

export default ElasticAPI;
