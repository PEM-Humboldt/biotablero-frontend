import { withRouter } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import L from 'leaflet';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Drawer from 'pages/search/Drawer';
import SearchContext from 'pages/search/SearchContext';
import Selector from 'pages/search/Selector';
import Description from 'pages/search/SelectorData';
import formatNumber from 'utils/format';
import GeoServerAPI from 'utils/geoServerAPI';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import GradientLegend from 'components/GradientLegend';
import MapViewer from 'pages/search/MapViewer';

import { SELabel } from 'pages/search/utils/appropriate_labels';

class Search extends Component {
  constructor(props) {
    super(props);
    this.activeRequests = new Map();
    this.mapBounds = null;
    this.geofenceBounds = null;
    this.state = {
      activeLayer: {},
      connError: false,
      layerError: false,
      areaList: [],
      layers: {},
      loadingLayer: false,
      selectedAreaType: null,
      selectedArea: null,
      localPolygon: {},
      drawPolygonEnabled: false,
      mapBounds: null,
      rasterUrls: [],
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
    history.listen((location, action) => {
      if (location.search === '' && (action === 'PUSH' || action === 'POP')) {
        this.handlerBackButton();
      }
    });
  }

  componentWillUnmount() {
    const { setHeaderNames } = this.props;
    setHeaderNames(null, null);
  }

  /**
   * Send the cancel signal to all active requests and remove them from the map
   */
  cancelActiveRequests = () => {
    this.activeRequests.forEach((value, key) => {
      value.cancel();
      this.activeRequests.delete(key);
    });
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
    Promise.all([
      RestAPI.getAllStates(),
      RestAPI.getAllEAs(),
      RestAPI.getAllSubzones(),
      RestAPI.getAllSEs(),
    ])
      .then(([states, ea, basinSubzones, se]) => {
        tempAreaList = [
          { name: 'Departamentos', data: states, id: 'states' },
          { name: 'Jurisdicciones ambientales', data: ea, id: 'ea' },
          { name: 'Subzonas hidrográficas', data: basinSubzones, id: 'basinSubzones' },
          { name: 'Ecosistemas estratégicos', data: se, id: 'se' },
        ];
        this.setState({
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
            const field = 'id';
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
   *
   * @param {Object} feature target object
   */
  featureStyle = (objParams) => (feature) => {
    const {
      type,
      color = null,
    } = objParams;
    if (feature.properties) {
      let key = null;
      let ftype = type;

      if (type === 'forestIntegrity') {
        const keys = 'sci_cat-hf_pers'.split('-');
        key = keys.reduce((acc, val) => `${acc}-${feature.properties[val]}`, '');
        key = key.slice(1);
        ftype = 'SciHf';
      } else if (/PAConn$/.test(type)) {
        key = feature.properties.dpc_cat;
        ftype = 'dpc';
      } else if (type === 'fc') {
        key = feature.properties.compensation_factor;
      } else {
        key = feature.properties.key;
      }

      if (!key) {
        return {
          color: matchColor(ftype)(color),
          weight: 1,
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
        mouseover: (event) => this.highlightShapeFeature(event, layerName),
        mouseout: (event) => this.resetShapeHighlight(event, layerName),
      },
    );
  }

  /**
   * Highlight specific feature on the map
   *
   * @param {Object} event event captured by interacting with the map
   * @param {String} layerName Layer name the event belongs to
   */
  highlightShapeFeature = (event, layerName) => {
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
  resetShapeHighlight = (event, layerName) => {
    const { target } = event;
    switch (layerName) {
      case 'paramo':
      case 'dryForest':
      case 'wetland':
        target.setStyle(this.featureStyle({ type: layerName, color: layerName })(target.feature));
        break;
      default:
        target.setStyle(this.featureStyle({ type: layerName })(target.feature));
        break;
    }
    target.closePopup();
  }

  /**
   * Highlight specific raster on the map
   *
   * @param {String} layerId Raster layer id
   */
  highlightRaster = (layerId) => {
    this.resetRasterHighlight();
    this.setState((prevState) => {
      const newState = {
        ...prevState,
      };
      const selectedLayer = newState.rasterUrls.find((ras) => ras.id === layerId);
      if (selectedLayer) {
        selectedLayer.opacity = 1;
      }
      return newState;
    });
  }

  /**
   * Reset highlight of all rasters on the map
   */
  resetRasterHighlight = () => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,
      };
      newState.rasterUrls = prevState.rasterUrls.map((ras) => ({
        ...ras,
        opacity: newState.activeLayer.defaultOpacity,
      }));
      return newState;
    });
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
      case 'coverage':
        this.highlightRaster(`${chartType}-${selectedKey}`);
        break;
      case 'seCoverage':
        this.highlightRaster(`${chartType}-${chartSection}-${selectedKey}`);
        break;
      case 'hfTimeline':
        this.setSectionLayers(`hfTimeline-${selectedKey}`);
        break;
      case 'numberOfSpecies': {
        const { activeLayer: { id: activeLayer } } = this.state;
        if (chartSection !== 'inferred') {
          this.setSectionLayers('geofence');
        } else if (activeLayer !== `numberOfSpecies-${selectedKey}`) {
          this.setSectionLayers(`numberOfSpecies-${selectedKey}`);
        }
      }
        break;
      // Current progress of the refactor
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

        this.setState((prev) => {
          const newState = prev;
          newState.layers[activeLayer].layerStyle = (feature) => {
            if (feature.properties.key === selectedKey
              || feature.properties.id === selectedKey) {
                return {
                  weight: 1,
                  fillOpacity: 1,
                };
              }
            return this.featureStyle({ type: activeLayer })(feature);
          };
          return newState;
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
        newState.rasterUrls = [];
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
   * Returns a shape layer from the state. When the layer is not present in the state it's requested
   * to the backend and stored in the state.
   *
   * @param {String} layerName name of the layer
   * @param {Object} options options object with the following availabel keys
   * @param {Boolean} options.isActive wheter to activate this layer. Ignored if showInBackground
   *  is true.
   * @param {String} options.fitBounds if the map bounds should fit the layer loaded
   * @param {Number} options.paneLevel pane level for the layer to be added to
   *
   * @returns {Object} Data of the layer with its id
   */
  getShapeLayer = async (layerName, options) => {
    const {
      isActive = true,
      fitBounds = true,
      paneLevel = 1,
    } = options;
    const { selectedAreaId, selectedAreaTypeId } = this.props;
    const { layers } = this.state;
    let reqPromise = null;
    let layerStyle = this.featureStyle({ type: layerName });

    switch (layerName) {
      case 'geofence':
        reqPromise = () => RestAPI.requestGeofenceGeometryByArea(
          selectedAreaTypeId,
          selectedAreaId,
        );
        break;
      case 'hfCurrent':
        reqPromise = () => RestAPI.requestCurrentHFGeometry(
          selectedAreaTypeId, selectedAreaId,
        );
        break;
      case 'hfPersistence':
        reqPromise = () => RestAPI.requestHFPersistenceGeometry(
          selectedAreaTypeId, selectedAreaId,
        );
        break;
      case 'paramo':
      case 'dryForest':
      case 'wetland': {
        reqPromise = () => RestAPI.requestHFGeometryBySEInGeofence(
          selectedAreaTypeId, selectedAreaId, layerName,
        );
        layerStyle = this.featureStyle({ type: layerName, color: layerName });
        break;
      }
      default:
        break;
    }

    if (!reqPromise) return null;
    if (layers[layerName]) {
      if (layerName === 'geofence') {
        this.geofenceBounds = L.geoJSON(layers[layerName].json).getBounds();
        this.mapBounds = L.geoJSON(layers[layerName].json).getBounds();
      } else if (fitBounds && isActive) {
        this.mapBounds = L.geoJSON(layers[layerName].json).getBounds();
      }
      this.setState((prevState) => {
        const newState = prevState;
        newState.layers[layerName].layerStyle = layerStyle;
        newState.layers[layerName].active = isActive;
        newState.layers[layerName].fitBounds = fitBounds;
        newState.layers[layerName].paneLevel = paneLevel;
        return newState;
      });
      return layers[layerName];
    }

    const { request, source } = reqPromise();
    this.activeRequests.set(layerName, source);
    try {
      const res = await request;
      this.activeRequests.delete(layerName);
      if (res.features) {
        if (res.features.length === 1 && !res.features[0].geometry) {
          return null;
        }
        if (layerName === 'geofence') {
          this.geofenceBounds = L.geoJSON(res).getBounds();
          this.mapBounds = L.geoJSON(res).getBounds();
        } else if (fitBounds && isActive) {
          this.mapBounds = L.geoJSON(res).getBounds();
        }
        const layerObj = {
          layerStyle,
          onEachFeature: (feature, selectedLayer) => (
            this.featureActions(selectedLayer, layerName)
          ),
          active: isActive,
          json: res,
          paneLevel,
          id: layerName,
        };
        this.setState((prevState) => {
          const newState = prevState;
          newState.layers[layerName] = layerObj;
          return newState;
        });
        return layerObj;
      }
      if (res === 'request canceled') {
        return 'canceled';
      }
      return null;
    } catch {
      this.activeRequests.delete(layerName);
      this.reportDataError();
      return null;
    }
  }

  /**
   * Request a raster layer from the backend
   * @param {String} layerName name of the layer to request
   *
   * @returns {Object} Data of the layer with its id
   */
  getRasterLayer = async (layerName) => {
    const { selectedAreaId, selectedAreaTypeId } = this.props;
    let reqPromise = null;

    if (/coverage-*/.test(layerName)) {
      let type = 'N';
      const selected = layerName.match(/coverage-(\w+)/);
      if (selected) [, type] = selected;

      reqPromise = () => RestAPI.requestCoveragesLayer(
        selectedAreaTypeId,
        selectedAreaId,
        type,
      );
    } else if (/seCoverage-*/.test(layerName)) {
      const [, seType, coverageType] = layerName.match(/seCoverage-(\w+)-(\w+)/);
      reqPromise = () => RestAPI.requestCoveragesSELayer(
        selectedAreaTypeId,
        selectedAreaId,
        coverageType,
        SELabel(seType),
      );
    } else if (/numberOfSpecies-*/.test(layerName)) {
      let group = 'total';
      const selected = layerName.match(/numberOfSpecies-(\w+)/);
      if (selected) [, group] = selected;

      reqPromise = () => RestAPI.requestNOSLayer(
        selectedAreaTypeId,
        selectedAreaId,
        group,
      );
    } else if (layerName === 'speciesRecordsGaps') {
      reqPromise = () => RestAPI.requestGapsLayer(
        selectedAreaTypeId,
        selectedAreaId,
      );
    }

    if (!reqPromise) {
      return null;
    }

    // TODO Add logic to check is the layer exists in the current state to avoid a new request

    const { request, source } = reqPromise();
    this.activeRequests.set(layerName, source);

    try {
      const res = await request;
      this.activeRequests.delete(layerName);
      if (res === 'request canceled') {
        return 'canceled';
      }
      return {
        id: layerName,
        data: `data:${res.headers['content-type']};base64, ${Buffer.from(res.data, 'binary').toString('base64')}`,
      };
    } catch (error) {
      this.activeRequests.delete(layerName);
      if (error !== 404) {
        this.reportDataError();
      }
      return null;
    }
  }

  /**
   * Config the desired and required layers to show in the map for the given section
   * @param {String} sectionName section to identify desired layers
   */
  setSectionLayers = (sectionName) => {
    const { selectedAreaId, selectedAreaTypeId } = this.props;
    this.setState({ loadingLayer: true, layerError: false });
    this.shutOffLayer();

    let shapeLayerOpts = [];
    let rasterLayerOpts = [];
    const newActiveLayer = { id: sectionName, defaultOpacity: 1 };
    let mapLegend = null;

    /**
     * WIP
     * I think we could handle 2 groups: shapeLayers and rasterLayers
     * shapeLayers: shape layers that will be displayed
     * rasterLayers: raster layers that will be displayed
     *
     * Things I haven't thought of:
     * - new layers without modifying existing ones like protected areas in forest integrity
     */

    if (sectionName === 'geofence') {
      shapeLayerOpts = [{ id: 'geofence', paneLevel: 1 }];
    } else if (sectionName === 'coverages') {
      rasterLayerOpts = [
        { id: 'coverage-N', paneLevel: 1 },
        { id: 'coverage-S', paneLevel: 1 },
        { id: 'coverage-T', paneLevel: 1 },
      ];
      newActiveLayer.name = 'Coberturas';
      newActiveLayer.defaultOpacity = 0.7;
    } else if (/seCoverages*/.test(sectionName)) {
      let seType = 'paramo';
      const selected = sectionName.match(/seCoverages-(\w+)/);
      if (selected) [, seType] = selected;
      shapeLayerOpts = [{ id: 'geofence', paneLevel: 1 }];
      rasterLayerOpts = [
        { id: `seCoverage-${seType}-N`, paneLevel: 2 },
        { id: `seCoverage-${seType}-S`, paneLevel: 2 },
        { id: `seCoverage-${seType}-T`, paneLevel: 2 },
      ];
      newActiveLayer.name = `Coberturas - ${SELabel(seType)}`;
      newActiveLayer.defaultOpacity = 0.7;
    } else if (sectionName === 'hfCurrent') {
      shapeLayerOpts = [{ id: 'hfCurrent', paneLevel: 1 }];
      newActiveLayer.name = 'HH promedio · 2018';
    } else if (sectionName === 'hfPersistence') {
      shapeLayerOpts = [{ id: 'hfPersistence', paneLevel: 1 }];
      newActiveLayer.name = 'HH - Persistencia';
    } else if (sectionName === 'hfTimeline'
      || sectionName === 'hfTimeline-aTotal') {
      shapeLayerOpts = [{ id: 'hfPersistence', paneLevel: 1 }];
      newActiveLayer.name = 'HH - Persistencia y Ecosistemas estratégicos (EE)';
    } else if (sectionName === 'hfTimeline-paramo') {
      shapeLayerOpts = [
        { id: 'hfPersistence', paneLevel: 1 },
        { id: 'paramo', fitBounds: false, paneLevel: 2 },
      ];
      newActiveLayer.name = 'HH - Persistencia - Páramos';
    } else if (sectionName === 'hfTimeline-dryForest') {
      shapeLayerOpts = [
        { id: 'hfPersistence', paneLevel: 1 },
        { id: 'dryForest', fitBounds: false, paneLevel: 2 },
      ];
      newActiveLayer.name = 'HH - Persistencia - Bosque Seco Tropical';
    } else if (sectionName === 'hfTimeline-wetland') {
      shapeLayerOpts = [
        { id: 'hfPersistence', paneLevel: 1 },
        { id: 'wetland', fitBounds: false, paneLevel: 2 },
      ];
      newActiveLayer.name = 'HH - Persistencia - Humedales';
    } else if (/numberOfSpecies*/.test(sectionName)) {
      const groupLabel = {
        total: 'Total',
        endemic: 'Endémicas',
        invasive: 'Invasoras',
        threatened: 'Amenazadas',
      };
      rasterLayerOpts = [{ id: sectionName, paneLevel: 1 }];
      let group = 'total';
      const selected = sectionName.match(/numberOfSpecies-(\w+)/);
      if (selected) [, group] = selected;
      newActiveLayer.name = `Número de especies - ${groupLabel[group]}`;
      newActiveLayer.defaultOpacity = 0.85;
      mapLegend = {
        promise: RestAPI.requestNOSLayerThresholds(
          selectedAreaTypeId,
          selectedAreaId,
          group,
        ),
        resolve: (res) => {
          this.setState((prevState) => {
            const newState = { ...prevState };
            newState.activeLayer.legend = {
              from: res.min.toString(),
              to: res.max.toString(),
              colors: [
                matchColor('richnessNos')('legend-from'),
                matchColor('richnessNos')('legend-to'),
              ],
            };
            return newState;
          });
        },
      };
    } else if (sectionName === 'speciesRecordsGaps') {
        rasterLayerOpts = [{ id: 'speciesRecordsGaps', paneLevel: 1 }];
        newActiveLayer.name = 'Vacios en registros de especies';
        newActiveLayer.defaultOpacity = 0.75;
        mapLegend = {
          promise: RestAPI.requestGapsLayerThresholds(
            selectedAreaTypeId,
            selectedAreaId,
          ),
          resolve: (res) => {
            this.setState((prevState) => {
              const newState = { ...prevState };
              newState.activeLayer.legend = {
                from: Math.round(res.min * 100).toString(),
                to: Math.round(res.max * 100).toString(),
                colors: [
                  matchColor('richnessGaps')('legend-from'),
                  matchColor('richnessGaps')('legend-middle'),
                  matchColor('richnessGaps')('legend-to'),
                ],
              };
              return newState;
            });
          },
        };
    }

    if (shapeLayerOpts.length <= 0 && rasterLayerOpts.length <= 0) {
      this.reportDataError();
    }

    if (mapLegend) {
      mapLegend.promise.then((res) => mapLegend.resolve(res))
      .catch(() => {
        // TODO: Confirm with the thematic team the behavior when this endpoints fails
      });
    }

    const loadingProm = [];
    if (rasterLayerOpts.length > 0) {
      const rasterProm = Promise.all([
        this.getShapeLayer('geofence', { isActive: false }),
        ...rasterLayerOpts.map((info) => this.getRasterLayer(info.id)),
      ])
      .then(([, ...rasterLayers]) => {
        if (rasterLayers.includes('canceled')) {
          return 'canceled';
        }
        if (rasterLayers.every((e) => e === null)) {
          this.reportDataError();
        }
        if (this.geofenceBounds !== null) {
          this.setState({
            rasterUrls: rasterLayers
            .map((layer, idx) => {
              if (layer !== null) {
                return {
                  id: layer.id,
                  data: layer.data,
                  opacity: newActiveLayer.defaultOpacity,
                  paneLevel: rasterLayerOpts[idx].paneLevel ?? 1,
                };
              }
              return null;
            })
            .filter((layer) => layer !== null),
            activeLayer: newActiveLayer,
          });
        }
        return null;
      })
      .catch(() => {
        this.reportDataError();
      });
      loadingProm.push(rasterProm);
    }

    if (shapeLayerOpts.length > 0) {
      const shapeProm = Promise.all(
        shapeLayerOpts.map((info) => {
          const {
            id,
            isActive,
            fitBounds,
            paneLevel,
          } = info;
          return this.getShapeLayer(id, { isActive, fitBounds, paneLevel });
        }),
      )
      .then((shapeLayers) => {
        if (shapeLayers.includes('canceled')) {
          return 'canceled';
        }
        this.setState({
          activeLayer: newActiveLayer,
        });
        return null;
      })
      .catch(() => {
        this.reportDataError();
      });
      loadingProm.push(shapeProm);
    }

    Promise.all(loadingProm).then((resolved) => {
      if (!resolved.includes('canceled')) {
        this.setState({ loadingLayer: false });
      }
    });
  }

  /**
   * Switch layer based on graph showed
   *
   * @param {String} layerType layer type
   * @param {function} callback operations to execute sequentially
   */
  switchLayer = async (layerType, callback = () => {}) => {
    const {
      selectedAreaId,
      selectedAreaTypeId,
    } = this.props;
    const { layers } = this.state;

    this.setState({
      loadingLayer: true,
      layerError: false,
    });

    let requestObj = null;
    let shutOtherLayers = true;
    let layerStyle = this.featureStyle({ type: layerType });
    let newActiveLayer = null;
    let layerKey = layerType;
    let paneLevel = 1;

    switch (layerType) {
      case 'coverages':
      case 'speciesRecordsGaps':
      case 'hfCurrent':
      case 'hfPersistence':
      case 'hfTimeline':
        this.setSectionLayers(layerType);
        return;
      // Current progress of the refactor
      case undefined:
      case null:
        this.cancelActiveRequests();
        break;
      case 'fc':
        requestObj = RestAPI.requestBiomesbyEAGeometry(selectedAreaId);
        newActiveLayer = {
          id: layerType,
          name: 'FC - Biomas',
        };
        break;
      case 'geofence':
        requestObj = RestAPI.requestGeofenceGeometryByArea(
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
          });

          requestObj = RestAPI.requestSCIHFGeometry(
            selectedAreaTypeId, selectedAreaId,
          );
          shutOtherLayers = false;
          newActiveLayer = {
            id: layerType,
            name: 'Índice de condición estructural de bosques',
          };
        });
        break;
      case 'currentPAConn':
      case 'timelinePAConn':
      case 'currentSEPAConn':
        this.switchLayer('geofence', () => {
          this.setState({
            loadingLayer: true,
            layerError: false,
          });
          requestObj = RestAPI.requestDPCLayer(
            selectedAreaTypeId,
            selectedAreaId,
          );
          shutOtherLayers = false;
          layerStyle = this.featureStyle({ type: 'currentPAConn' });
          layerKey = 'currentPAConn';
          newActiveLayer = {
            id: 'currentPAConn',
            name: `Conectividad de áreas protegidas${(layerType === 'currentSEPAConn') ? ' y Ecosistemas estratégicos (EE)' : ''}`,
          };
        });
        break;
      case 'paramoPAConn':
        requestObj = RestAPI.requestPAConnSELayer(
          selectedAreaTypeId, selectedAreaId, layerType,
        );
        shutOtherLayers = false;
        layerStyle = this.featureStyle({ type: layerType, color: 'sePAConn' });
        newActiveLayer = {
          id: 'paramoPAConn',
          name: 'Conectividad de áreas protegidas - Páramo',
        };
        paneLevel = 2;
        break;
      case 'dryForestPAConn':
        requestObj = RestAPI.requestPAConnSELayer(
          selectedAreaTypeId, selectedAreaId, layerType,
        );
        shutOtherLayers = false;
        layerStyle = this.featureStyle({ type: layerType, color: 'sePAConn' });
        newActiveLayer = {
          id: 'dryForestPAConn',
          name: 'Conectividad de áreas protegidas - Bosque Seco Tropical',
        };
        paneLevel = 2;
        break;
      case 'wetlandPAConn':
        requestObj = RestAPI.requestPAConnSELayer(
          selectedAreaTypeId, selectedAreaId, layerType,
        );
        shutOtherLayers = false;
        layerStyle = this.featureStyle({ type: layerType, color: 'sePAConn' });
        newActiveLayer = {
          id: 'wetlandPAConn',
          name: 'Conectividad de áreas protegidas - Humedales',
        };
        paneLevel = 2;
        break;
      default:
        if (/SciHfPA-*/.test(layerType)) {
          const [, sci, hf] = layerType.match(/SciHfPA-(\w+)-(\w+)/);
          requestObj = RestAPI.requestSCIHFPAGeometry(
            selectedAreaTypeId, selectedAreaId, sci, hf,
          );
          shutOtherLayers = false;
          layerStyle = this.featureStyle({ type: 'border' });
        } else if (/forestLP-*/.test(layerType)) {
          const [, yearIni, yearEnd] = layerType.match(/forestLP-(\w+)-(\w+)/);
          requestObj = RestAPI.requestEcoChangeLPGeometry(
            selectedAreaTypeId, selectedAreaId, `${yearIni}-${yearEnd}`,
          );
          layerStyle = this.featureStyle({ type: 'forestLP' });
          newActiveLayer = {
            id: layerType,
            name: `Pérdida y persistencia de bosque (${yearIni}-${yearEnd})`,
          };
        } else if (/numberOfSpecies*/.test(layerType)) {
          this.setSectionLayers(layerType);
        } else if (/seCoverages*/.test(layerType)) {
          this.setSectionLayers(layerType);
          return;
        }
        break;
    }

    if (shutOtherLayers) this.shutOffLayer();
    if (requestObj) {
      if (layers[layerKey]) {
        this.setState((prevState) => {
          const newState = prevState;
          newState.loadingLayer = false;
          if (newActiveLayer) {
            newState.activeLayer = newActiveLayer;
          }
          newState.layers[layerKey].active = true;
          newState.layers[layerKey].layerStyle = layerStyle;
          return newState;
        });
        callback();
      } else {
        const { request, source } = requestObj;
        this.activeRequests.set(layerType, source);
        request.then((res) => {
          this.activeRequests.delete(layerType);
          if (res.features) {
            if (res.features.length === 1 && !res.features[0].geometry) {
              this.reportDataError();
              return;
            }

            this.mapBounds = L.geoJSON(res).getBounds();

            this.setState((prevState) => {
              const newState = prevState;
              newState.layers[layerKey] = {
                active: true,
                layerStyle,
                onEachFeature: (feature, selectedLayer) => (
                  this.featureActions(selectedLayer, layerKey)
                ),
                json: res,
                paneLevel,
                id: layerKey,
              };
              newState.loadingLayer = false;
              if (newActiveLayer) newState.activeLayer = newActiveLayer;

              return newState;
            });
            callback();
          } else if (res !== 'request canceled') {
            this.reportDataError();
          }
        }).catch(() => {
          this.activeRequests.delete(layerType);
          this.reportDataError();
        });
      }
    } else {
      this.shutOffLayer();
      this.setState({ loadingLayer: false });
    }
  }

  /**
   * Load layer based on selection. If idLayer is null, just turn off all layers
   *
   * @param {String} idLayer Layer ID
   */
  loadSecondLevelLayer = (idLayer) => {
    const { layers } = this.state;
    this.cancelActiveRequests();

    this.setState((prevState) => {
      const newState = {
        ...prevState,
      };
      Object.keys(newState.layers).forEach((item) => {
        newState.layers[item].active = false;
      });
      return newState;
    });

    if (!idLayer) {
      return;
    }

    if (layers[idLayer]) {
      this.setArea(idLayer);
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.layers[idLayer].active = true;
        return newState;
      });
    } else {
      const { request, source } = RestAPI.requestNationalGeometryByArea(idLayer);
      this.activeRequests.set(idLayer, source);
      this.setArea(idLayer);

      request
        .then((res) => {
          this.activeRequests.delete(idLayer);
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
        .catch(() => {
          this.activeRequests.delete(idLayer);
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
    this.cancelActiveRequests();
    const { setHeaderNames } = this.props;
    const { layers } = this.state;
    if (nameToOn) {
      this.setState(
        { selectedArea: nameToOn },
        () => {
          const { history } = this.props;
          const { selectedAreaType, selectedArea } = this.state;
          if (selectedAreaType && selectedArea) {
            history.push(`?area_type=${selectedAreaType.id}&area_id=${selectedArea.id || selectedArea.name}`);
            setHeaderNames(selectedAreaType.name, selectedArea.name);
          }
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

  /**
   * Loads polygon information
   *
   * @param {Object} polygon polygon to be searched
   */
  loadPolygonInfo = (polygon) => {
    RestAPI.requestCustomPolygonData(polygon).catch(() => {});
    this.setState((prev) => ({
      drawPolygonEnabled: false,
      layers: {
        ...prev.layers,
        polygon: {
          active: true,
          layer: L.polygon(polygon.latLngs, { fitBounds: true }),
        },
      },
    }));
  }

  /** ************************************* */
  /** LISTENER FOR BUTTONS ON LATERAL PANEL */
  /** ************************************* */

  handlerBackButton = () => {
    this.cancelActiveRequests();
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
    this.mapBounds = null;
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
      newState.rasterUrls = [];
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
      areaList,
      activeLayer: { name: activeLayer, legend },
      rasterUrls,
      drawPolygonEnabled,
    } = this.state;

    const {
      selectedAreaTypeId,
      selectedAreaId,
    } = this.props;

    const mapTitle = !activeLayer ? null : (
      <>
        <div className="mapsTitle">
          <div className="title">{activeLayer}</div>
          {legend && (
            <GradientLegend
              fromValue={legend.from}
              toValue={legend.to}
              colors={legend.colors}
            />
          )}
        </div>
      </>
    );

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
            switchLayer: this.switchLayer,
            cancelActiveRequests: this.cancelActiveRequests,
          }}
        >
          <div className="appSearcher wrappergrid">
            <MapViewer
              layers={Object.values(layers).filter((l) => l.active)}
              geoServerUrl={GeoServerAPI.getRequestURL()}
              loadingLayer={loadingLayer}
              layerError={layerError}
              rasterLayers={rasterUrls}
              mapBounds={this.mapBounds}
              rasterBounds={this.geofenceBounds}
              mapTitle={mapTitle}
              drawPolygonEnabled={drawPolygonEnabled}
              loadPolygonInfo={this.loadPolygonInfo}
            />
            <div className="contentView">
              { (!selectedAreaTypeId || !selectedAreaId) && (
                <Selector
                  handlers={{
                    areaListChange: () => {
                      this.loadSecondLevelLayer(null);
                      this.setState({ drawPolygonEnabled: false });
                    },
                    areaTypeChange: this.secondLevelChange,
                    geofenceChange: this.innerElementChange,
                    polygonChange: () => {
                      this.setState({ drawPolygonEnabled: true });
                    },
                  }}
                  description={Description()}
                  areasData={areaList}
                />
              )}
              { selectedAreaTypeId && selectedAreaId && (selectedAreaTypeId !== 'se') && (
                <Drawer
                  handlerBackButton={this.handlerBackButton}
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
