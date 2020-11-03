import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { setPAValues, setCoverageValues } from './FormatSE';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';
import RestAPI from '../api/RestAPI';
import SearchContext from '../SearchContext';

/**
 * Validate if data exist before rendering graph
 *
 * @param {array} data information to load graphs
 * @param {function} colorFunc function to assign colors in a graph
 *
 * @returns {string | boolean} validation of data availability and existence
 */
const loadData = (data, colorFunc) => {
  if (data === null) {
    return (
      <b>
        <br />
        Cargando información...
      </b>
    );
  }
  if (data.length <= 0) return (<b>No disponible</b>);
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
  npsp,
  sep,
  coverage,
  protectedArea,
) => (
  <div>
    <h3>
      Distribución de coberturas:
      {loadData(setCoverageValues(coverage), matchColor('coverage'))}
    </h3>
    <h3>
      Distribución en áreas protegidas:
      {loadData(setPAValues(protectedArea), matchColor('pa'))}
    </h3>
    {/* <h3>
      En Ecosistemas Estratégicos:
      <b>{`${Number(sep).toFixed(0)} %`}</b>
      <br />
      En Sistema Nacional:
      <b>{`${Number(npsp).toFixed(0)} %`}</b>
    </h3> */}
  </div>
);

class DetailsView extends Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      seDetail: null,
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
    } = this.context;

    const name = item.type || item.name;
    const { stopLoad } = this.state;

    if (!stopLoad) {
      RestAPI.requestSEDetailInArea(areaId, geofenceId, name)
        .then((res) => {
          if (this.mounted) {
            this.setState({ seDetail: res.national_percentage * 100 });
          }
        })
        .catch(() => {});

      RestAPI.requestSECoverageByGeofence(areaId, geofenceId, name)
        .then((res) => {
          if (this.mounted) {
            this.setState({ seCoverage: res });
          }
        })
        .catch(() => {});

      RestAPI.requestSEPAByGeofence(areaId, geofenceId, name)
        .then((res) => {
          if (this.mounted) {
            this.setState({ sePA: res });
          }
        })
        .catch(() => {});
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
      item,
    } = this.props;

    const {
      seDetail,
      seCoverage,
      sePA,
      stopLoad,
    } = this.state;
    if (!stopLoad) {
      return (
        showDetails(
          seDetail,
          item.percentage,
          seCoverage,
          sePA,
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
