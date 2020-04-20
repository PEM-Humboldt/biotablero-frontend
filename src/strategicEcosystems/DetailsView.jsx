import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';
import { setPAValues, setCoverageValues } from './FormatSE';
import RestAPI from '../api/RestAPI';

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

const showDetails = (/* TODO: Add all values required */
  npsp, // percentage in "national system of protected areas" or SINAP
  sep, // in strategic ecosystems percentage
  coverage, // By default, should load transformed and natural area by %
  protectedArea, // By default, should load transformed and natural area by %
  handlerInfoGraph, openInfoGraph, // values for coverage
) => (
  <div>
    <h3>
      Distribución de coberturas:
      {validateData(coverage) || RenderGraph(setCoverageValues(coverage), 'Tipo de área', 'Comparación', 'SmallBarStackGraph',
        'Cobertura', null, handlerInfoGraph, openInfoGraph,
        'muestra la proporción del tipo de área en este ecosistema estratégico', '%')}
    </h3>
    <h3>
      Distribución en áreas protegidas:
      {validateData(protectedArea) || RenderGraph(setPAValues(protectedArea), 'Áreas protegidas y no protegidas', 'Comparación', 'SmallBarStackGraph',
        'Distribución de áreas protegidas y no protegidas', null, handlerInfoGraph, openInfoGraph,
        'representa las hectáreas en áreas protegidas y permite la comparación con el área no protegida', '%')}
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
      areaId, geofenceId, item,
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
    } = this.props;
    const {
      seDetail, seCoverage, sePA, stopLoad,
    } = this.state;
    return (
      !stopLoad ? showDetails(seDetail, item.percentage, seCoverage, sePA, null, null) : null
    );
  }
}

DetailsView.propTypes = {
  areaId: PropTypes.string,
  geofenceId: PropTypes.string,
  item: PropTypes.object,
};

DetailsView.defaultProps = {
  areaId: 0,
  geofenceId: 0,
  item: {},
};

export default DetailsView;
