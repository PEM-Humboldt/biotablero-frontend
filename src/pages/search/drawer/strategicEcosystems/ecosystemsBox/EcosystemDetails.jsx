import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { transformPAValues, transformCoverageValues } from 'pages/search/utils/transformData';
import SearchContext from 'pages/search/SearchContext';
import GraphLoader from 'components/charts/GraphLoader';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';

import { SEKey } from 'pages/search/utils/appropriate_keys';

class EcosystemDetails extends Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      seCoverage: null,
      sePA: null,
      stopLoad: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      item,
    } = this.props;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    const seType = item.type;
    const seArea = item.area;
    const { stopLoad } = this.state;

    if (!stopLoad) {
      RestAPI.requestSECoverageByGeofence(areaId, geofenceId, seType)
        .then((res) => {
          if (this.mounted) {
            this.setState({ seCoverage: transformCoverageValues(res) });
          }
        })
        .catch(() => {});

      RestAPI.requestSEPAByGeofence(areaId, geofenceId, seType)
        .then((res) => {
          if (this.mounted) {
            this.setState({ sePA: transformPAValues(res, seArea) });
          }
        })
        .catch(() => {});

      switchLayer(`seCoverages-${SEKey(seType)}`);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.setState({
      stopLoad: true,
    });
  }

  render() {
    const {
      seCoverage,
      sePA,
      stopLoad,
    } = this.state;
    const { item } = this.props;
    const { handlerClickOnGraph } = this.context;
    if (!stopLoad) {
      return (
        <div>
          <h3>
            Distribución de coberturas:
            {!seCoverage && (
              <b>
                <br />
                Cargando información...
              </b>
            )}
            {seCoverage && seCoverage.length <= 0 && (
              <b>No hay información disponible de coberturas</b>
            )}
            {(seCoverage && seCoverage.length > 0) && (
              <GraphLoader
                graphType="SmallBarStackGraph"
                data={seCoverage}
                units="ha"
                colors={matchColor('coverage')}
                onClickGraphHandler={(selected) => {
                  handlerClickOnGraph({
                    chartType: 'seCoverage',
                    chartSection: SEKey(item.type),
                    selectedKey: selected,
                  });
                }}
              />
            )}
          </h3>
          <h3>
            Distribución en áreas protegidas:
            {!sePA && (
              <b>
                <br />
                Cargando información...
              </b>
            )}
            {sePA && sePA.length <= 0 && (
              <b>No hay información disponible de áreas protegidas</b>
            )}
            {(sePA && sePA.length > 0) && (
              <GraphLoader
                graphType="SmallBarStackGraph"
                data={sePA}
                units="ha"
                colors={matchColor('pa')}
              />
            )}
          </h3>
        </div>
      );
    }
    return null;
  }
}

EcosystemDetails.propTypes = {
  item: PropTypes.object.isRequired,
};

export default EcosystemDetails;
EcosystemDetails.contextType = SearchContext;
