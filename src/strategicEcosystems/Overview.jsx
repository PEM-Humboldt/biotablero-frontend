/** eslint verified */
import React from 'react';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import EcosystemBox from './EcosystemBox';
import RenderGraph from '../charts/RenderGraph';

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const getPercentage = (part, total) => ((part * 100) / total).toFixed(2);

const Overview = (/* TODO: Add all values required */
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
) => (
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
      <h4>
      hectáreas totales
        <b>{`${numberWithCommas(generalArea)} ha`}</b>
      </h4>
      <div className="ecoest">
        <h4 className="minus20">
        Cobertura
        </h4>
        <h6>
        Natural y Transformada
        </h6>
        <div className="graficaeco">
          {RenderGraph(coverage, 'Tipo de área', 'Comparación', 'SmallBarStackGraph',
            'Cobertura', ['#164f74', '#60bbd4', '#5aa394'], handlerInfoGraph, openInfoGraph,
            'Estado de la cobertura en el área seleccionada', '%')}
        </div>
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
        {RenderGraph(listPA, '', '', 'SmallBarStackGraph',
          'Área protegida', ['#92ba3a', '#e9c948', '#5564a4'], handlerInfoGraph, openInfoGraph,
          '', '%')}
      </div>
      <div className="ecoest">
        <h4 className="minus20">
        Ecosistemas estratégicos
          <b>{`${numberWithCommas(ecosystemsArea)} ha`}</b>
        </h4>
        <h5 className="minusperc">{`${getPercentage(ecosystemsArea, generalArea)} %`}</h5>
        <EcosystemBox
          name="Bosque Seco Tropical"
          percentage={0.40}
          nationalPercentage={0.03}
          area={numberWithCommas(60)}
          coverage={coverage}
          areaPA={listPA}
          handlerInfoGraph={handlerInfoGraph}
          openInfoGraph={openInfoGraph}
        />
        <EcosystemBox
          name="Páramo"
          percentage={0.15}
          nationalPercentage={0.05}
          area={numberWithCommas(10)}
          coverage={coverage}
          areaPA={listPA}
          handlerInfoGraph={handlerInfoGraph}
          openInfoGraph={openInfoGraph}
        />
      </div>
    </div>
  </div>
);

export default Overview;
