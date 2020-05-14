import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';
import { setPAValues, setCoverageValues } from './FormatSE';
import RestAPI from '../api/RestAPI';

/**
 *
 * Validate if data exist before rendering graph
 *
 * @param {array} data percentage in "national system of protected areas" or SINAP
 * @returns {object} validation of data availability and existence
 */
const validateData = (data) => {
  if (data === null) {
    return (
      <b>
        <br />
        Cargando información...
      </b>
    );
  }
  if (data.length <= 0) return <b>No disponible</b>;
  return false;
};

/**
 * Return details for each strategic ecosystem
 *
 * @param {number} npsp percentage in "national system of protected areas" or SINAP
 * @param {number} sep percentage in strategic ecosystems
 * @param {array} coverage by default, should load transformed and natural area by %
 * @param {array} protectedArea by default, should load transformed and natural area by %
 * @param {func} matchColor function to set the color
 * @returns {div} details for each strategic ecosystem
 */
const showDetails = (/* TODO: Add all values required */
  npsp,
  sep,
  coverage,
  protectedArea,
  matchColor,
) => (
  <div>
    <h3>
      Distribución de coberturas:
      {validateData(coverage)
        || (
          <RenderGraph
            graph="SmallBarStackGraphNIVO"
            data={setCoverageValues(coverage)}
            zScale={matchColor('coverage')}
            units="ha"
          />
        )
      }
    </h3>
    <h3>
      Distribución en áreas protegidas:
      {validateData(protectedArea)
        || (
          <RenderGraph
            graph="SmallBarStackGraphNIVO"
            data={setPAValues(protectedArea)}
            zScale={matchColor('pa')}
            units="ha"
          />
        )
      }
    </h3>
    <h3>
      En Ecosistemas Estratégicos:
      <b>{`${Number(sep).toFixed(2)} %`}</b>
      <br />
      En Sistema Nacional:
      <b>{`${Number(npsp).toFixed(2)} %`}</b>
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
      RestAPI.requestSEDetail(areaId, geofenceId, name)
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
            seCoverage: false,
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
            sePA: false,
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
    return (
      !stopLoad
        ? showDetails(
          seDetail,
          item.percentage,
          seCoverage,
          sePA,
          matchColor,
        ) : null
    );
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
