import axios, { CancelToken } from 'axios';

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
   * Get coverage area by selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestCoverage(areaType, areaId) {
    return RestAPI.makeGetRequest(`ecosystems/coverage?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Get the protected areas values by selected area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestProtectedAreas(areaType, areaId) {
    return RestAPI.makeGetRequest(`/pa?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Recover the national area by selected strategic ecosystems
   * @param {Number} idGeofence id geofence to request the strategic ecosystems
   */
  static requestNationalSE(idGeofence) {
    return RestAPI.makeGetRequest(`se/${idGeofence}/national`);
  }

  /**
   * Recover the national coverage by selected strategic ecosystems
   * @param {Number} idGeofence id geofence to request the strategic ecosystems
   */
  static requestNationalCoverage(idGeofence) {
    return RestAPI.makeGetRequest(`se/${idGeofence}/coverage`);
  }

  /**
   * Get the area distribution for each SE type and total SE area within a given area
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   */
  static requestStrategicEcosystems(areaType, areaId) {
    return RestAPI.makeGetRequest(`ecosystems/se?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Recover the strategic ecosystems values in the area selected
   * @param {Number} idArea id area to request
   * @param {Number} idGeofence id geofence to request
   * @param {Number} seType strategic ecosystem type to request details
   */
  static requestSEDetailInArea(idArea, idGeofence, seType) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}/se/${seType}`);
  }

  /**
   * Get the coverage area distribution by selected strategic ecosystem and geofence
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type
   */
  static requestSECoverageByGeofence(areaType, areaId, seType) {
    return RestAPI.makeGetRequest(
      `ecosystems/coverage/se?areaType=${areaType}&areaId=${areaId}&seType=${seType}`,
    );
  }

  /**
   * Get the the protected area by selected strategic ecosystems and geofence
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {Number} seType type of strategic ecosystem to request
   */
  static requestSEPAByGeofence(areaType, areaId, seType) {
    return RestAPI.makeGetRequest(`/pa/se?areaType=${areaType}&areaId=${areaId}&seType=${seType}`);
  }

  /**
   * Recover details in the selected area
   * @param {Number} idArea id area to request, f.e. ea
   * @param {Number} idGeofence id geofence to request, f.e. idCAR
   */
  static requestGeofenceDetails(idArea, idGeofence) {
    return RestAPI.makeGetRequest(`${idArea}/${idGeofence}`);
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
   * Get the current human footprint value in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Object} Objecy with value and category for the current human footprint
   */
  static requestCurrentHFValue(areaType, areaId) {
    return RestAPI.makeGetRequest(`${areaType}/${areaId}/hf/current/value`);
  }

  /**
   * Get the current human footprint data by categories in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with data for the current human footprint
   */
  static requestCurrentHFCategories(areaType, areaId) {
    return RestAPI.makeGetRequest(`${areaType}/${areaId}/hf/current/categories`);
  }

  /**
   * Get the persistence of human footprint data in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with data for the persistence of human footprint
   */
  static requestHFPersistence(areaType, areaId) {
    return RestAPI.makeGetRequest(`${areaType}/${areaId}/hf/persistence`);
  }

  /**
   * Get the human footprint timeline data in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with human footprint timeline data in the given area
   */
  static requestTotalHFTimeline(areaType, areaId) {
    return RestAPI.makeGetRequest(`${areaType}/${areaId}/hf/timeline`);
  }

  /**
   * Get the human footprint timeline data for a specific strategic ecosystem in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type, f.e. "Páramo"
   *
   * @return {Promise<Array>} Array of objects separated by strategic ecosystem with human
   * footprint timeline data
   */
  static requestSEHFTimeline(areaType, areaId, seType) {
    return RestAPI.makeGetRequest(`${areaType}/${areaId}/se/${seType}/hf/timeline`);
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

  /**
   * Get the forest loss and persistence data by periods and categories in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with data for the forest loss and persistence
   */
  static requestForestLP(areaType, areaId) {
    return RestAPI.makeGetRequest(`forest/lp?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Get the structural condition index with human footprint persistence categories in the given
   * area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Objects with value for the SCI and HF persistence
   */
  static requestSCIHF(areaType, areaId) {
    return RestAPI.makeGetRequest(`sci/hf?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Get the area distribution for each category of protected area connectivity in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Array of objects with data of current PA connectivity
   */
  static requestCurrentPAConnectivity(areaType, areaId) {
    return RestAPI.makeGetRequest(`connectivity/current?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Get the values of connectivity for the protected areas with higher dPC value in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Array of objects with data of the protected areas
   */
  static requestDPC(areaType, areaId, paNumber) {
    return RestAPI.makeGetRequest(`connectivity/dpc?areaType=${areaType}&areaId=${areaId}&paNumber=${paNumber}`);
  }

  /**
    * Get the timeline for each category of protected area connectivity in a given area
    *
    * @param {String} areaType area type id, f.e. "ea", "states"
    * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
    * @param {String} category category of index, fe. "prot", "prot_conn"
    *
    * @return {Promise<Array>} Array of objects with data of timeline PA connectivity
    */
  static requestTimelinePAConnectivity(areaType, areaId, category) {
    return RestAPI.makeGetRequest(`connectivity/timeline?areaType=${areaType}&areaId=${areaId}&category=${category}`);
  }

  /**
   * Get the area distribution for each category of protected area connectivity for an specific
   * strategic ecosystem in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type
   *
   * @return {Promise<Object>} Array of objects with data of current PA connectivity by SE
   */
  static requestCurrentPAConnectivityBySE(areaType, areaId, seType) {
    return RestAPI.makeGetRequest(`connectivity/current/se?areaType=${areaType}&areaId=${areaId}&seType=${seType}`);
  }

  /**
   * Get the number of species for the specified area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} group group to filter results
   *
   * @return {Promise<Object>} Array of objects with observed, inferred and region number of species
   */
  static requestNumberOfSpecies(areaType, areaId, group) {
    return RestAPI.makeGetRequest(
      `richness/number-species?areaType=${areaType}&areaId=${areaId}${group ? `&group=${group}` : ''}`,
    );
  }

  /**
   * Get the thresholds for the number of species in the same biotic unit as the specified area id
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} group group to filter results
   *
   * @return {Promise<Object>} Array of objects with minimum and maximun number of observed and
   * inferred species
   */
  static requestNSThresholds(areaType, areaId, group) {
    return RestAPI.makeGetRequest(
      `richness/number-species/thresholds?areaType=${areaType}&areaId=${areaId}${group ? `&group=${group}` : ''}`,
    );
  }

  /**
   * Get the national max values specified area type
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {String} group group to filter results
   *
   * @return {Promise<Object>} Array of objects with minimum and maximun number of observed and
   * inferred species
   */
  static requestNSNationalMax(areaType, group) {
    return RestAPI.makeGetRequest(
      `richness/number-species/nationalMax?areaType=${areaType}${group ? `&group=${group}` : ''}`,
    );
  }

  /**
   * Get values for richness species gaps in the given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Object with values of richness species gaps
   */
  static requestGaps(areaType, areaId) {
    return RestAPI.makeGetRequest(`richness/gaps?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Get values for richness species concentration in the given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Object with values of richness species concentration
   */
  static requestConcentration(areaType, areaId) {
    return RestAPI.makeGetRequest(`richness/concentration?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Get values of functional diversity in the dry forest in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} Object with values of functional diversity in the dry forest
   */
  static requestDryForestValues(areaType, areaId) {
    return RestAPI.makeGetRequest(`functional-diversity/dry-forest/values?areaType=${areaType}&areaId=${areaId}`);
  }

  /**
   * Get values of functional features in the dry forest in a given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Array>} Array of objects with values of functional features in the dry forest
   */
  static requestDryForestFeatures(areaType, areaId) {
    return RestAPI.makeGetRequest(`functional-diversity/dry-forest/features?areaType=${areaType}&areaId=${areaId}`);
  }

  /** ******************** */
  /** MAPS - SEARCH MODULE */
  /** ******************** */

  /**
   * Request the geometry of the biomes by EA
   * @param {String} eaId id ea to request
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestBiomesbyEAGeometry(eaId) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`ea/layers/${eaId}/biomes`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * Request area geometry by id
   *
   * @param {String} areaId area id to request
   *
   * @return {Object} Including Promise with layer object to load in map and source reference to
   * cancel the request
   */
  static requestNationalGeometryByArea(areaId) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`${areaId}/layers/national`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * Request a specific geofence geometry identified by area and geofence
   *
   * @param {String} areaId area id to request
   * @param {String} geofenceId geofence id to request
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestGeofenceGeometryByArea(areaId, geofenceId) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`${areaId}/layers/${geofenceId}`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * Get the coverage layer divided by categories in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} coverageType coverage category
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestCoveragesLayer(areaType, areaId, coverageType) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(
        `ecosystems/coverage/layer?areaType=${areaType}&areaId=${areaId}&coverageType=${coverageType}`,
        { cancelToken: source.token, responseType: 'arraybuffer' },
        true,
      ),
      source,
    };
  }

  /**
   * Get the coverage layer divided by categories in a given strategic ecosystem and area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} coverageType coverage category
   * @param {String} seType strategic ecosystem type
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
   static requestCoveragesSELayer(areaType, areaId, coverageType, seType) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(
        `ecosystems/coverage/se/layer?areaType=${areaType}&areaId=${areaId}&coverageType=${coverageType}&seType=${seType}`,
        { cancelToken: source.token, responseType: 'arraybuffer' },
        true,
      ),
      source,
    };
  }

  /**
   * Get the geometry associated for the current human footprint in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestCurrentHFGeometry(areaType, areaId) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`${areaType}/${areaId}/hf/layers/current/categories`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * Get the geometry associated for the human footprint persistence in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestHFPersistenceGeometry(areaType, areaId) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`${areaType}/${areaId}/hf/layers/persistence`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * According to the strategic ecosystem type, get the footprint timeline geometry
   * associated to the selected area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type to request geometry
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestHFGeometryBySEInGeofence(areaType, areaId, seType) {
    const source = CancelToken.source();
    switch (seType) {
      case 'dryForest':
        return {
          request: RestAPI.makeGetRequest(`${areaType}/${areaId}/se/layers/Bosque Seco Tropical`, { cancelToken: source.token }),
          source,
        };
      case 'paramo':
        return {
          request: RestAPI.makeGetRequest(`${areaType}/${areaId}/se/layers/Páramo`, { cancelToken: source.token }),
          source,
        };
      case 'wetland':
        return {
          request: RestAPI.makeGetRequest(`${areaType}/${areaId}/se/layers/Humedal`, { cancelToken: source.token }),
          source,
        };
      default:
        return {
          request: Promise.reject(new Error('undefined option')),
          source,
        };
    }
  }

  /**
   * Get the geometry associated for the structural condition index with human footprint persistence
   * in the given area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestSCIHFGeometry(areaType, areaId) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`sci/hf/layer?areaType=${areaType}&areaId=${areaId}`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * Get the geometry associated to protected areas in a given combination of structural condition
   * index and human footprint persistence in an specific area.
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} sciCat sci category
   * @param {String} hfPers hf persistence category
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestSCIHFPAGeometry(areaType, areaId, sciCat, hfPers) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`sci/${sciCat}/hf/${hfPers}/layer?areaType=${areaType}&areaId=${areaId}`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * Get the layer associated to a category and period of forest loss and persistence
   * in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} period period
   * @param {String} category forest loss and persistence category
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestForestLPLayer(areaType, areaId, period, category) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(
        `forest/lp/layer?areaType=${areaType}&areaId=${areaId}&period=${period}&category=${category}`,
        { cancelToken: source.token, responseType: 'arraybuffer' },
        true,
      ),
      source,
    };
  }

  /**
   * Get the layers of the protected areas with higher dPC value in a given area
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {Number} paNumber number of protected areas to request, f.e. 5
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestDPCLayer(areaType, areaId, paNumber) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(`connectivity/dpc/layer?areaType=${areaType}&areaId=${areaId}&paNumber=${paNumber}`, { cancelToken: source.token }),
      source,
    };
  }

  /**
   * Get the layer of a strategic ecosystem in a given area.
   * Data obtained from connectivity service
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} seType strategic ecosystem type to request geometry
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestPAConnSELayer(areaType, areaId, seType) {
    const source = CancelToken.source();
    switch (seType) {
      case 'dryForestPAConn':
        return {
          request: RestAPI.makeGetRequest(
            `connectivity/se/layer?areaType=${areaType}&areaId=${areaId}&seType=Bosque Seco Tropical`,
            { cancelToken: source.token },
          ),
          source,
        };
      case 'paramoPAConn':
        return {
          request: RestAPI.makeGetRequest(
            `connectivity/se/layer?areaType=${areaType}&areaId=${areaId}&seType=Páramo`,
            { cancelToken: source.token },
          ),
          source,
        };
      case 'wetlandPAConn':
        return {
          request: RestAPI.makeGetRequest(
            `connectivity/se/layer?areaType=${areaType}&areaId=${areaId}&seType=Humedal`,
            { cancelToken: source.token },
          ),
          source,
        };
      default:
        return {
          request: Promise.reject(new Error('undefined option')),
          source,
        };
    }
  }

  /**
   * Get the layer of number of species for the specified group
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} group group to get the layer for, options are: total | endemic | invasive |
   * threatened
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestNOSLayer(areaType, areaId, group) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(
        `richness/number-species/layer?areaType=${areaType}&areaId=${areaId}&group=${group}`,
        { cancelToken: source.token, responseType: 'arraybuffer' },
        true,
      ),
      source,
    };
  }

  /**
   * Get the threshold values for the layer of number of species for the specified group
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   * @param {String} group group to get the layer for, options are: total | endemic | invasive |
   * threatened
   *
   * @return {Promise<Object>} object with min an max values
   */
  static requestNOSLayerThresholds(areaType, areaId, group) {
    return RestAPI.makeGetRequest(
      `richness/number-species/layer/thresholds?areaType=${areaType}&areaId=${areaId}&group=${group}`,
    );
  }

  /**
   * Request data available to custom geometry
   *
   * @param {Object} polygon polygon saved
   *
   * @return {Object} with data related to the polygon
   */
  static requestCustomPolygonData(polygon) {
    /** TODO: implement all this endpoint and also the backend response
     * to find information according to polygon coordinates
     * */
    return RestAPI.makePostRequest('polygon', {
      latLngs: polygon.latLngs,
    });
  }

  /**
   * Get the layer of gaps section of richness
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} layer object to be loaded in the map
   */
  static requestGapsLayer(areaType, areaId) {
    const source = CancelToken.source();
    return {
      request: RestAPI.makeGetRequest(
        `richness/gaps/layer?areaType=${areaType}&areaId=${areaId}`,
        { cancelToken: source.token, responseType: 'arraybuffer' },
        true,
      ),
      source,
    };
  }

  /**
   * Get the threshold values for the layer of gaps section of richness
   *
   * @param {String} areaType area type id, f.e. "ea", "states"
   * @param {Number | String} areaId area id to request, f.e. "CRQ", 24
   *
   * @return {Promise<Object>} object with min an max values
   */
  static requestGapsLayerThresholds(areaType, areaId) {
    return RestAPI.makeGetRequest(
      `richness/gaps/layer/thresholds?areaType=${areaType}&areaId=${areaId}`,
    );
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
      .then((res) => ({
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
    const cleanBiomes = biomes.map((biome) => ({
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
    strategies.map((strategy) => RestAPI.createProjectStrategy(companyId, projectId, strategy)),
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
  static downloadProjectStrategiesUrl = (companyId, projectId) => RestAPI.makeGetRequest(
    `/companies/${companyId}/projects/${projectId}/strategies/download`,
  )

  /** ************** */
  /** BASE FUNCTIONS */
  /** ************** */

  /**
   * Request an endpoint through a GET request
   *
   * @param {String} endpoint endpoint to attach to url
   */
  static makeGetRequest(endpoint, options = {}, completeRes = false) {
    const config = {
      ...options,
      headers: {
        Authorization: `apiKey ${process.env.REACT_APP_BACKEND_KEY}`,
      },
    };
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/${endpoint}`, config)
      .then((res) => {
        if (completeRes) {
          return res;
        }
        return res.data;
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return Promise.resolve('request canceled');
        }
        let message = 'Bad GET response. Try later';
        if (error.response) message = error.response.status;
        if (error.request && error.request.statusText === '') message = 'no-data-available';
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
    const config = {
      headers: {
        Authorization: `apiKey ${process.env.REACT_APP_BACKEND_KEY}`,
      },
    };
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/${endpoint}`, requestBody, config)
      .then((res) => res.data)
      .catch((error) => {
        let message = 'Bad POST response. Try later';
        if (error.response) message = error.response.status;
        if (error.request.statusText === '') message = 'no-data-available';
        return Promise.reject(message);
      });
  }
}

export default RestAPI;
