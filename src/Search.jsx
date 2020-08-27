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
      activeLayer: {},
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
    const feature = event.target;
    let changeStyle = true;
    const optionsTooltip = { sticky: true };
    switch (layerName) {
      case 'fc':
        feature.bindTooltip(
          `<b>Bioma:</b> ${feature.feature.properties.name_biome}
          <br><b>Factor de compensación:</b> ${feature.feature.properties.compensation_factor}`,
          optionsTooltip,
        ).openTooltip();
        break;
      case 'hfCurrent':
      case 'hfPersistence':
        feature.bindTooltip(
          `<b>${tooltipLabel[feature.feature.properties.key]}:</b>
          <br>${this.numberWithCommas(Number(feature.feature.properties.area).toFixed(0))} ha`,
          optionsTooltip,
        ).openTooltip();
        break;
      case 'states':
      case 'ea':
        feature.bindTooltip(feature.feature.properties.name, optionsTooltip).openTooltip();
        break;
      case 'basinSubzones':
        feature.bindTooltip(feature.feature.properties.name_subzone, optionsTooltip).openTooltip();
        break;
      default:
        changeStyle = false;
        break;
    }
    if (changeStyle) {
      feature.setStyle({
        weight: 1,
        fillOpacity: 1,
      });
    }
    if (!L.Browser.ie && !L.Browser.opera) feature.bringToFront();
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
        this.shutOffLayer('wetland');
        this.shutOffLayer('dryForest');
        this.switchLayer('paramo');
        break;
      case 'wetland':
        this.shutOffLayer('paramo');
        this.shutOffLayer('dryForest');
        this.switchLayer('wetland');
        break;
      case 'dryForest':
        this.shutOffLayer('wetland');
        this.shutOffLayer('paramo');
        this.switchLayer('dryForest');
        break;
      case 'aTotal':
        this.shutOffLayer('paramo');
        this.shutOffLayer('wetland');
        this.shutOffLayer('dryForest');
        break;
      default: {
        const { layers, activeLayer: { id: activeLayer } } = this.state;
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
        newState.activeLayer = {};
        return newState;
      });
    } else if (layerInState) {
      this.setState((prevState) => {
        const newState = {
          ...prevState,
        };
        newState.layers[layer].active = false;
        if (prevState.activeLayer.id === layer) newState.activeLayer = {};
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
      selectedAreaId,
      selectedAreaTypeId,
    } = this.props;
    const {
      requestSource,
      selectedArea,
      selectedAreaType,
      layers,
    } = this.state;
    if (requestSource) {
      requestSource.cancel();
    }
    this.setState({
      loadingModal: true,
      requestSource: null,
    });

    let request = null;
    let shutOtherLayers = true;
    let layerStyle = this.featureStyle(layerType);
    let fitBounds = true;
    let newActiveLayer = null;
    let layerKey = layerType;

    switch (layerType) {
      case 'fc':
        request = () => RestAPI.requestBiomesbyEAGeometry(selectedArea.id);
        newActiveLayer = {
          id: layerType,
          name: 'FC - Biomas',
        };
        break;
      case 'hfCurrent':
        request = () => RestAPI.requestCurrentHFGeometry(
          selectedAreaType.id, selectedArea.id || selectedArea.name,
        );
        newActiveLayer = {
          id: layerType,
          name: 'HH - Actual',
        };
        break;
      case 'paramo':
      case 'dryForest':
      case 'wetland':
        request = () => RestAPI.requestHFGeometryBySEInGeofence(
          selectedAreaType.id, selectedArea.id || selectedArea.name, layerType,
        );
        shutOtherLayers = false;
        layerStyle = this.featureStyle('border', 'white');
        fitBounds = false;
        break;
      case 'hfTimeline':
        request = () => RestAPI.requestHFPersistenceGeometry(
          selectedAreaType.id, selectedArea.id || selectedArea.name,
        );
        layerStyle = this.featureStyle('hfPersistence');
        layerKey = 'hfPersistence';
        newActiveLayer = {
          id: 'hfPersistence',
          name: 'HH - Histórico y Ecosistemas estratégicos (EE)',
        };
        break;
      case 'hfPersistence':
        request = () => RestAPI.requestHFPersistenceGeometry(
          selectedAreaType.id, selectedArea.id || selectedArea.name,
        );
        newActiveLayer = {
          id: layerType,
          name: 'HH - Persistencia',
        };
        break;
      default:
        request = () => RestAPI.requestGeofenceGeometryByArea(
          selectedAreaTypeId,
          selectedAreaId,
        );
        newActiveLayer = {
          id: selectedAreaId,
        };
        break;
    }

    if (request) {
      if (shutOtherLayers) this.shutOffLayer();
      if (layers[layerKey]) {
        this.setState((prevState) => {
          const newState = prevState;
          newState.loadingModal = false;
          if (newActiveLayer) {
            newState.activeLayer = newActiveLayer;
          }
          newState.layers[layerKey].active = true;
          return newState;
        });
      } else {
        request().then((res) => {
          if (res.features) {
            this.setState((prevState) => {
              const newState = prevState;
              newState.layers[layerKey] = {
                active: true,
                layer: L.geoJSON(res, {
                  style: layerStyle,
                  onEachFeature: (feature, selectedLayer) => (
                    this.featureActions(selectedLayer, layerKey)
                  ),
                  fitBounds,
                }),
              };
              newState.loadingModal = false;
              if (newActiveLayer) newState.activeLayer = newActiveLayer;
              return newState;
            });
          } else this.reportDataError();
        }).catch(() => this.reportDataError());
      }
    } else {
      this.shutOffLayer();
      this.setState({ loadingModal: false });
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
    const unsetLayers = ['fc', 'hfCurrent', 'hfPersistence', 'paramo', 'dryForest', 'wetland'];
    this.setState((prevState) => {
      const newState = { ...prevState };
      unsetLayers.forEach((layer) => {
        if (newState.layers[layer]) delete newState.layers[layer];
      });
      newState.selectedAreaType = null;
      newState.selectedArea = null;
      newState.activeLayer = {};
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
      activeLayer: { name: activeLayer },
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
            handlerClickOnGraph: this.clickOnGraph,
          }}
        >
          <div className="appSearcher">
            <MapViewer
              layers={layers}
              geoServerUrl={GeoServerAPI.getRequestURL()}
            />
            {activeLayer && (
              <div className="mapsTitle">
                {activeLayer}
              </div>
            )}
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
