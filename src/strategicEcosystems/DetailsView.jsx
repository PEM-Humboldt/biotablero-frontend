import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GraphLoader from '../charts/GraphLoader';
import { setPAValues, setCoverageValues } from './FormatSE';
import RestAPI from '../api/RestAPI';

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
 * @param {func} matchColor function to set the color
 * @returns {div} node for each strategic ecosystem
 */
const showDetails = (
  npsp,
  sep,
  coverage,
  protectedArea,
  matchColor,
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
    <h3>
      En Ecosistemas Estratégicos:
      <b>{`${Number(sep).toFixed(0)} %`}</b>
      <br />
      En Sistema Nacional:
      <b>{`${Number(npsp).toFixed(0)} %`}</b>
    </h3>
  </div>
);

class DetailsView extends Component {
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
    const {
      areaId,
      geofenceId,
      item,
    } = this.props;

    const name = item.type || item.name;
    const { stopLoad } = this.state;

    if (!stopLoad) {
      RestAPI.requestSEDetailInArea(areaId, geofenceId, name)
        .then((res) => {
          this.setState(prevState => ({
            ...prevState,
            seDetail: res.national_percentage,
          }));
        })
        .catch(() => {
          this.setState(prevState => ({
            ...prevState,
            seDetail: 0,
          }));
        });

      RestAPI.requestSECoverageByGeofence(areaId, geofenceId, name)
        .then((res) => {
          this.setState(prevState => ({
            ...prevState,
            seCoverage: res,
          }));
        })
        .catch(() => {
          this.setState(prevState => ({
            ...prevState,
            seCoverage: [],
          }));
        });

      RestAPI.requestSEPAByGeofence(areaId, geofenceId, name)
        .then((res) => {
          this.setState(prevState => ({
            ...prevState,
            sePA: res,
          }));
        })
        .catch(() => {
          this.setState(prevState => ({
            ...prevState,
            sePA: [],
          }));
        });
    }
  }

  componentWillUnmount() {
    this.setState({
      stopLoad: true,
    });
  }

  render() {
    const {
      item,
      matchColor,
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
          matchColor,
        )
      );
    }
    return null;
  }
}

DetailsView.propTypes = {
  areaId: PropTypes.string,
  geofenceId: PropTypes.string,
  item: PropTypes.object,
  matchColor: PropTypes.func,
};

DetailsView.defaultProps = {
  areaId: 0,
  geofenceId: 0,
  item: {},
  matchColor: () => {},
};

export default DetailsView;
