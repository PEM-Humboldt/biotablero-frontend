/** eslint verified */
import React, { Component } from 'react';
import L from 'leaflet';
import MapViewer from './MapViewer';
import ProjectSelector from './compensation/ProjectSelector';
import Drawer from './compensation/Drawer';
import Footer from './Footer';

import ElasticAPI from './api/elastic';
import GeoServerAPI from './api/geoserver';

class Compensation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geojsonCapa1: null,
      geojsonCapa2: null,
      geojsonCapa3: null,
      geojsonCapa4: null,
      layers: null,
      activeLayers: null,
    };
  }

  componentDidMount() {
    Promise.all([
      GeoServerAPI.requestSogamoso(),
      GeoServerAPI.requestBiomasSogamoso(),
    ]).then((res) => {
      this.setState(prevState => (
        {
          layers: {
            ...prevState.layers,
            sogamoso: L.geoJSON(
              res[0],
              {
                style: {
                  stroke: true,
                  color: '#ea495f',
                  fillColor: '#ea495f',
                  opacity: 0.6,
                  fillOpacity: 0.4,
                },
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'sogamoso')
                ),
              },
            ),
            biomasSogamoso: L.geoJSON(
              res[1],
              {
                style: {
                  stroke: false, fillColor: '#7b56a5', opacity: 0.6, fillOpacity: 0.4,
                },
                onEachFeature: (feature, layer) => (
                  this.featureActions(feature, layer, 'biomasSogamoso')
                ),
              },
            ),
          },
        }
      ));
    });
  }

  featureActions = (feature, layer, parentLayer) => {
    layer.on(
      {
        mouseover: this.highlightFeature,
        mouseout: e => this.resetHighlight(e, parentLayer),
        click: this.clickFeature,
      },
    );
  }

  highlightFeature = (event) => {
    const feature = event.target;
    feature.setStyle({
      weight: 1,
      fillOpacity: 1,
    });
    if (!L.Browser.ie && !L.Browser.opera) feature.bringToFront();
  }

  resetHighlight = (event, layer) => {
    const feature = event.target;
    const { layers } = this.state;
    layers[layer].resetStyle(feature);
  }

  clickFeature = (event) => {
    // TODO: Activate bioma inside dotsWhere and dotsWhat
    this.highlightFeature(event);
  }

  handlerBackButton = () => {
    this.setState(prevState => (
      {
        activeLayers: {
          ...prevState.activeLayers,
          sogamoso: false,
          biomasSogamoso: false,
        },
        geojsonCapa3: null,
      }
    ));
  }

  panelLayer = (nombre) => {
    this.setState({
      geojsonCapa1: nombre,
    });
  }

  subPanelLayer = (nombre) => {
    this.setState({
      geojsonCapa2: nombre,
    });
  }

  innerPanelLayer = (name) => {
    this.setState(prevState => (
      {
        activeLayers: {
          ...prevState.activeLayers,
          sogamoso: true,
          biomasSogamoso: true,
        },
        geojsonCapa3: name,
      }
    ));
  }

  updateActiveBioma = (campo) => {
    ElasticAPI.requestDondeCompensarSogamoso(campo)
      .then((res) => {
        this.setState({
          geojsonCapa4: campo,
          datosSogamoso: res,
        });
      });
  }

  render() {
    const {
      datosSogamoso, geojsonCapa1, geojsonCapa2, geojsonCapa3, geojsonCapa4,
      layers, activeLayers,
    } = this.state;
    return (
      <div>
        <div className="appSearcher">
          <MapViewer
            layers={layers}
            activeLayers={activeLayers}
          />
          <div className="contentView">
            {
              !geojsonCapa3 && (
              <ProjectSelector
                panelLayer={this.panelLayer}
                subPanelLayer={this.subPanelLayer}
                innerPanelLayer={this.innerPanelLayer}
              />
              )
            }
            {
              geojsonCapa3 && (
              <Drawer
                areaName={`GEB ${geojsonCapa1}`}
                back={this.handlerBackButton}
                basinName={geojsonCapa3.NOMCAR || geojsonCapa3}
                layerName={geojsonCapa4}
                projectData={datosSogamoso}
                subAreaName={geojsonCapa2}
                updateActiveBioma={this.updateActiveBioma}
              />
              )
            }
          </div>
        </div>
        <Footer showLogos={false} />
      </div>
    );
  }
}

export default Compensation;
