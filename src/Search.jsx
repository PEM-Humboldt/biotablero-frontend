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

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLayer: null,
      subLayerData: null,
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
      colorSZH: ['#345b6b'],
      connError: false,
      dataError: false,
      geofencesArray: [],
      areaList: [],
      subLayerName: null,
      layers: {},
      loadingModal: false,
      areaType: null,
      areaId: null,
      requestSource: null,
      hFPSelection: null,
    };
  }

  componentDidMount() {
    const { areaTypeId, areaIdId, history } = this.props;
    const { hFPSelection } = this.state;
    if (!hFPSelection) {
      this.setState(prevState => ({
        ...prevState,
        hFPSelection: 'aTotal',
      }));
    }
    if (!areaTypeId || !areaIdId) {
      history.replace(history.location.pathname);
    }
    this.loadAreaList();
  }

  /**
   * Set area state to control transitions
   *
   * @param {Object} idLayer value to set
   */
  setArea = (idLayer) => {
    const { areaType } = this.state;
    if (!areaType || (areaType && areaType.id !== idLayer)) {
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.areaType = prevState.areaList.find(item => item.id === idLayer);
        newState.areaId = null;
        return newState;
      });
    }
  };

  loadAreaList = () => {
    /**
     * Recover all geofences by default available in the
     * database for the Search Module and sort them
     */
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
            areaTypeId,
            areaIdId,
            history,
            setHeaderNames,
          } = this.props;
          if (!areaTypeId || !areaIdId) return;

          const inputArea = tempAreaList.find(area => area.id === areaTypeId);
          if (inputArea && inputArea.data && inputArea.data.length > 0) {
            let field = 'id';
            if (areaTypeId === 'pa') field = 'name';
            const inputId = inputArea.data.find(area => area[field] === areaIdId);
            if (inputId) {
              this.setArea(areaTypeId);
              this.setState(
                { areaId: inputId },
                () => {
                  const { areaType, areaId, activeLayer } = this.state;
                  setHeaderNames(areaType.name, areaId.name);
                  // TODO remove areaType validation when implemented better control over layers
                  if (!activeLayer && areaType.id === 'ea') this.loadLayer(areaId);
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
   * Choose the right color for the biome inside the map, according
   *  with matchColor function
   *
   * @param {Object} feature target object
   */
  featureStyle = (feature) => {
    const styleReturn = {
      stroke: false,
      fillColor: matchColor('fc')(feature.properties.compensation_factor),
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

  featureActions = (feature, layer, parentLayer) => {
    layer.on(
      {
        mouseover: event => this.highlightFeature(event, parentLayer),
        mouseout: event => this.resetHighlight(event, parentLayer),
        click: event => this.clickFeature(event, parentLayer),
      },
    );
  }

  highlightFeature = (event, parentLayer) => {
    const { activeLayer, areaType } = this.state;
    const point = event.target;
    const areaPopup = {
      closeButton: false,
    };
    point.setStyle({
      weight: 1,
      fillOpacity: 1,
    });
    if (areaType && (parentLayer === areaType.id)) {
      point.bindPopup(
        `<b>${this.findFirstName(point.feature.properties)}</b>
         ${point.feature.properties.NOMCAR ? `<br>${point.feature.properties.NOMCAR}` : ''}`,
        areaPopup,
      ).openPopup();
    }
    if (activeLayer && (parentLayer === activeLayer.id)) {
      point.bindPopup(
        `<b>Bioma:</b> ${point.feature.properties.name_biome}
         <br><b>Factor de compensación:</b> ${point.feature.properties.compensation_factor}`,
      ).openPopup();
    }
    if (!L.Browser.ie && !L.Browser.opera) point.bringToFront();
  }

  resetHighlight = (event, parentLayer) => {
    const feature = event.target;
    const { areaType, layers } = this.state;
    layers[parentLayer].layer.resetStyle(feature);
    if (areaType && (parentLayer === areaType.id)) {
      feature.closePopup();
    }
  }

  clickFeature = (event, parentLayer) => {
    const { areaType } = this.state;
    this.highlightFeature(event, parentLayer);
    let value = this.findFirstId(event.target.feature.properties);
    if (!value) value = this.findSecondId(event.target.feature.properties);
    const toLoad = Object.values(areaType.data).filter(
      element => element.id === value.toString(),
    )[0];
    if (value) this.innerElementChange(parentLayer, toLoad);
  }

  /**
   * Load layer based on selection
   *
   * @param {String} idLayer Layer ID
   * @param {String} parentLayer Parent layer ID
   */
  loadLayer = (layer, parentLayer) => {
    const { requestSource } = this.state;
    if (requestSource) {
      requestSource.cancel();
    }
    this.setState({
      loadingModal: true,
      activeLayer: layer,
      requestSource: null,
    });
    RestAPI.requestBiomesbyEAGeometry(layer.id)
      .then((res) => {
        if (res.features) {
          this.setState(prevState => ({
            layers: {
              ...prevState.layers,
              [layer.id]: {
                displayName: layer.name,
                id: layer.id || layer.id_ea,
                active: true,
                layer: L.geoJSON(res, {
                  style: this.featureStyle,
                  onEachFeature: (feature, selectedLayer) => (
                    this.featureActions(feature, selectedLayer, layer.id)
                  ),
                }),
              },
            },
          }));
        } else this.reportDataError();
      })
      .catch(() => this.reportDataError())
      .finally(() => {
        this.setState((prevState) => {
          const newState = {
            ...prevState,
            loadingModal: false,
          };
          if (prevState.layers[parentLayer]) newState.layers[parentLayer].active = false;
          if (prevState.layers[layer.id]) {
            newState.layers[layer.id].active = true;
          }
          return newState;
        });
      });
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
                      this.featureActions(feature, layer, idLayer)
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
        { areaId: nameToOn },
        () => {
          const { history } = this.props;
          const { areaType, areaId } = this.state;
          history.push(`?area_type=${areaType.id}&area_id=${areaId.id || areaId.name}`);
          setHeaderNames(areaType.name, areaId.name);
        },
      );
      this.loadLayer(nameToOn, nameToOff);
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
        areaType: null,
        areaId: null,
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
      areaType,
      areaId,
      subLayerName,
      subLayerData,
      loadingModal,
      colors,
      colorSZH,
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
            { (!areaType || !areaId) && (
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
            { areaType && areaId && (areaType.id !== 'se') && (
              <Drawer
                area={areaType}
                colorSZH={colorSZH}
                subLayerData={subLayerData}
                geofence={areaId}
                handlerBackButton={this.handlerBackButton}
                id
                subLayerName={subLayerName}
                matchColor={matchColor}
                setHFPSelection={(text) => {
                  this.setState(prevState => ({
                    ...prevState,
                    hFPSelection: text,
                  }));
                }}
              />
            )}
            { areaType && areaId && (areaType.id === 'se') && (
              <NationalInsigths
                area={areaType}
                colors={colors}
                geofence={areaId}
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
  areaTypeId: PropTypes.string,
  areaIdId: PropTypes.string,
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
  areaTypeId: null,
  areaIdId: null,
  history: {},
};

export default withRouter(Search);

Search.contextType = AppContext;
