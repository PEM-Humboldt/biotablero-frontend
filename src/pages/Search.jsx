import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import L from 'leaflet';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Drawer from 'pages/search/Drawer';
import SearchContext from 'pages/search/SearchContext';
import Description from 'pages/search/SelectorData';
import { constructDataForSearch } from 'utils/constructDataForSelector';
import formatNumber from 'utils/format';
import GeoServerAPI from 'utils/geoServerAPI';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import MapViewer from 'components/MapViewer';
import Selector from 'components/Selector';

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
  perdida: 'Pérdida',
  persistencia: 'Persistencia',
  ganancia: 'Ganancia',
  no_bosque: 'No bosque',
  scialta: 'Alto',
  scibaja_moderada: 'Bajo Moderado',
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLayer: {},
      connError: false,
      layerError: false,
      geofencesArray: [],
      areaList: [],
      layers: {},
      loadingLayer: false,
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

  componentDidUpdate() {
    const { history } = this.props;
    history.listen((loc, action) => {
      if (loc.search === '' && action === 'POP') {
        this.handlerBackButton();
      }
    });
  }

  componentWillUnmount() {
    const { setHeaderNames } = this.props;
    setHeaderNames(null, null);
  }

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
        newState.selectedAreaType = prevState.areaList.find((item) => item.id === idLayer);
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
        tempGeofencesArray = constructDataForSearch(tempAreaList);
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

          const inputArea = tempAreaList.find((area) => area.id === selectedAreaTypeId);
          if (inputArea && inputArea.data && inputArea.data.length > 0) {
            let field = 'id';
            if (selectedAreaTypeId === 'pa') field = 'name';
            const inputId = inputArea.data.find((area) => area[field] === selectedAreaId);
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
      layerError: true,
      loadingLayer: false,
    });
  }

  /**
   * Choose the right color for the section inside the map, according to matchColor function
   * @param {String} type layer type
   * @param {String} color optional key value to select color in match color palette
   * @param {String} fKey property name to use as key in the feature
   *
   * @param {Object} feature target object
   */
  featureStyle = (objParams) => (feature) => {
    const {
      type,
      color = null,
      fKey = 'key',
      compoundKey = false,
    } = objParams;
    if (feature.properties) {
      let key = fKey;
      if (compoundKey) {
        const keys = fKey.split('-');
        key = keys.reduce((acc, val) => `${acc}-${feature.properties[val]}`, '');
        key = key.slice(1);
      } else {
        key = type === 'fc' ? feature.properties.compensation_factor : feature.properties[fKey];
      }
      const ftype = /PAConn$/.test(type) ? 'dpc' : type;
      if (!key) {
        return {
          color: matchColor(ftype)(color),
          weight: 2,
          fillOpacity: 0,
        };
      }
      return {
        stroke: false,
        fillColor: matchColor(ftype)(key),
        fillOpacity: 0.6,
      };
    }

    return {
      stroke: false,
      fillColor: matchColor(type)(color),
      fillOpacity: 0.6,
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
        mouseover: (event) => this.highlightFeature(event, layerName),
        mouseout: (event) => this.resetHighlight(event, layerName),
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
          `<b>Bioma-IAvH:</b> ${feature.feature.properties.name_biome}
          <br><b>Factor de compensación:</b> ${feature.feature.properties.compensation_factor}`,
          optionsTooltip,
        ).openTooltip();
        break;
      case 'hfCurrent':
      case 'hfPersistence':
      case 'forestLP-2016-2019':
      case 'forestLP-2011-2015':
      case 'forestLP-2006-2010':
      case 'forestLP-2000-2005':
        feature.bindTooltip(
          `<b>${tooltipLabel[feature.feature.properties.key]}:</b>
          <br>${formatNumber(feature.feature.properties.area, 0)} ha`,
          optionsTooltip,
        ).openTooltip();
        break;
      case 'forestIntegrity':
        feature.bindTooltip(
          `SCI ${tooltipLabel[`sci${feature.feature.properties.sci_cat}`]} - HH ${tooltipLabel[feature.feature.properties.hf_pers]}`,
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
      case 'currentPAConn':
      case 'timelinePAConn':
      case 'currentSEPAConn':
        feature.bindTooltip(
          `<b>${feature.feature.properties.name}:</b>
          <br>dPC ${formatNumber(feature.feature.properties.value, 2)}
          <br>${formatNumber(feature.feature.properties.area, 0)} ha`,
          optionsTooltip,
        ).openTooltip();
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
      if (!L.Browser.ie && !L.Browser.opera) feature.bringToFront();
    }
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
   * Connects events on graphs with actions on map
   *
   * @param {String} chartType id of chart emitting the event
   * @param {String} chartSection in case chartType groups multiple charts
   * @param {String} selectedKey selected key id on the graph
   */
  clickOnGraph = ({ chartType, chartSection, selectedKey }) => {
    switch (chartType) {
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
      case 'forestLP': {
        const period = chartSection;
        const { layers } = this.state;

        const psKeys = Object.keys(layers).filter((key) => /forestLP-*/.test(key));
        psKeys.forEach((key) => this.shutOffLayer(key));

        const highlightSelectedFeature = () => {
          const { layers: updatedLayers, activeLayer: { id: activeLayer } } = this.state;

          if (!activeLayer || !layers[activeLayer]) return;

          const selectedSubLayer = updatedLayers[activeLayer].layer;
          if (selectedKey) {
            selectedSubLayer.eachLayer((layer) => {
              if (layer.feature.properties.key === selectedKey) {
                layer.setStyle({
                  weight: 1,
                  fillOpacity: 1,
                });
              } else {
                selectedSubLayer.resetStyle(layer);
              }
            });
          }
        };

        this.switchLayer(`forestLP-${period}`, highlightSelectedFeature);
      }
        break;
      case 'SciHf': {
        const sciCat = selectedKey.substring(0, selectedKey.indexOf('-'));
        const hfPers = selectedKey.substring(selectedKey.indexOf('-') + 1, selectedKey.length);
        const { layers, activeLayer: { id: activeLayer } } = this.state;

        if (!activeLayer || !layers[activeLayer]) return;

        const psKeys = Object.keys(layers).filter((key) => /SciHfPA-*/.test(key));
        psKeys.forEach((key) => this.shutOffLayer(key));
        this.switchLayer(`SciHfPA-${sciCat}-${hfPers}`);

        const selectedSubLayer = layers[activeLayer].layer;
        selectedSubLayer.eachLayer((layer) => {
          if (layer.feature.properties.sci_cat === sciCat
            && layer.feature.properties.hf_pers === hfPers
          ) {
            layer.setStyle({
              weight: 1,
              fillOpacity: 1,
            });
          } else {
            selectedSubLayer.resetStyle(layer);
          }
        });
      }
        break;
      case 'paramoPAConn':
        this.shutOffLayer('wetlandPAConn');
        this.shutOffLayer('dryForestPAConn');
        this.switchLayer('paramoPAConn');
        break;
      case 'wetlandPAConn':
        this.shutOffLayer('paramoPAConn');
        this.shutOffLayer('dryForestPAConn');
        this.switchLayer('wetlandPAConn');
        break;
      case 'dryForestPAConn':
        this.shutOffLayer('wetlandPAConn');
        this.shutOffLayer('paramoPAConn');
        this.switchLayer('dryForestPAConn');
        break;
      default: {
        const { layers, activeLayer: { id: activeLayer } } = this.state;

        if (!activeLayer || !layers[activeLayer]) return;

        const selectedSubLayer = layers[activeLayer].layer;
        selectedSubLayer.eachLayer((layer) => {
          if (layer.feature.properties.key || layer.feature.properties.id === selectedKey) {
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
  switchLayer = (layerType, callback = () => {}) => {
    const {
      selectedAreaId,
      selectedAreaTypeId,
    } = this.props;
    const {
      requestSource,
      layers,
    } = this.state;
    if (requestSource) {
      requestSource.cancel();
    }
    this.setState({
      loadingLayer: true,
      layerError: false,
      requestSource: null,
    });

    let request = null;
    let shutOtherLayers = true;
    let layerStyle = this.featureStyle({ type: layerType });
    let fitBounds = true;
    let newActiveLayer = null;
    let layerKey = layerType;

    switch (layerType) {
      case 'fc':
        request = () => RestAPI.requestBiomesbyEAGeometry(selectedAreaId);
        newActiveLayer = {
          id: layerType,
          name: 'FC - Biomas',
        };
        break;
      case 'hfCurrent':
        request = () => RestAPI.requestCurrentHFGeometry(
          selectedAreaTypeId, selectedAreaId,
        );
        newActiveLayer = {
          id: layerType,
          name: 'HH promedio · 2018',
        };
        break;
      case 'paramo':
      case 'dryForest':
      case 'wetland':
        request = () => RestAPI.requestHFGeometryBySEInGeofence(
          selectedAreaTypeId, selectedAreaId, layerType,
        );
        shutOtherLayers = false;
        layerStyle = this.featureStyle({ type: layerType, color: layerType });
        fitBounds = false;
        break;
      case 'hfTimeline':
        request = () => RestAPI.requestHFPersistenceGeometry(
          selectedAreaTypeId, selectedAreaId,
        );
        layerStyle = this.featureStyle({ type: 'hfPersistence' });
        layerKey = 'hfPersistence';
        newActiveLayer = {
          id: 'hfPersistence',
          name: 'HH - Histórico y Ecosistemas estratégicos (EE)',
        };
        break;
      case 'hfPersistence':
        request = () => RestAPI.requestHFPersistenceGeometry(
          selectedAreaTypeId, selectedAreaId,
        );
        newActiveLayer = {
          id: layerType,
          name: 'HH - Persistencia',
        };
        break;
      case 'geofence':
        request = () => RestAPI.requestGeofenceGeometryByArea(
          selectedAreaTypeId,
          selectedAreaId,
        );
        newActiveLayer = {
          id: 'geofence',
        };
        break;
      case 'forestIntegrity':
        this.switchLayer('geofence', () => {
          this.setState({
            loadingLayer: true,
            layerError: false,
            requestSource: null,
          });

          request = () => RestAPI.requestSCIHFGeometry(
            selectedAreaTypeId, selectedAreaId,
          );
          shutOtherLayers = false;
          layerStyle = this.featureStyle({ type: 'SciHf', fKey: 'sci_cat-hf_pers', compoundKey: true });
          newActiveLayer = {
            id: layerType,
            name: 'Índice de condición estructural de bosques',
          };
        });
        break;
      case 'currentPAConn':
        this.switchLayer('geofence', () => {
          this.setState({
            loadingLayer: true,
            layerError: false,
            requestSource: null,
          });
          request = () => RestAPI.requestDPCLayer(
            selectedAreaTypeId,
            selectedAreaId,
            5,
          );
          shutOtherLayers = false;
          layerStyle = this.featureStyle({ type: layerType, fKey: 'dpc_cat' });
          newActiveLayer = {
            id: layerType,
            name: 'Conectividad actual de áreas protegidas',
          };
        });
        break;
      case 'timelinePAConn':
        this.switchLayer('geofence', () => {
          this.setState({
            loadingLayer: true,
            layerError: false,
            requestSource: null,
          });
          request = () => RestAPI.requestDPCLayer(
            selectedAreaTypeId,
            selectedAreaId,
          );
          shutOtherLayers = false;
          layerStyle = this.featureStyle({ type: 'currentPAConn', fKey: 'dpc_cat' });
          newActiveLayer = {
            id: layerType,
            name: 'Histórico de conectividad áreas protegidas',
          };
        });
        break;
      case 'currentSEPAConn':
        this.switchLayer('geofence', () => {
          this.setState({
            loadingLayer: true,
            layerError: false,
            requestSource: null,
          });
          request = () => RestAPI.requestDPCLayer(
            selectedAreaTypeId,
            selectedAreaId,
          );
          shutOtherLayers = false;
          layerStyle = this.featureStyle({ type: 'currentSEPAConn', fKey: 'dpc_cat' });
          newActiveLayer = {
            id: layerType,
            name: 'Conectividad actual de áreas protegidas por ecosistemas estratégicos',
          };
        });
        break;
      case 'paramoPAConn':
        request = () => RestAPI.requestPAConnSELayer(
          selectedAreaTypeId, selectedAreaId, layerType,
        );
        shutOtherLayers = false;
        layerStyle = this.featureStyle({ type: layerType, color: 'sePAConn' });
        fitBounds = false;
        newActiveLayer = {
          id: 'paramoPAConn',
          name: 'Conectividad actual de áreas protegidas - Páramo',
        };
        break;
      case 'dryForestPAConn':
        request = () => RestAPI.requestPAConnSELayer(
          selectedAreaTypeId, selectedAreaId, layerType,
        );
        shutOtherLayers = false;
        layerStyle = this.featureStyle({ type: layerType, color: 'sePAConn' });
        fitBounds = false;
        newActiveLayer = {
          id: 'dryForestPAConn',
          name: 'Conectividad actual de áreas protegidas - Bosque Seco Tropical',
        };
        break;
      case 'wetlandPAConn':
        request = () => RestAPI.requestPAConnSELayer(
          selectedAreaTypeId, selectedAreaId, layerType,
        );
        shutOtherLayers = false;
        layerStyle = this.featureStyle({ type: layerType, color: 'sePAConn' });
        fitBounds = false;
        newActiveLayer = {
          id: 'wetlandPAConn',
          name: 'Conectividad actual de áreas protegidas - Humedales',
        };
        break;
      default:
        if (/SciHfPA-*/.test(layerType)) {
          const [, sci, hf] = layerType.match(/SciHfPA-(\w+)-(\w+)/);
          request = () => RestAPI.requestSCIHFPAGeometry(
            selectedAreaTypeId, selectedAreaId, sci, hf,
          );
          shutOtherLayers = false;
          layerStyle = this.featureStyle({ type: 'border' });
          fitBounds = false;
        } else if (/forestLP-*/.test(layerType)) {
          const [, yearIni, yearEnd] = layerType.match(/forestLP-(\w+)-(\w+)/);
          request = () => RestAPI.requestEcoChangeLPGeometry(
            selectedAreaTypeId, selectedAreaId, `${yearIni}-${yearEnd}`,
          );
          layerStyle = this.featureStyle({ type: 'forestLP' });
          newActiveLayer = {
            id: layerType,
            name: `Pérdida y persistencia de bosque (${yearIni}-${yearEnd})`,
          };
        }
        break;
    }

    if (request) {
      if (shutOtherLayers) this.shutOffLayer();
      if (layers[layerKey]) {
        this.setState((prevState) => {
          const newState = prevState;
          newState.loadingLayer = false;
          if (newActiveLayer) {
            newState.activeLayer = newActiveLayer;
          }
          newState.layers[layerKey].active = true;
          return newState;
        });
        callback();
      } else {
        const { request: apiRequest, source: apiSource } = request();
        this.setState({ requestSource: apiSource });
        apiRequest.then((res) => {
          if (res.features) {
            if (res.features.length === 1 && !res.features[0].geometry) {
              this.reportDataError();
              return;
            }
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
              newState.loadingLayer = false;
              if (newActiveLayer) newState.activeLayer = newActiveLayer;

              return newState;
            });
            callback();
          } else if (res !== 'request canceled') {
            this.reportDataError();
          }
        }).catch(() => this.reportDataError());
      }
    } else {
      this.shutOffLayer();
      this.setState({ loadingLayer: false });
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
          if (!res || res === 'request canceled') return;
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
    const { requestSource } = this.state;
    if (requestSource) {
      requestSource.cancel();
    }
    this.setState({
      requestSource: null,
    });
    let unsetLayers = [
      'fc',
      'hfCurrent',
      'hfPersistence',
      'paramo',
      'dryForest',
      'wetland',
      'geofence',
      'forestIntegrity',
      'currentPAConn',
      'timelinePAConn',
      'currentSEPAConn',
      'paramoPAConn',
      'dryForestPAConn',
      'wetlandPAConn',
    ];
    this.setState((prevState) => {
      const newState = { ...prevState };

      const psKeys = Object.keys(newState.layers).filter((key) => /SciHfPA-*/.test(key));
      unsetLayers = unsetLayers.concat(psKeys);

      unsetLayers.forEach((layer) => {
        if (newState.layers[layer]) delete newState.layers[layer];
      });
      newState.selectedAreaType = null;
      newState.selectedArea = null;
      newState.activeLayer = {};
      newState.loadingLayer = false;
      newState.layerError = false;
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
  handleCloseModal = (state) => () => {
    this.setState({ [state]: false });
  };

  render() {
    const {
      loadingLayer,
      layers,
      connError,
      layerError,
      geofencesArray,
      activeLayer: { name: activeLayer },
    } = this.state;

    const {
      selectedAreaTypeId,
      selectedAreaId,
    } = this.props;

    return (
      <>
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
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        </Modal>
        <SearchContext.Provider
          value={{
            areaId: selectedAreaTypeId,
            geofenceId: selectedAreaId,
            handlerClickOnGraph: this.clickOnGraph,
          }}
        >
          <div className="appSearcher wrappergrid">
            <MapViewer
              layers={layers}
              geoServerUrl={GeoServerAPI.getRequestURL()}
              loadingLayer={loadingLayer}
              layerError={layerError}
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
                  description={Description()}
                  data={geofencesArray}
                  expandedId={0}
                  iconClass="iconsection"
                />
              )}
              { selectedAreaTypeId && selectedAreaId && (selectedAreaTypeId !== 'se') && (
                <Drawer
                  handlerBackButton={this.handlerBackButton}
                  handlerSwitchLayer={this.switchLayer}
                />
              )}
            </div>
          </div>
        </SearchContext.Provider>
      </>
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
    listen: PropTypes.func,
  }),
  setHeaderNames: PropTypes.func.isRequired,
};

Search.defaultProps = {
  selectedAreaTypeId: null,
  selectedAreaId: null,
  history: {
    listen: () => {},
  },
};

export default withRouter(Search);
