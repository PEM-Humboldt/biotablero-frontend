import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { setPAValues, setCoverageValues } from 'pages/search/drawer/strategicEcosystems/formatSE';
import SearchContext from 'pages/search/SearchContext';
import GraphLoader from 'components/charts/GraphLoader';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';

import { SEKey } from 'pages/search/utils/appropriate_keys';

/**
 * Validate if data exist before rendering graph
 *
 * @param {array} data information to load graphs
 * @param {function} colorFunc function to assign colors in a graph
 *
 * @returns {string | boolean} validation of data availability and existence
 */
const loadData = (data, colorFunc, handlerClickOnGraph, seType) => {
  if (data === null) {
    return (
      <b>
        <br />
        Cargando información...
      </b>
    );
  }
  if (data.length <= 0) return (<b>No disponible</b>);
  if (handlerClickOnGraph) {
    return (
      <GraphLoader
        graphType="SmallBarStackGraph"
        data={data}
        units="ha"
        colors={colorFunc}
        onClickGraphHandler={(selected) => {
          handlerClickOnGraph({
            chartType: 'seCoverage',
            chartSection: SEKey(seType),
            selectedKey: selected,
          });
        }}
      />
    );
  }
  return (
    <GraphLoader
      graphType="SmallBarStackGraph"
      data={data}
      units="ha"
      colors={colorFunc}
    />
  );
};

/**
 * Return details for each strategic ecosystem
 *
 * @param {number} npsp percentage in "national system of protected areas" or SINAP
 * @param {number} sep percentage in strategic ecosystems
 * @param {array} coverage data about coverages
 * @param {array} protectedArea data about protected areas
 * @returns {div} node for each strategic ecosystem
 */
const showDetails = (
  coverage,
  protectedArea,
  handlerClickOnGraph,
  seType,
) => (
  <div>
    <h3>
      Distribución de coberturas:
      {loadData(setCoverageValues(coverage), matchColor('coverage'), handlerClickOnGraph, seType)}
    </h3>
    <h3>
      Distribución en áreas protegidas:
      {loadData(setPAValues(protectedArea), matchColor('pa'))}
    </h3>
  </div>
);

class DetailsView extends Component {
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
    const { stopLoad } = this.state;

    if (!stopLoad) {
      RestAPI.requestSECoverageByGeofence(areaId, geofenceId, seType)
        .then((res) => {
          if (this.mounted) {
            this.setState({ seCoverage: res });
          }
        })
        .catch(() => {});

      RestAPI.requestSEPAByGeofence(areaId, geofenceId, seType)
        .then((res) => {
          if (this.mounted) {
            this.setState({ sePA: res });
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
        showDetails(
          seCoverage,
          sePA,
          handlerClickOnGraph,
          item.type,
        )
      );
    }
    return null;
  }
}

DetailsView.propTypes = {
  item: PropTypes.object.isRequired,
};

export default DetailsView;
DetailsView.contextType = SearchContext;
