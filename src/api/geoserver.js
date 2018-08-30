/** eslint verified */
import axios from 'axios';

const GEOSERVER_HOST = 'http://indicadores.humboldt.org.co';
const GEOSERVER_PORT = '80';

class GeoServerAPI {
  /**
   * Request the layer for 'Sogamoso'
   */
  static requestSogamoso() {
    return GeoServerAPI.requestWFSBiotablero('Sogamoso_84');
  }

  /**
   * Request the layer for 'Corpoboyaca'
   */
  static requestCorpoboyaca() {
    return GeoServerAPI.requestWFSBiotablero('Corpoboyaca-Biomas-IaVH-1');
  }

  /**
   * Request the layer for 'Jurisdicciones'
   */
  static requestJurisdicciones() {
    return GeoServerAPI.requestWFSBiotablero('jurisdicciones_low');
  }

  /**
   * Request the layer for 'Sogamoso_Biomas'
   */
  static requestBiomasSogamoso() {
    return GeoServerAPI.requestWFSBiotablero('Sogamoso_Biomas');
  }

  /**
   * Make the request with all common parameters for subtypes on 'Biotablero'
   *
   * @param {string} subType subtype name
   */
  static requestWFSBiotablero(subType) {
    return GeoServerAPI.makeRequest(
      `geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:${subType}&outputFormat=application%2Fjson`,
    );
  }

  /**
   * Request an endpoint to the geoserver server
   *
   * @param {String} url endpoint url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequest(endpoint) {
    const url = `${GEOSERVER_HOST}:${GEOSERVER_PORT}/${endpoint}`;
    return axios.get(url)
      .then(res => res.data);
  }
}

export default GeoServerAPI;
