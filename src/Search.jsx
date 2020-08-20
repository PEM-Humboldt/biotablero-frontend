import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import L from 'leaflet';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ConstructDataForSearch } from './commons/ConstructDataForSelector';
import { description } from './search/assets/selectorData';
import Drawer from './search/Drawer';
import GeoServerAPI from './api/GeoServerAPI'; // TODO: Migrate functionalities to RestAPI
import MapViewer from './commons/MapViewer';
import matchColor from './commons/matchColor';
import RestAPI from './api/RestAPI';
import SearchContext from './SearchContext';
import Selector from './commons/Selector';

/**
 * Get the label tooltip on the map
 */
// TODO: Centralize as it is used in more that one component
const tooltipLabel = {
  natural: 'Natural',
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  estable_natural: 'Estable Natural',
  dinamica: 'Dinámica',
  estable_alta: 'Estable Alta',
  aTotal: 'Total',
  paramo: 'Páramo',
  wetland: 'Humedal',
  dryForest: 'Bosque Seco Tropical',
};


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLayer: null,
      connError: false,
      dataError: false,
      geofencesArray: [],
      areaList: [],
      layers: {},
      loadingModal: false,
      selectedAreaType: null,
      selectedArea: null,
      requestSource: null,
    };
  }

  componentDidMount() {
    const { selectedAreaTypeId, selectedAreaId, history } = this.props;
    if (!selectedAreaTypeId || !selectedAreaId) {
      history.replace(history.location.pathname);
    }
    this.loadAreaList();
  }

  /**
   * Give format to a big number
   *
   * @param {number} x number to be formatted
   * @returns {String} number formatted setting decimals and thousands properly
   */
  numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /**
   * Set area state to control transitions
   *
   * @param {Object} idLayer value to set
   */
  setArea = (idLayer) => {
    const { selectedAreaType } = this.state;
    if (!selectedAreaType || (selectedAreaType && selectedAreaType.id !== idLayer)) {
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.selectedAreaType = prevState.areaList.find(item => item.id === idLayer);
        newState.selectedArea = null;
        return newState;
      });
    }
  };

  /**
   * Recover all geofences by default available in the
   * database for the Search Module and sort them
   */
  loadAreaList = () => {
    let tempAreaList;
    let tempGeofencesArray;
    Promise.all([
      RestAPI.getAllProtectedAreas(),
      RestAPI.getAllStates(),
      RestAPI.getAllEAs(),
      RestAPI.getAllSubzones(),
      RestAPI.getAllSEs(),
    ])
      .then(([pa, states, ea, basinSubzones, se]) => {
        tempAreaList = [
          { name: 'Areas de manejo especial', data: pa, id: 'pa' },
          { name: 'Departamentos', data: states, id: 'states' },
          { name: 'Jurisdicciones ambientales', data: ea, id: 'ea' },
          { name: 'Subzonas hidrográficas', data: basinSubzones, id: 'basinSubzones' },
          { name: 'Ecosistemas estratégicos', data: se, id: 'se' },
        ];
        tempGeofencesArray = ConstructDataForSearch(tempAreaList);
        this.setState({
          geofencesArray: tempGeofencesArray,
          areaList: tempAreaList,
        }, () => {
          const {
            selectedAreaTypeId,
            selectedAreaId,
            history,
            setHeaderNames,
          } = this.props;
          if (!selectedAreaTypeId || !selectedAreaId) return;

          const inputArea = tempAreaList.find(area => area.id === selectedAreaTypeId);
          if (inputArea && inputArea.data && inputArea.data.length > 0) {
            let field = 'id';
            if (selectedAreaTypeId === 'pa') field = 'name';
            const inputId = inputArea.data.find(area => area[field] === selectedAreaId);
            if (inputId) {
              this.setArea(selectedAreaTypeId);
              this.setState(
                { selectedArea: inputId },
                () => {
                  const { selectedAreaType, selectedArea } = this.state;
                  setHeaderNames(selectedAreaType.name, selectedArea.name);
                },
              );
            } else {
              history.replace(history.location.pathname);
            }
          } else {
            history.replace(history.location.pathname);
          }
        });
      })
      .catch(() => this.reportConnError());
  }

  /**
   * Report a connection error from one of the child components
   */
  reportConnError = () => {
    this.setState({
      connError: true,
    });
  }

  /**
   * Report dataset error from one of the child components
   */
  reportDataError = () => {
    this.setState({
      loadingModal: false,
    });
  }

  /**
   * Choose the right color for the section inside the map, according to matchColor function
   * @param {String} type layer type
   * @param {String} color optional key value to select color in match color palette
   * @param {Object} feature target object
   */
  featureStyle = (type, color = null) => (feature) => {
    if (feature.properties) {
      const key = type === 'fc' ? feature.properties.compensation_factor : feature.properties.key;
      return {
        stroke: false,
        fillColor: matchColor(type)(key),
        fillOpacity: 0.7,
      };
    }

    return {
      color: matchColor(type)(color),
      weight: 2,
      fillOpacity: 0,
    };
  }

  /** ************************ */
  /** LISTENERS FOR MAP LAYERS */
  /** ************************ */

  /**
   * Listeners for leaflet on a layer
   * @param {Object} layer layer to listen on
   * @param {String} layerName layer name to identify its features and events
   */
  featureActions = (layer, layerName) => {
    layer.on(
      {
        mouseover: event => this.highlightFeature(event, layerName),
        mouseout: event => this.resetHighlight(event, layerName),
      },
    );
  }

  /**
   * Highlight specific feature on the map
   *
   * @param {Object} event event captured by interacting with the map
   * @param {String} layerName Layer name the event belongs to
   */
  highlightFeature = (event, layerName) => {
    const point = event.target;
    let changeStyle = true;
    switch (layerName) {
      case 'fc':
        point.bindPopup(
          `<b>Bioma:</b> ${point.feature.properties.name_biome}
          <br><b>Factor de compensación:</b> ${point.feature.properties.compensation_factor}`,
        ).openPopup();
        break;
      case 'hfCurrent':
      case 'hfTimeline':
      case 'hfPersistence':
        point.bindPopup(
          `<b>${tooltipLabel[point.feature.properties.key]}:</b>
          <br>${this.numberWithCommas(Number(point.feature.properties.area).toFixed(0))} ha`,
        ).openPopup();
        break;
      case 'states':
      case 'ea':
        point.bindPopup(point.feature.properties.name).openPopup();
        break;
      case 'basinSubzones':
        point.bindPopup(point.feature.properties.name_subzone).openPopup();
        break;
      default:
        changeStyle = false;
        break;
    }
    if (changeStyle) {
      point.setStyle({
        weight: 1,
        fillOpacity: 1,
      });
    }
    if (!L.Browser.ie && !L.Browser.opera) point.bringToFront();
  }

  /**
   * Reset highlight specific feature on the map
   *
   * @param {Object} event event captured by interacting with the map
   * @param {String} layerName Layer name the event belongs to
   */
  resetHighlight = (event, layerName) => {
    const feature = event.target;
    const { layers } = this.state;
    layers[layerName].layer.resetStyle(feature);
    feature.closePopup();
  }

  /**
   * Handle events happened on graphs
   *
   * @param {String} idCategory id of category selected on the graph
   */
  clickOnGraph = (idCategory) => {
    switch (idCategory) {
      case 'paramo':
      case 'wetland':
      case 'dryForest':
        this.shutOffLayer('se');
        this.switchLayer(idCategory);
        break;
      case 'aTotal':
        this.shutOffLayer('se');
        break;
      default: {
        const { layers, activeLayer } = this.state;
        const selectedSubLayer = layers[activeLayer].layer;
        selectedSubLayer.eachLayer((layer) => {
          if (layer.feature.properties.key === idCategory) {
            layer.setStyle({
              weight: 1,
              fillOpacity: 1,
            });
          } else {
            selectedSubLayer.resetStyle(layer);
          }
        });
      }
    }
  };

  /**
   * Shut off the specified layer on the map. If no layer is passed, all layers will be shut off
   * @param {String} layer optional layer name to shut off
   */
  shutOffLayer = (layer = null) => {
    const { layers: { [layer]: layerInState } } = this.state;
    if (!layer) {
      this.setState((prevState) => {
        const newState = {
          ...prevState,
        };
        const { layers } = prevState;
        Object.keys(layers).forEach((layerKey) => {
          newState.layers[layerKey].active = false;
        });
        return newState;
      });
    } else if (layerInState) {
      this.setState((prevState) => {
        const newState = {
          ...prevState,
        };
        newState.layers[layer].active = false;
        return newState;
      });
    }
  };

  /**
   * Switch layer based on graph showed
   *
   * @param {String} layerType layer type
   */
  switchLayer = (layerType) => {
    const {
      requestSource,
      selectedArea,
      selectedAreaType,
    } = this.state;
    if (requestSource) {
      requestSource.cancel();
    }
    this.setState({
      loadingModal: true,
      requestSource: null,
    });
    switch (layerType) {
      case 'fc':
        this.shutOffLayer();
        RestAPI.requestBiomesbyEAGeometry(selectedArea.id)
          .then((res) => {
            if (res.features) {
              this.setState(prevState => ({
                layers: {
                  ...prevState.layers,
                  fc: {
                    active: true,
                    layer: L.geoJSON(res, {
                      style: this.featureStyle(layerType),
                      onEachFeature: (feature, selectedLayer) => (
                        this.featureActions(selectedLayer, 'fc')
                      ),
                    }),
                  },
                },
                activeLayer: 'fc',
                loadingModal: false,
              }));
            } else this.reportDataError();
          })
          .catch(() => this.reportDataError());
        break;
      case 'hfCurrent':
        this.shutOffLayer();
        RestAPI.requestCurrentHFGeometry(selectedAreaType.id, selectedArea.id || selectedArea.name)
          .then((res) => {
            if (res.features) {
              this.setState(prevState => ({
                layers: {
                  ...prevState.layers,
                  hfCurrent: {
                    active: true,
                    layer: L.geoJSON(res, {
                      style: this.featureStyle(layerType),
                      onEachFeature: (feature, selectedLayer) => (
                        this.featureActions(selectedLayer, 'hfCurrent')
                      ),
                    }),
                  },
                },
                activeLayer: 'hfCurrent',
                loadingModal: false,
              }));
            } else this.reportDataError();
          })
          .catch(() => this.reportDataError());
        break;
      case 'paramo':
      case 'dryForest':
      case 'wetland':
        RestAPI.requestHFGeometryBySEInGeofence(
          selectedAreaType.id, selectedArea.id || selectedArea.name, layerType,
        )
          .then((res) => {
            if (res.features) {
              this.setState(prevState => ({
                layers: {
                  ...prevState.layers,
                  se: {
                    active: true,
                    layer: L.geoJSON(res, {
                      style: this.featureStyle('border', 'white'),
                      onEachFeature: (feature, selectedLayer) => (
                        this.featureActions(selectedLayer, 'se')
                      ),
                      fitBounds: false,
                    }),
                  },
                },
                loadingModal: false,
              }));
            } else this.reportDataError();
          })
          .catch(() => this.reportDataError());
        break;
      case 'hfTimeline':
      case 'hfPersistence':
        this.shutOffLayer();
        RestAPI.requestHFPersistenceGeometry(
          selectedAreaType.id, selectedArea.id || selectedArea.name,
        )
          .then((res) => {
            if (res.features) {
              this.setState(prevState => ({
                layers: {
                  ...prevState.layers,
                  hfPersistence: {
                    active: true,
                    layer: L.geoJSON(res, {
                      style: this.featureStyle('hfPersistence'),
                      onEachFeature: (feature, selectedLayer) => (
                        this.featureActions(selectedLayer, 'hfPersistence')
                      ),
                    }),
                  },
                },
                activeLayer: 'hfPersistence',
                loadingModal: false,
              }));
            } else this.reportDataError();
          })
          .catch(() => this.reportDataError());
        break;
      default:
        this.shutOffLayer();
        this.setState({ loadingModal: false });
        break;
    }
  }

  /**
   * Load layer based on selection
   *
   * @param {String} idLayer Layer ID
   * @param {Boolean} show whether to show or hide the layer
   */
  loadSecondLevelLayer = (idLayer, show) => {
    const { layers, requestSource } = this.state;
    if (requestSource) {
      requestSource.cancel();
    }

    this.setState((prevState) => {
      const newState = {
        ...prevState,
        requestSource: null,
      };
      Object.keys(newState.layers).forEach((item) => {
        newState.layers[item].active = false;
      });
      return newState;
    });

    if (layers[idLayer]) {
      if (show) {
        this.setArea(idLayer);
      }
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.layers[idLayer].active = show;
        return newState;
      });
    } else if (show) {
      const { request, source } = RestAPI.requestNationalGeometryByArea(idLayer);
      this.setState({ requestSource: source });
      this.setArea(idLayer);

      request
        .then((res) => {
          if (!res) return;
          this.setState((prevState) => {
            const newState = { ...prevState };
            newState.layers[idLayer] = {
              active: true,
              layer: L.geoJSON(
                res,
                {
                  style: {
                    color: '#e84a5f',
                    weight: 0.5,
                    fillColor: '#ffd8e2',
                    opacity: 0.6,
                    fillOpacity: 0.4,
                  },
                  onEachFeature: (feature, layer) => (
                    this.featureActions(layer, idLayer)
                  ),
                },
              ),
            };
            return newState;
          });
        })
        .catch(() => {});
    }
  }

  /** ****************************** */
  /** LISTENERS FOR SELECTOR CHANGES */
  /** ****************************** */
  secondLevelChange = (id, expanded) => {
    this.loadSecondLevelLayer(id, expanded);
  }

  /**
    * Update the active layer, sending state updated to MapViewer and Drawer
    *
    * @param {nameToOff} layer name to remove and turn off in the map
    * @param {nameToOn} layer name to active and turn on in the map
    */
  innerElementChange = (nameToOff, nameToOn) => {
    const { setHeaderNames } = this.props;
    const { requestSource, layers } = this.state;
    if (requestSource) {
      requestSource.cancel();
    }
    if (nameToOn) {
      this.setState(
        { selectedArea: nameToOn },
        () => {
          const { history } = this.props;
          const { selectedAreaType, selectedArea } = this.state;
          history.push(`?area_type=${selectedAreaType.id}&area_id=${selectedArea.id || selectedArea.name}`);
          setHeaderNames(selectedAreaType.name, selectedArea.name);
        },
      );
    }
    if (nameToOff && layers[nameToOff]) {
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.layers[nameToOff].active = false;
        return newState;
      });
    }
  }

  /** ************************************* */
  /** LISTENER FOR BUTTONS ON LATERAL PANEL */
  /** ************************************* */

  handlerBackButton = () => {
    const unsetLayers = ['fc', 'hfCurrent', 'se', 'hfTimeline', 'hfPersistence'];
    this.setState((prevState) => {
      const newState = { ...prevState };
      unsetLayers.forEach((layer) => {
        if (newState.layers[layer]) delete newState.layers[layer];
      });
      newState.selectedAreaType = null;
      newState.selectedArea = null;
      return newState;
    }, () => {
      const { history, setHeaderNames } = this.props;
      history.replace(history.location.pathname);
      setHeaderNames(null, null);
    });
  }

  /**
   * Close a given modal
   *
   * @param {String} state state value that controls the modal you want to close
   */
  handleCloseModal = state => () => {
    this.setState({ [state]: false });
  };

  render() {
    const {
      loadingModal,
      layers,
      connError,
      dataError,
      geofencesArray,
    } = this.state;

    const {
      selectedAreaTypeId,
      selectedAreaId,
    } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={connError}
          onClose={this.handleCloseModal('connError')}
          disableAutoFocus
        >
          <div className="generalAlarm">
            <h2>
              <b>Sin conexión al servidor</b>
              <br />
              Intenta de nuevo en unos minutos.
            </h2>
            <button
              type="button"
              className="closebtn"
              onClick={this.handleCloseModal('connError')}
              data-tooltip
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={dataError}
          onClose={this.handleCloseModal('dataError')}
          disableAutoFocus
        >
          <div className="generalAlarm">
            <h2>
              <b>Opción no disponible temporalmente</b>
              <br />
              Consulta otra opción
            </h2>
            <button
              type="button"
              className="closebtn"
              onClick={this.handleCloseModal('dataError')}
              data-tooltip
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={loadingModal && !connError}
          disableAutoFocus
        >
          <div className="generalAlarm">
            <h2>
              <b>Cargando</b>
              <div className="load-wrapp">
                <div className="load-1">
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                </div>
              </div>
            </h2>
          </div>
        </Modal>
        <SearchContext.Provider
          value={{
            areaId: selectedAreaTypeId,
            geofenceId: selectedAreaId,
          }}
        >
          <div className="appSearcher">
            <MapViewer
              layers={layers}
              geoServerUrl={GeoServerAPI.getRequestURL()}
            />
            <div className="mapsTitle">
              Titulo del mapa
            </div>
            <div className="contentView">
              { (!selectedAreaTypeId || !selectedAreaId) && (
                <Selector
                  handlers={[
                    () => {},
                    this.secondLevelChange,
                    this.innerElementChange,
                  ]}
                  description={description(null)}
                  data={geofencesArray}
                  expandedId={0}
                  iconClass="iconsection"
                />
              )}
              { selectedAreaTypeId && selectedAreaId && (selectedAreaTypeId !== 'se') && (
                <Drawer
                  handlerBackButton={this.handlerBackButton}
                  handlerShutOffAllLayers={this.shutOffLayer}
                  handlerSwitchLayer={this.switchLayer}
                  handlerClickOnGraph={this.clickOnGraph}
                />
              )}
              {/* // TODO: This functionality should be implemented again
              selectedAreaType && selectedArea && (selectedAreaType.id === 'se') && (
                <NationalInsigths
                  area={selectedAreaType}
                  colors={colors}
                  geofence={selectedArea}
                  handlerBackButton={this.handlerBackButton}
                  id
                />
              ) */}
            </div>
          </div>
        </SearchContext.Provider>
      </div>
    );
  }
}

Search.propTypes = {
  selectedAreaTypeId: PropTypes.string,
  selectedAreaId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }),
  setHeaderNames: PropTypes.func.isRequired,
};

Search.defaultProps = {
  selectedAreaTypeId: null,
  selectedAreaId: null,
  history: {},
};

export default withRouter(Search);
