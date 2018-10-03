/** eslint verified */
import axios from 'axios';

class GeoServerAPI {
  /**
   * Request the project layers, all projects or by project ID
   */
  static requestProjectLayersByCompany(companyName, projectName) {
    if (companyName === 'GEB') {
      if (projectName) return GeoServerAPI.requestWFSBiotablero('User_GEB_projects', `CQL_FILTER=NOM_GEN='${projectName}'`);
      const response = GeoServerAPI.requestWFSBiotablero('User_GEB_projects');
      return response;
    } return null;
  }

  // TODO: Migrate this function to PostgreSQLAPI or PostGISAPI
  /**
   * Request the project names by company, organized by region and state
   */
  static requestProjectNamesOrganizedByCompany(companyName) {
    const response = Promise.resolve(GeoServerAPI.requestProjectsByCompany(companyName))
      .then((res) => {
        console.log(res);
        const regions = [...new Set(res.map(item => (item.region).split(' ').map(str => str[0].toUpperCase() + str.slice(1)).join(' ')))];
        const states = [...new Set(res.map(item => item.state))];
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
        return projectsSelectorData;
      });
    return response;
  }

  // TODO: Migrate this function to PostgreSQLAPI or PostGISAPI
  /**
   * Request the project layers names, all projects or by project ID
   */
  static requestProjectsByCompany(companyName, projectName) {
    if (companyName === 'GEB') {
      const request = projectName
        ? GeoServerAPI.requestWFSBiotablero('User_GEB_projects', `CQL_FILTER=NOM_GEN='${projectName}'`)
        : GeoServerAPI.requestWFSBiotablero('User_GEB_projects');
      const response = Promise.resolve(request)
        .then((res) => {
          const projectsFound = [];
          // TODO: Finalize new projects load structure
          res.features.forEach(
            (element) => {
              const project = {
                region: element.properties.REGION,
                state: element.properties.ESTADO,
                area: element.properties.AREA_ha,
                name: element.properties.NOM_GEN,
                project: element.properties.PROYECTO,
              };
              projectsFound.push(project);
            },
          );
          return projectsFound;
        });
      return response;
    } return null;
  }

  /**
   * Request the GEB layers, all projects or by project ID
   */
  static requestEnvironmentalEntities(envEntity) {
    if (envEntity) return GeoServerAPI.requestWFSBiotablero('BIOMAS_BY_CAR_MP', `CQL_FILTER=GroupByCar%20like%20"%'${envEntity}'"`);
    const response = GeoServerAPI.requestWFSBiotablero('BIOMAS_BY_CAR_MP');
    return response;
  }

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
  static requestWFSBiotablero(subType, params) {
    if (params) {
      return GeoServerAPI.makeRequest(`geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:${subType}&${params}&outputFormat=application%2Fjson`);
    }
    return GeoServerAPI.makeRequest(`/geoserver/Biotablero/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Biotablero:${subType}&outputFormat=application%2Fjson`);
  }

  /**
   * Request the base layer 'Regiones_geb'
   */
  static getRequestURL() {
    const port = process.env.REACT_APP_GEOSERVER_PORT ? `:${process.env.REACT_APP_GEOSERVER_PORT}` : '';
    return `${process.env.REACT_APP_GEOSERVER_HOST}${port}`;
  }

  /**
   * Request an endpoint to the geoserver server
   *
   * @param {String} url endpoint url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequest(endpoint) {
    return axios.get(`${this.getRequestURL()}/${endpoint}`)
      .then(res => res.data);
  }

  /**
   * Request an endpoint to the geoserver server
   *
   * @param {String} url endpoint url
   * @param {Object} requestBody JSON object with the request body
   */
  static makeRequestTest(endpoint) {
    return axios.get(`${endpoint}`)
      .then(res => res.data);
  }
}

export default GeoServerAPI;
