/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GeneralArea from '../commons/GeneralArea';
import EcosystemsBox from './EcosystemsBox';
import RenderGraph from '../charts/RenderGraph';

const numberWithCommas = (x) => {
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

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
  } = props;
/*
  console.log('generalArea',typeof(generalArea));
  console.log('ecosystemsArea',typeof(ecosystemsArea));
  console.log('listSE',typeof(listSE));
  console.log('protectedArea',typeof(protectedArea));
  console.log('listPA',typeof(listPA));
  console.log('coverage',typeof(coverage));
  console.log('handlerInfoGraph',typeof(handlerInfoGraph));
  console.log('openInfoGraph',typeof(openInfoGraph));
  console.log('areaId',typeof(areaId));
  console.log('geofenceId',typeof(geofenceId));
  console.log('graphTitle',typeof(graphTitle));
  console.log('graphDescription',typeof(graphDescription));
*/
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
          Natural, Secundaria y Transformada
        </h6>
        <div className="graficaeco">
          <RenderGraph
            graph="SmallBarStackGraph"
            data={coverage}
            graphTitle="Cobertura"
            colors={null}
            labelX="Tipo de área"
            labelY="Comparación"
            handlerInfoGraph={handlerInfoGraph}
            openInfoGraph={openInfoGraph}
            graphDescription="Estado de la cobertura en el área seleccionada"
            units="%"
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
            graph="SmallBarStackGraph"
            data={listPA}
            graphTitle="Área protegida"
            colors={null}
            labelX=""
            labelY=""
            handlerInfoGraph={handlerInfoGraph}
            openInfoGraph={openInfoGraph}
            graphDescription=""
            units="%"
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

Overview.propTypes = {
  generalArea: PropTypes.any,
  ecosystemsArea: PropTypes.any,
  listSE: PropTypes.any,
  protectedArea: PropTypes.any,
  listPA: PropTypes.any,
  coverage: PropTypes.any,
  handlerInfoGraph: PropTypes.any,
  openInfoGraph: PropTypes.any,
  areaId: PropTypes.any,
  geofenceId: PropTypes.any,
  graphTitle: PropTypes.any,
  graphDescription: PropTypes.any,
};

Overview.defaultProps = {
  generalArea: '',
  ecosystemsArea: '',
  listSE: '',
  protectedArea: '',
  listPA: '',
  coverage: '',
  handlerInfoGraph: '',
  openInfoGraph: '',
  areaId: '',
  geofenceId: '',
  graphTitle: '',
  graphDescription: '',
};

export default Overview;
