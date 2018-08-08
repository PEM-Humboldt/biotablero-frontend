import axios from 'axios';

const ELASTIC_HOST = 'http://192.168.11.63'
const ELASTIC_PORT = '9250'

class ElasticAPI {
  /**
   * Request the template to load CAR by distritos Area.
   * Here is defined the filter_path options for this template
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByDistritosArea = (idCAR) => {
    return ElasticAPI.makeRequest(
      `${ELASTIC_HOST}:${ELASTIC_PORT}/corporacion_distritos/_search/template?filter_path=aggregations.areas.buckets,aggregations.total_area`,
      {
        id: 'carByDistritoArea',
        params: { id_car: idCAR }
      }
    );
  }

  /**
   * Request the template to load CAR by FC Area.
   * Here is defined the filter_path options for this template
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByFCArea = (idCAR) => {
    return ElasticAPI.makeRequest(
      `${ELASTIC_HOST}:${ELASTIC_PORT}/corporacion_biomas/_search/template?filter_path=aggregations.areas.buckets,aggregations.total_area`,
      {
        id: 'carByFCArea',
        params: { id_car: idCAR }
      }
    );
  }

  /**
   * Request the template to load CAR by bioma Area.
   * Here is defined the filter_path options for this template
   *
   * @param {String} idCAR id CAR to request
   */
  static requestCarByBiomaArea = (idCAR) => {
    return ElasticAPI.makeRequest(
      `${ELASTIC_HOST}:${ELASTIC_PORT}/corporacion_biomas/_search/template?filter_path=aggregations.areas.buckets.key,aggregations.areas.buckets.area,aggregations.areas.buckets.fc.hits.hits._source,aggregations.total_area`,
      {
        id: 'carByBiomaArea',
        params: { id_car: idCAR }
      }
    );
  }

  /**
   * Request an endpoint to the elasticsearch server
   *
   * @param {String} url endpoint url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequest = (url, requestBody) => {
    return axios.post(url, requestBody)
      .then( res => {
        return res.data
      });
  }
}

export default ElasticAPI;
