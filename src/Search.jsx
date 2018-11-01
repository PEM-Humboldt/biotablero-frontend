/** eslint verified */
import React, { Component } from 'react';

import L from 'leaflet';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';

import MapViewer from './MapViewer';
import Selector from './Selector';
import Drawer from './search/Drawer';
import GeoServerAPI from './api/geoserver';
import { description, selectorData, dataGEB } from './search/assets/selectorData';
import Layout from './Layout';
import RestAPI from './api/REST';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: {},
      currentCompany: null,
      subAreaName: null,
      layerName: null,
      basinData: null,
      activeLayerName: null,
      activeLayers: null,
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
      loadingModal: false,
    };
  }

  componentDidMount() {
    const { userLogged } = this.props;
    const easList = [];
    RestAPI.getAllEAs()
      .then((res) => {
        res.forEach((ea) => {
          easList.push({
            value: ea.id_ea,
            label: ea.name,
          });
        });
        selectorData[0].options[2].options[0].data = easList;
      });

    if (userLogged) {
      selectorData[0].options.unshift(dataGEB);
    }
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
    const point = event.target;
    point.setStyle({
      weight: 1,
      fillOpacity: 1,
    });
    switch (parentLayer) {
      case 'jurisdicciones':
        point.bindPopup(
          `<b>${point.feature.properties.IDCAR}</b><br>${point.feature.properties.NOMCAR}`,
        );
        break;
      default:
        point.bindPopup(`<b>Bioma:</b> ${point.feature.properties.name_biome}<br><b>Factor de compensación:</b> ${point.feature.properties.compensation_factor}`);
        break;
    }
    if (!L.Browser.ie && !L.Browser.opera) point.bringToFront();
  }

  resetHighlight = (event, parentLayer) => {
    const feature = event.target;
    const { layers } = this.state;
    layers[parentLayer].layer.resetStyle(feature);
    if (parentLayer === 'jurisdicciones') feature.closePopup();
  }

  clickFeature = (event, parentLayer) => {
    // TODO: Activate biome inside dotsWhere and dotsWhat
    // TODO: Create function for jurisdicciones layer
    this.highlightFeature(event, parentLayer);
    this.handleClickOnArea(event, parentLayer);
  }

  /**
   * When a click event occurs on a bioma layer in the searches module,
   *  request info by szh on that bioma
   *
   * @param {Object} event event object
   */
  handleClickOnArea = (event, parentLayer) => {
    const biome = event.target.feature.properties.name_biome;
    RestAPI.requestBiomeBySZH(parentLayer, biome)
      .then((res) => {
        this.setState({
          layerName: biome,
          basinData: res,
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
  loadLayer = (idLayer, parentLayer) => {
    this.setState({ loadingModal: true });
    RestAPI.requestBiomesbyEA(idLayer)
      .then((res) => {
        this.setState(prevState => ({
          layers: {
            ...prevState.layers,
            [idLayer]: {
              displayName: idLayer,
              active: true,
              layer: L.geoJSON(res, {
                style: this.featureStyle,
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, idLayer)
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
          if (prevState.layers[idLayer]) {
            newState.layers[idLayer].active = true;
            newState.activeLayerName = newState.layers[idLayer].displayName;
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
  loadSecondLevelLayer = (idLayer) => {
    switch (idLayer) {
      case 'jurisdicciones':
        GeoServerAPI.requestJurisdicciones()
          .then((res) => {
            this.setState(prevState => ({
              layers: {
                ...prevState.layers,
                jurisdicciones: {
                  displayName: 'Jurisdicciones',
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
                newState.subAreaName = newState.layers[idLayer].displayName;
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
  secondLevelChange = (name) => {
    this.loadSecondLevelLayer(name);
  }

  /**
    * Update the active layer, sending state updated to MapViewer and Drawer
    *
    * @param {nameToOff} layer name to remove and turn off in the map
    * @param {nameToOn} layer name to active and turn on in the map
    */
  innerElementChange = (nameToOff, nameToOn) => {
    this.loadLayer(nameToOn, nameToOff);
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
        basinData: null,
        subAreaName: null,
        layerName: null,
        activeLayerName: null,
        layers: {},
      };
      return newState;
    });
  }

  /**
    * Function to control data to show
    */
  getData = () => {
    const { userLogged } = this.props;
    if (userLogged) {
      selectorData[0].options.unshift(dataGEB);
    } else if (selectorData[0].options[0] === dataGEB) {
      selectorData[0].options.shift(dataGEB);
    }
    return selectorData;
  }

  render() {
    const { callbackUser, userLogged } = this.props;
    const {
      subAreaName, layerName, activeLayerName, basinData, currentCompany, loadingModal,
      colors, colorsFC, colorSZH, layers,
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
          open={loadingModal}
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
            { !activeLayerName && (
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
            { activeLayerName && (
            <Drawer
              basinData={basinData}
              basinName={activeLayerName.NOMCAR || activeLayerName}
              colors={colors}
              colorsFC={colorsFC.map(obj => Object.values(obj)[0])} // Sort appropriately the colors
              colorSZH={colorSZH}
              handlerBackButton={this.handlerBackButton}
              layerName={layerName}
              subAreaName={subAreaName}
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
