import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { transformPAValues, transformCoverageValues } from 'pages/search/utils/transformData';
import SearchContext from 'pages/search/SearchContext';
import GraphLoader from 'components/charts/GraphLoader';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import DownloadCSV from 'components/DownloadCSV';

import { SEKey } from 'pages/search/utils/appropriate_keys';

class EcosystemDetails extends Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      coverageData: null,
      paData: null,
      stopLoad: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      SEValues,
    } = this.props;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    const SEType = SEValues.type;
    const SEArea = SEValues.area;
    const { stopLoad } = this.state;

    if (!stopLoad) {
      RestAPI.requestSECoverageByGeofence(areaId, geofenceId, SEType)
        .then((res) => {
          if (this.mounted) {
            this.setState({ coverageData: transformCoverageValues(res) });
          }
        })
        .catch(() => {});

      RestAPI.requestSEPAByGeofence(areaId, geofenceId, SEType)
        .then((res) => {
          if (this.mounted) {
            this.setState({ paData: transformPAValues(res, SEArea) });
          }
        })
        .catch(() => {});

      switchLayer(`seCoverages-${SEKey(SEType)}`);
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
      coverageData,
      paData,
      stopLoad,
    } = this.state;
    const { SEValues } = this.props;
    const { handlerClickOnGraph } = this.context;
    if (!stopLoad) {
      return (
        <div>
          <h3>
            Distribución de coberturas:
            {!coverageData && (
              <b>
                <br />
                Cargando información...
              </b>
            )}
            {coverageData && coverageData.length <= 0 && (
              <b>No hay información disponible de coberturas</b>
            )}
            {(coverageData && coverageData.length > 0) && (
              <>
                <GraphLoader
                  graphType="SmallBarStackGraph"
                  data={coverageData}
                  units="ha"
                  colors={matchColor('coverage')}
                  onClickGraphHandler={(selected) => {
                  handlerClickOnGraph({
                    chartType: 'seCoverage',
                    chartSection: SEKey(SEValues.type),
                    selectedKey: selected,
                  });
                }}
                />
                <DownloadCSV
                  data={coverageData}
                  filename="Distribucion_de_coberturas.csv"
                />
              </>
            )}
          </h3>
          <h3>
            Distribución en áreas protegidas:
            {!paData && (
              <b>
                <br />
                Cargando información...
              </b>
            )}
            {paData && paData.length <= 0 && (
              <div>
                <b>Sin áreas protegidas</b>
              </div>
            )}
            {(paData && paData.length > 0) && (
              <>
                <GraphLoader
                  graphType="SmallBarStackGraph"
                  data={paData}
                  units="ha"
                  colors={matchColor('pa', true)}
                />
                <DownloadCSV
                  data={coverageData}
                  filename="Distribucion_en_areas_protegidas.csv"
                />
              </>
            )}
          </h3>
        </div>
      );
    }
    return null;
  }
}

EcosystemDetails.propTypes = {
  SEValues: PropTypes.object.isRequired,
};

export default EcosystemDetails;
EcosystemDetails.contextType = SearchContext;
