import axios from "axios";

class GeoServerAPI {
  /**
   * Request the project layers, all projects or by project ID
   */
  static requestProjectLayersByCompany(companyName, projectName) {
    if (companyName === "GEB") {
      if (projectName)
        return GeoServerAPI.requestWFSBiotablero(
          "User_GEB_projects",
          `CQL_FILTER=NOM_GEN='${projectName}'`
        );
      const response = GeoServerAPI.requestWFSBiotablero("User_GEB_projects");
      return response;
    }
    return null;
  }

  /**
   * Request the GEB layers, all projects or by project ID
   */
  static requestEnvironmentalEntities(envEntity) {
    if (envEntity)
      return GeoServerAPI.requestWFSBiotablero(
        "BIOMAS_BY_CAR_MP",
        `CQL_FILTER=GroupByCar%20like%20"%'${envEntity}'"`
      );
    const response = GeoServerAPI.requestWFSBiotablero("BIOMAS_BY_CAR_MP");
    return response;
  }

  /**
   * Request the layer for 'Sogamoso'
   */
  static requestSogamoso() {
    return GeoServerAPI.requestWFSBiotablero("Sogamoso_84");
  }

  /**
   * Request the layer for 'Corpoboyaca'
   */
  static requestCorpoboyaca() {
    return GeoServerAPI.requestWFSBiotablero("Corpoboyaca-Biomas-IaVH-1");
  }

  /**
   * Request the layer for 'Jurisdicciones'
   */
  static requestJurisdicciones() {
    return GeoServerAPI.requestWFSBiotablero("jurisdicciones_low");
  }

  /**
   * Request the layer for 'Sogamoso_Biomas'
   */
  static requestBiomasSogamoso() {
    return GeoServerAPI.requestWFSBiotablero("Sogamoso_Biomas");
  }

  /**
   * Make the request with all common parameters for subtypes on 'Biotablero'
   *
   * @param {string} subType subtype name
   */
  static requestWFSBiotablero(subType, params) {
    if (params) {
      return GeoServerAPI.makeRequest(
        `geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:${subType}&${params}&outputFormat=application%2Fjson`
      );
    }
    return GeoServerAPI.makeRequest(
      `geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:${subType}&outputFormat=application%2Fjson`
    );
  }

  /**
   * Request the base layer 'Regiones_geb'
   */
  static getRequestURL() {
    return `${import.meta.env.VITE_GEOSERVER_URL}`;
  }

  /**
   * Request an endpoint to the geoserver server
   *
   * @param {String} url endpoint url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequest(endpoint) {
    return axios
      .get(`${this.getRequestURL()}/${endpoint}`)
      .then((res) => res.data);
  }

  /**
   * Request an endpoint to the geoserver server
   *
   * @param {String} url endpoint url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequestTest(endpoint) {
    return axios.get(`${endpoint}`).then((res) => res.data);
  }
}

export default GeoServerAPI;
