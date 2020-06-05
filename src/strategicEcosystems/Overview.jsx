import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import React from 'react';

import { setPAValues, setCoverageValues } from '../strategicEcosystems/FormatSE';
import EcosystemsBox from './EcosystemsBox';
import GeneralArea from '../commons/GeneralArea';
import GraphLoader from '../charts/GraphLoader';
import ShortInfo from '../commons/ShortInfo';

/**
 * Give format to a big number
 *
 * @param {number} x number to be formatted
 * @returns {String} number formatted setting decimals and thousands properly
 */
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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
    listSE,
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

  const coverageData = setCoverageValues(coverage);

  // First element removed, which is the total area in PA
  const totalPA = (Array.isArray(listPA) ? Number(listPA[0].area).toFixed(2) : 0);
  const allPA = Array.isArray(listPA) && setPAValues(listPA.slice(1));

  const ecosystemsArea = ((Array.isArray(listSE) && listSE[0] && listSE[0].area)
    ? Number(listSE[0].area).toFixed(2)
    : 0);
  const allSE = Array.isArray(listSE) && listSE.slice(1);

  const displaySE = (se) => {
    if (!se) return ('Cargando...');
    if (se.length <= 0) return ('Información no disponible');
    return (
      <EcosystemsBox
        areaId={areaId}
        total={Number(ecosystemsArea)}
        geofenceId={geofenceId}
        listSE={allSE}
        matchColor={matchColor}
      />
    );
  };

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
          <GraphLoader
            graphType="SmallBarStackGraph"
            data={coverageData}
            units="ha"
            colors={matchColor('coverage')}
          />
        </div>
        <h4>
          Áreas protegidas
          <b>{`${numberWithCommas(totalPA)} ha `}</b>
        </h4>
        <h5>
          {`${getPercentage(totalPA, generalArea)} %`}
        </h5>
        <div className="graficaeco">
          <h6>
            Distribución en área protegida:
          </h6>
          <GraphLoader
            graphType="SmallBarStackGraph"
            data={allPA}
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
          {displaySE(allSE)}
        </div>
      </div>
    </div>
  );
};

Overview.propTypes = {
  generalArea: PropTypes.number,
  listSE: PropTypes.array,
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
  listSE: null,
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
