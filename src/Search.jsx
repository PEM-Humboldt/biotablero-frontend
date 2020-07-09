import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import L from 'leaflet';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import MapViewer from './commons/MapViewer';
import Selector from './commons/Selector';
import Drawer from './search/Drawer';
import NationalInsigths from './search/NationalInsigths';
import GeoServerAPI from './api/GeoServerAPI'; // TODO: Migrate functionalities to RestAPI
import { ConstructDataForSearch } from './commons/ConstructDataForSelector';
import { description } from './search/assets/selectorData';
import RestAPI from './api/RestAPI';
import matchColor from './commons/matchColor';
import AppContext from './AppContext';

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
      colors: ['#d49242',
        '#e9c948',
        '#b3b638',
        '#acbf3b',
        '#92ba3a',
        '#70b438',
        '#5f8f2c',
        '#667521',
        '#75680f',
        '#7b6126'],
      connError: false,
      dataError: false,
      geofencesArray: [],
      areaList: [],
      subLayerName: null,
      layers: {},
      loadingModal: false,
      selectedAreaType: null,
      selectedArea: null,
      requestSource: null,
      timelineHFArea: null,
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
   * Set in state timelineHFP area details for strategic ecosystems (SE) in the selected area
   *
   * @param {string} type data type required
   * @param {string} idSE identifier for strategic ecosystem
   */
  setTimelineHFData = (type, idSE) => {
    const { selectedAreaTypeId, selectedAreaId } = this.props;
    if (type === 'hfTimeline') {
      RestAPI.requestSEDetails(selectedAreaTypeId, selectedAreaId, idSE)
        .then((value) => {
          const res = { ...value, type: idSE };
          this.setState({
            timelineHFArea: res,
          });
        });
    } else {
      this.setState({
        timelineHFArea: null,
      });
    }
  }

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
   * Choose the right color for the section inside the map, according
   *  to matchColor function
   *
   * @param {String} type layer type
   * @param {Object} feature target object
   */
  featureStyle = type => (feature) => {
    const key = type === 'fc' ? feature.properties.compensation_factor : feature.properties.key;
    const styleReturn = {
      stroke: false,
      fillColor: matchColor(type)(key),
      fillOpacity: 0.7,
    };
    return styleReturn;
  }

  /** ******************************** */
  /** HELPERS FOR MAP LAYER PROPERTIES */
  /** ******************************** */

  findFirstId = properties => properties.IDCAR
      || properties.id_ea
      || properties.id_state
      || properties.id_subzone
      || properties.id_biome;

  findFirstName = properties => properties.IDCAR
      || properties.name
      || properties.name_subzone
      || properties.name_biome;

  findSecondId = properties => properties.id_biome;

  /** ************************ */
  /** LISTENERS FOR MAP LAYERS */
  /** ************************ */

  featureActions = (layer, parentLayer) => {
    layer.on(
      {
        mouseover: event => this.highlightFeature(event, parentLayer),
        mouseout: event => this.resetHighlight(event, parentLayer),
      },
    );
  }

  /**
   * Highlight specific feature on the map
   *
   * @param {Object} event event captured by interacting with the map
   * @param {String} parentLayer layer type
   */
  highlightFeature = (event, parentLayer) => {
    const { activeLayer, selectedAreaType, layers } = this.state;
    const point = event.target;
    const activeGeometryType = layers[activeLayer.id].type;
    const areaPopup = {
      closeButton: false,
    };
    point.setStyle({
      weight: 1,
      fillOpacity: 1,
    });
    if (selectedAreaType && (parentLayer === selectedAreaType.id)) {
      point.bindPopup(
        `<b>${this.findFirstName(point.feature.properties)}</b>
         ${point.feature.properties.NOMCAR ? `<br>${point.feature.properties.NOMCAR}` : ''}`,
        areaPopup,
      ).openPopup();
    }
    if (activeLayer && (parentLayer === activeLayer.id)) {
      switch (activeGeometryType) {
        case 'fc':
          point.bindPopup(
            `<b>Bioma:</b> ${point.feature.properties.name_biome}
              <br><b>Factor de compensación:</b> ${point.feature.properties.compensation_factor}`,
          ).openPopup();
          return;
        case 'hfTimeline':
        case 'persistenceHFP':
        case 'currentHFP':
          point.bindPopup(
            `<b>${tooltipLabel[point.feature.properties.key]}:</b>
            <br>${this.numberWithCommas(Number(point.feature.properties.value))} ha`,
          ).openPopup();
          return;
        default:
          return;
      }
    }
    if (!L.Browser.ie && !L.Browser.opera) point.bringToFront();
  }

  /**
   * Reset highlight specific feature on the map
   *
   * @param {Object} event event captured by interacting with the map
   * @param {String} parentLayer layer type
   */
  resetHighlight = (event, parentLayer) => {
    const feature = event.target;
    const { layers } = this.state;
    layers[parentLayer].layer.resetStyle(feature);
    feature.closePopup();
  }

  clickFeature = (event, parentLayer) => {
    const { selectedAreaType } = this.state;
    this.highlightFeature(event, parentLayer);
    let value = this.findFirstId(event.target.feature.properties);
    if (!value) value = this.findSecondId(event.target.feature.properties);
    const toLoad = Object.values(selectedAreaType.data).filter(
      element => element.id === value.toString(),
    )[0];
    if (value) this.innerElementChange(parentLayer, toLoad);
  }

  /**
   * Highlight sub-layer by clicking on the specific category on the graph
   *
   * @param {String} idCategory id of category selected on the map
   */
  clickOnGraph = (idCategory) => {
    const { activeLayer } = this.state;
    const { layers } = this.state;
    const selectedSubLayer = layers[activeLayer.id].layer;
    selectedSubLayer.eachLayer((layer) => {
      if (layer.feature.properties.key === idCategory) {
        layer.setStyle({
          weight: 1,
          fillOpacity: 1,
        });
        switch (idCategory) {
          case 'aTotal':
          case 'paramo':
          case 'wetland':
          case 'dryForest':
            this.setTimelineHFData('hfTimeline', tooltipLabel[idCategory]);
            break;
          default:
            break;
        }
      } else {
        selectedSubLayer.resetStyle(layer);
      }
    });
  };

  /**
   * Shut off all layers on the map
   */
  shutOffAllLayers = () => (
    this.setState((prevState) => {
      const newState = {
        ...prevState,
        loadingModal: false,
      };
      const { layers } = prevState;
      Object.keys(layers).forEach((layerKey) => {
        newState.layers[layerKey].active = false;
      });
      return newState;
    })
  );

  /**
   * Switch layer based on accordion opened tab
   *
   * @param {String} layerType layer type
   */
  switchLayer = (layerType) => {
    const { requestSource, selectedArea } = this.state;
    if (requestSource) {
      requestSource.cancel();
    }
    this.setState({
      loadingModal: true,
      activeLayer: selectedArea,
      requestSource: null,
    });

    switch (layerType) {
      case 'fc':
        return (
          RestAPI.requestBiomesbyEAGeometry(selectedArea.id)
            .then((res) => {
              if (res.features) {
                this.shutOffAllLayers();
                this.setState(prevState => ({
                  layers: {
                    ...prevState.layers,
                    [selectedArea.id]: {
                      displayName: selectedArea.name,
                      id: selectedArea.id,
                      active: true,
                      type: 'fc',
                      layer: L.geoJSON(res, {
                        style: this.featureStyle(layerType),
                        onEachFeature: (feature, selectedLayer) => (
                          this.featureActions(selectedLayer, selectedArea.id)
                        ),
                      }),
                    },
                  },
                  loadingModal: false,
                }));
              } else this.reportDataError();
            })
            .catch(() => this.reportDataError())
        );
      case 'currentHFP':
        return (
          RestAPI.requestCurrentHFGeometry()
            .then((res) => {
              if (res.features) {
                this.shutOffAllLayers();
                this.setState(prevState => ({
                  layers: {
                    ...prevState.layers,
                    [selectedArea.id]: {
                      displayName: selectedArea.name,
                      id: selectedArea.id,
                      active: true,
                      type: 'currentHFP',
                      layer: L.geoJSON(res, {
                        style: this.featureStyle(layerType),
                        onEachFeature: (feature, selectedLayer) => (
                          this.featureActions(selectedLayer, selectedArea.id)
                        ),
                      }),
                    },
                  },
                  loadingModal: false,
                }));
              } else this.reportDataError();
            })
            .catch(() => this.reportDataError())
        );
      case 'hfTimeline':
        return (
          RestAPI.requestHFTimelineGeometry()
            .then((res) => {
              if (res.features) {
                this.shutOffAllLayers();
                this.setState(prevState => ({
                  layers: {
                    ...prevState.layers,
                    [selectedArea.id]: {
                      displayName: selectedArea.name,
                      id: selectedArea.id,
                      active: true,
                      type: 'hfTimeline',
                      layer: L.geoJSON(res, {
                        style: this.featureStyle(layerType),
                        onEachFeature: (feature, selectedLayer) => (
                          this.featureActions(selectedLayer, selectedArea.id)
                        ),
                      }),
                    },
                  },
                  loadingModal: false,
                }));
              } else this.reportDataError();
            })
            .catch(() => this.reportDataError())
        );
      case 'persistenceHFP':
        return (
          RestAPI.requestHFPersistenceGeometry()
            .then((res) => {
              if (res.features) {
                this.shutOffAllLayers();
                this.setState(prevState => ({
                  layers: {
                    ...prevState.layers,
                    [selectedArea.id]: {
                      displayName: selectedArea.name,
                      id: selectedArea.id,
                      active: true,
                      type: 'persistenceHFP',
                      layer: L.geoJSON(res, {
                        style: this.featureStyle(layerType),
                        onEachFeature: (feature, selectedLayer) => (
                          this.featureActions(selectedLayer, selectedArea.id)
                        ),
                      }),
                    },
                  },
                  loadingModal: false,
                }));
              } else this.reportDataError();
            })
            .catch(() => this.reportDataError())
        );
      default:
        return this.shutOffAllLayers();
    }
  }

  /**
   * Load layer based on selection
   *
   * @param {String} idLayer Layer ID
   * @param {String} parentLayer Parent layer ID
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
      Object.values(newState.layers).forEach((item) => {
        newState.layers[item.id].active = false;
      });
      return newState;
    });

    if (layers[idLayer]) {
      if (show) {
        this.setArea(idLayer);
      }
      this.setState(prevState => ({
        layers: {
          ...prevState.layers,
          [prevState.layers[idLayer]]: {
            ...prevState.layers[idLayer],
            active: show,
          },
        },
      }));
    } else if (show && idLayer && idLayer !== 'se') {
      const { request, source } = RestAPI.requestGeofenceGeometry(idLayer);
      this.setState({ requestSource: source });
      this.setArea(idLayer);

      request.then((res) => {
        if (!res) return;
        this.setState((prevState) => {
          const newState = {
            ...prevState,
            layers: {
              ...prevState.layers,
              [idLayer]: {
                displayName: idLayer,
                active: true,
                id: idLayer,
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
              },
            },
          };
          return newState;
        });
      });
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
  }

  /** ************************************* */
  /** LISTENER FOR BUTTONS ON LATERAL PANEL */
  /** ************************************* */

  // TODO: Return from biome to the selected environmental authority
  handlerBackButton = () => {
    this.setState((prevState) => {
      const newState = { ...prevState };
      const { layers } = prevState;
      Object.keys(layers).forEach((layerKey) => {
        newState.layers[layerKey].active = false;
      });

      return {
        ...newState,
        selectedAreaType: null,
        selectedArea: null,
      };
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
      selectedAreaType,
      selectedArea,
      subLayerName,
      timelineHFArea,
      loadingModal,
      colors,
      layers,
      connError,
      dataError,
      geofencesArray,
    } = this.state;
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
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            geoServerUrl={GeoServerAPI.getRequestURL()}
          />
          <div className="mapsTitle">
            Titulo del mapa
          </div>
          <div className="contentView">
            { (!selectedAreaType || !selectedArea) && (
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
            { selectedAreaType && selectedArea && (selectedAreaType.id !== 'se') && (
              <Drawer
                area={selectedAreaType}
                timelineHFArea={timelineHFArea}
                geofence={selectedArea}
                handlerBackButton={this.handlerBackButton}
                id
                subLayerName={subLayerName}
                matchColor={matchColor}
                handlersGeometry={[
                  this.shutOffAllLayers,
                  this.switchLayer,
                  this.clickOnGraph,
                ]}
              />
            )}
            { selectedAreaType && selectedArea && (selectedAreaType.id === 'se') && (
              <NationalInsigths
                area={selectedAreaType}
                colors={colors}
                geofence={selectedArea}
                handlerBackButton={this.handlerBackButton}
                id
              />
            )}
          </div>
        </div>
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

Search.contextType = AppContext;
