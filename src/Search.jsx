/** eslint verified */
import React, { Component } from 'react';

import L from 'leaflet';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';

import CloseIcon from '@material-ui/icons/Close';
import MapViewer from './commons/MapViewer';
import Selector from './commons/Selector';
import Drawer from './search/Drawer';
import NationalInsigths from './search/NationalInsigths';
import GeoServerAPI from './api/GeoServerAPI';
import { ConstructDataForSearch } from './commons/ConstructDataForSelector';
import { description } from './search/assets/selectorData';
import Layout from './Layout';
import RestAPI from './api/RestAPI';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLayers: null,
      activeLayer: null,
      geofenceData: null,
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
      colorsFC: [
        { 4: '#7b56a5' },
        { 4.5: '#6256a5' },
        { 5: '#5564a4' },
        { 5.5: '#4a8fb8' },
        { 6: '#51b4c1' },
        { 6.5: '#81bb47' },
        { 7: '#a4c051' },
        { 7.5: '#b1b559' },
        { 8: '#eabc47' },
        { 8.5: '#d5753d' },
        { 9: '#ea5948' },
        { 9.5: '#ea495f' },
        { 10: '#c3374d' },
      ],
      connError: false,
      currentCompany: null,
      dataError: false,
      geofencesArray: [],
      areaList: [],
      layerName: null,
      layers: {},
      loadingModal: false,
      area: null,
      userDataLoaded: false,
    };
  }

  componentDidMount() {
    this.loadAreaList();
  }

  loadAreaList = () => {
    let { geofencesArray, areaList } = this.state;
    /**
     * Recover all geofences by default availables in the
     * database for the Search Module
     */
    Promise.all([
      RestAPI.getAllProtectedAreas(),
      RestAPI.getAllStates(),
      RestAPI.getAllEAs(),
      RestAPI.getAllSubzones(),
      RestAPI.getAllSEs(),
    ])
      .then(([pa, states, ea, basinSubzones, se]) => {
        areaList = [
          { name: 'Areas de manejo especial', data: pa, id: 'pa' },
          { name: 'Departamentos', data: states, id: 'states' },
          { name: 'Jurisdicciones ambientales', data: ea, id: 'ea' },
          { name: 'Subzonas hidrográficas', data: basinSubzones, id: 'basinSubzones' },
          { name: 'Ecosistemas estratégicos', data: se, id: 'se' },
        ];
        geofencesArray = ConstructDataForSearch(areaList);
        this.setState({
          geofencesArray,
          areaList,
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
        dataError: true,
        loadingModal: false,
      });
    }

  /**
   * Choose the right color for the biome inside the map, according
   *  with colorsFC state
   *
   * @param {Object} feature target object
   */
  featureStyle = (feature) => {
    const { colorsFC } = this.state;
    const valueFC = Math.min(
      (Math.ceil((feature.properties.compensation_factor * 10) / 5) * 5) / 10, 10,
    );
    const colorFound = Object.values(colorsFC.find(obj => Number(Object.keys(obj)) === valueFC));
    const styleReturn = {
      stroke: false,
      fillColor: colorFound,
      fillOpacity: 0.7,
    };
    return styleReturn;
  }

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
    const { activeLayer, area } = this.state;
    const point = event.target;
    point.setStyle({
      weight: 1,
      fillOpacity: 1,
    });
    if (area && (parentLayer === area.id)) {
      // TODO: Unify data structure for id and name in the layer geometry values
      //  and coding (UTF-8)
      point.bindPopup(
        `<b>${point.feature.properties.IDCAR}</b>
         <br>${point.feature.properties.NOMCAR}`,
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
    const { layers } = this.state;
    layers[parentLayer].layer.resetStyle(feature);
    feature.closePopup();
  }

  clickFeature = (event, parentLayer) => {
    this.highlightFeature(event, parentLayer);
    this.handleClickOnArea(event, parentLayer);
  }

  /**
   * When a click event occurs on a bioma layer in the searches module,
   *  request info by basinSubzones
   *
   * @param {Object} event event object
   */
  handleClickOnArea = (event, parentLayer) => {
    const biome = event.target.feature.properties.name_biome;
    RestAPI.requestBiomeBySZH(parentLayer, biome)
      .then((res) => {
        this.setState({
          layerName: biome,
          geofenceData: res,
        });
      });
    // TODO: When the promise is rejected, we need to show a "Data not available" error
    // (in the table). But the application won't break as it currently is
  }

  /**
   * Load layer based on selection
   *
   * @param {String} idLayer Layer ID
   * @param {String} parentLayer Parent layer ID
   */
  loadLayer = (layer, parentLayer) => {
    this.setState({
      loadingModal: true,
      activeLayer: layer,
    });
    RestAPI.requestBiomesbyEA(layer.id)
      .then((res) => {
        if (res.features) {
          this.setState(prevState => ({
            layers: {
              ...prevState.layers,
              [layer.id]: {
                displayName: layer.name,
                active: true,
                layer: L.geoJSON(res, {
                  style: this.featureStyle,
                  onEachFeature: (feature, selectedlayer) => (
                    this.featureActions(feature, selectedlayer, layer.id)
                  ),
                }),
              },
            },
          }));

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
        } else this.reportDataError();
      }).catch(() => this.reportDataError());
  }

  /**
   * Load layer based on selection
   *
   * @param {String} idLayer Layer ID
   * @param {String} parentLayer Parent layer ID
   */
  loadSecondLevelLayer = (idLayer) => {
    const { areaList } = this.state;
    // TODO: Change ot for a loading layer strategy
    switch (idLayer) {
      case 'ea':
        GeoServerAPI.requestJurisdicciones()
          .then((res) => {
            this.setState(prevState => ({
              layers: {
                ...prevState.layers,
                ea: {
                  displayName: idLayer,
                  active: false,
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
            }));

            this.setState((prevState) => {
              const newState = { ...prevState };
              if (prevState.layers[idLayer]) {
                newState.layers[idLayer].active = !prevState.layers[idLayer].active;
                newState.area = areaList.find(
                  item => item.id === newState.layers[idLayer].displayName,
                );
              }
              return newState;
            });
          });
        break;
      default:
        break;
    }
  }

  /** ****************************** */
  /** LISTENERS FOR SELECTOR CHANGES */
  /** ****************************** */
  secondLevelChange = (id) => {
    const { areaList } = this.state;
    this.setState((prevState) => {
      let newState = { ...prevState };
      newState = {
        ...newState,
        area: areaList.find(
          item => item.id === id,
        ),
      };
      return newState;
    });
    this.loadSecondLevelLayer(id);
  }

  /**
    * Update the active layer, sending state updated to MapViewer and Drawer
    *
    * @param {nameToOff} layer name to remove and turn off in the map
    * @param {nameToOn} layer name to active and turn on in the map
    */
  innerElementChange = (nameToOff, nameToOn) => {
    if (nameToOn) this.loadLayer(nameToOn, nameToOff);
  }

  /** ***************************************** */
  /** LISTENER FOR BACK BUTTON ON LATERAL PANEL */
  /** ***************************************** */

  // TODO: Return from biome to jurisdicción
  handlerBackButton = () => {
    this.setState((prevState) => {
      let newState = { ...prevState };
      const { layers } = prevState;
      Object.keys(layers).forEach((layerKey) => {
        newState.layers[layerKey].active = false;
      });

      newState = {
        ...newState,
        geofenceData: null,
        area: null,
        layerName: null,
        activeLayer: null,
        layers: {},
      };
      return newState;
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

  /**
    * Function to control data options belonging to the companyId
    * TODO: Add data from the current company in geofencesArray
    */
  getData = () => {
    const { geofencesArray } = this.state;
    return geofencesArray;
  }

  render() {
    const { callbackUser, userLogged } = this.props;
    const {
      area, layerName, activeLayer, geofenceData, currentCompany, loadingModal,
      colors, colorsFC, colorSZH, layers, connError, dataError,
    } = this.state;
    return (
      <Layout
        moduleName="Consultas"
        showFooterLogos={false}
        userLogged={userLogged}
        callbackUser={callbackUser}
      >
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
          <div className="contentView">
            { !activeLayer && (
              <Selector
                handlers={[
                  () => {},
                  this.secondLevelChange,
                  this.innerElementChange,
                ]}
                description={description(currentCompany)}
                data={this.getData()}
                expandedId={0}
                iconClass="iconsection"
              />
            )}
            { activeLayer && area && (area.id !== 'se') && (
              <Drawer
                area={area}
                colors={colors}
                colorsFC={colorsFC.map(obj => Object.values(obj)[0])}
                colorSZH={colorSZH}
                geofenceData={geofenceData}
                geofence={activeLayer}
                handlerBackButton={this.handlerBackButton}
                id
                layerName={layerName}
              />
            )}
            { activeLayer && area && (area.id === 'se') && (
              <NationalInsigths
                area={area}
                colors={colors}
                geofence={activeLayer}
                handlerBackButton={this.handlerBackButton}
                id
              />
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

Search.propTypes = {
  callbackUser: PropTypes.func.isRequired,
  userLogged: PropTypes.object,
};

Search.defaultProps = {
  userLogged: null,
};

export default Search;
