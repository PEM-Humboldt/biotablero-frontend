import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GeneralArea from '../commons/GeneralArea';
import EcosystemsBox from './EcosystemsBox';
import RenderGraph from '../charts/RenderGraph';

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

const Overview = (props) => {
  const {
    generalArea,
    ecosystemsArea,
    listSE,
    protectedArea,
    listPA,
    coverage,
    handlerInfoGraph,
    openInfoGraph,
    areaId,
    geofenceId,
    graphTitle,
    graphDescription,
    matchColor,
  } = props;

  return (
    <div className="graphcard">
      <h2>
        <DownloadIcon className="icondown" />
        <InfoIcon
          className="graphinfo"
          data-tooltip
          title="¿Qué significa este gráfico?"
          onClick={() => {
            handlerInfoGraph(graphTitle);
          }}
        />
        <div
          className="graphinfo"
          onClick={() => handlerInfoGraph(graphTitle)}
          onKeyPress={() => handlerInfoGraph(graphTitle)}
          role="button"
          tabIndex="0"
        >
          Área
        </div>
      </h2>
      {openInfoGraph && (openInfoGraph === graphTitle) && (
      <ShortInfo
        name={graphTitle}
        description={graphDescription}
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
          <RenderGraph
            graph="SmallBarStackGraphNIVO"
            data={coverage}
            zScale={matchColor('coverage')}
            units="ha"
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
          <RenderGraph
            graph="SmallBarStackGraphNIVO"
            data={listPA}
            zScale={matchColor('pa')}
            units="ha"
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
};

Overview.propTypes = {
  generalArea: PropTypes.number,
  ecosystemsArea: PropTypes.number,
  listSE: PropTypes.array,
  protectedArea: PropTypes.number,
  listPA: PropTypes.array,
  coverage: PropTypes.array,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.object,
  areaId: PropTypes.string,
  geofenceId: PropTypes.string,
  graphTitle: PropTypes.string,
  graphDescription: PropTypes.string,
  matchColor: PropTypes.func,
};

Overview.defaultProps = {
  generalArea: 0,
  ecosystemsArea: 0,
  listSE: null,
  protectedArea: 0,
  listPA: null,
  coverage: null,
  handlerInfoGraph: () => {},
  openInfoGraph: null,
  areaId: '',
  geofenceId: '',
  graphTitle: '',
  graphDescription: '',
  matchColor: () => {},
};

export default Overview;
