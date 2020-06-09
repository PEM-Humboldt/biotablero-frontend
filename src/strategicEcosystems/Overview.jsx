import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GeneralArea from '../commons/GeneralArea';
import EcosystemsBox from './EcosystemsBox';
import GraphLoader from '../charts/GraphLoader';

/**
 * Give format to a big number
 *
 * @param {number} x number to be formatted
 * @returns {String} number formatted setting decimals and thousands properly
 */
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Check if an array is empty according to area value
 *
 * @param {array} array array to be validated
 * @returns {boolean} boolean that indicates if array is empty
 */
const helperAreaArrayIsEmpty = (array) => {
  if (array) {
    let isEmpty = true;
    array.forEach((element) => {
      if (element.area !== 0) {
        isEmpty = false;
      }
      return isEmpty;
    });
  }
};

/**
 * Calculate percentage for a given value according to total
 *
 * @param {number} part value for the given part
 * @param {number} total value obtained by adding all parts
 * @returns {number} percentage associated to each part
 */
const getPercentage = (part, total) => ((part * 100) / total).toFixed(2);

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
    };
  }

  toggleInfo = () => {
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const {
      generalArea,
      ecosystemsArea,
      listSE,
      protectedArea,
      listPA,
      coverage,
      areaId,
      geofenceId,
      matchColor,
    } = this.props;
    const { showInfoGraph } = this.state;
    return (
      <div className="graphcard">
        <h2>
          <DownloadIcon className="icondown" />
          <InfoIcon
            className="graphinfo"
            data-tooltip
            title="¿Qué significa este gráfico?"
            onClick={() => this.toggleInfo()}
          />
          <div
            className="graphinfo"
            onClick={() => this.toggleInfo()}
            onKeyPress={() => this.toggleInfo()}
            role="button"
            tabIndex="0"
          >
            Área
          </div>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            name="Área"
            description={
              'resume la información de los ecosistemas presentes en el'
              + ' área seleccionada, y su distribución al interior de áreas protegidas'
              + ' y ecosistemas estratégicos. Nota: Aquellos valores inferiores al 1%'
              + ' no son representados en las gráficas.'}
            className="graphinfo2"
            tooltip="¿Qué significa?"
            customButton
          />
        )}
        <div className="graphcontainer pt5">
          <GeneralArea
            value={generalArea}
          />
          <h4>
            Cobertura
          </h4>
          <h6>
            Natural, Secundaria y Transformada:
          </h6>
          <div className="graficaeco">
            <GraphLoader
              graphType="SmallBarStackGraph"
              data={coverage}
              units="ha"
              colors={matchColor('coverage')}
            />
          </div>
          <h4>
            Áreas protegidas
            <b>{`${numberWithCommas(protectedArea)} ha `}</b>
          </h4>
          <h5>
            {`${getPercentage(protectedArea, generalArea)} %`}
          </h5>
          <div className="graficaeco">
            <h6>
              Distribución en área protegida:
            </h6>
            <GraphLoader
              graphType="SmallBarStackGraph"
              data={listPA}
              units="ha"
              colors={matchColor('pa')}
            />
          </div>
          <div className="ecoest">
            <h4 className="minus20">
              Ecosistemas estratégicos
              <b>{`${numberWithCommas(ecosystemsArea)} ha`}</b>
            </h4>
            <h5 className="minusperc">{`${getPercentage(ecosystemsArea, generalArea)} %`}</h5>
            {!listSE && ('Cargando...')}
            {helperAreaArrayIsEmpty(listSE) && ('Información no disponible')}
            {listSE && !helperAreaArrayIsEmpty(listSE) && (
              <EcosystemsBox
                areaId={areaId}
                total={Number(ecosystemsArea)}
                geofenceId={geofenceId}
                listSE={listSE}
                matchColor={matchColor}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  generalArea: PropTypes.number,
  ecosystemsArea: PropTypes.number,
  listSE: PropTypes.array,
  protectedArea: PropTypes.number,
  listPA: PropTypes.array,
  coverage: PropTypes.array,
  areaId: PropTypes.string,
  geofenceId: PropTypes.string,
  matchColor: PropTypes.func,
};

Overview.defaultProps = {
  generalArea: 0,
  ecosystemsArea: 0,
  listSE: null,
  protectedArea: 0,
  listPA: null,
  coverage: null,
  areaId: '',
  geofenceId: '',
  matchColor: () => {},
};

export default Overview;
