import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import React from 'react';

import { setPAValues, setCoverageValues } from './FormatSE';
import EcosystemsBox from './EcosystemsBox';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';
import RestAPI from '../api/RestAPI';
import SearchContext from '../SearchContext';
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

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      coverage: [],
      protectedAreas: [],
      PAArea: 0,
      strategicEcosistems: [],
      SEArea: 0,
      loadingSE: true,
    };
  }

  componentDidMount() {
    const {
      areaId,
      geofenceId,
    } = this.context;

    RestAPI.requestCoverage(areaId, geofenceId)
      .then((res) => {
        this.setState({ coverage: setCoverageValues(res) });
      })
      .catch(() => {});

    RestAPI.requestProtectedAreas(areaId, geofenceId)
      .then((res) => {
        if (Array.isArray(res) && res[0]) {
          const totalPA = Number(res[0].area).toFixed(0);
          const allPA = setPAValues(res.slice(1));
          this.setState({ protectedAreas: allPA, PAArea: totalPA });
        }
      })
      .catch(() => {});

    RestAPI.requestStrategicEcosystems(areaId, geofenceId)
      .then((res) => {
        if (Array.isArray(res) && res[0]) {
          const ecosystemsArea = Number(res[0].area).toFixed(0);
          const allSE = res.slice(1);
          this.setState({ strategicEcosistems: allSE, SEArea: ecosystemsArea });
        }
      })
      .catch(() => {})
      .finally(() => {
        this.setState({ loadingSE: false });
      });
  }

  toggleInfo = () => {
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  /**
   * Returns the right component depending on the list of strategic ecosystems
   * @param {Array} allSE data to validate component returned
   * @param {Number} ecosystemsArea total strategic ecosystem area
   *
   * @returns {node} Component to be displayed
   */
  displaySE = (allSE, ecosystemsArea) => {
    const { loadingSE } = this.state;
    if (loadingSE) return ('Cargando...');
    if (allSE.length <= 0) return ('Información no disponible');

    return (
      <EcosystemsBox
        total={Number(ecosystemsArea)}
        listSE={allSE}
      />
    );
  };

  render() {
    const {
      generalArea,
    } = this.props;
    const {
      showInfoGraph,
      coverage,
      protectedAreas,
      PAArea,
      strategicEcosistems,
      SEArea,
    } = this.state;

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
            description="resume la información de los ecosistemas presentes en el área seleccionada, y su distribución al interior de áreas protegidas y ecosistemas estratégicos. Nota: Aquellos valores inferiores al 1% no son representados en las gráficas."
            className="graphinfo2"
            tooltip="¿Qué significa?"
            customButton
          />
        )}
        <div className="graphcontainer pt5">
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
            <b>{`${numberWithCommas(PAArea)} ha `}</b>
          </h4>
          <h5>
            {`${getPercentage(PAArea, generalArea)} %`}
          </h5>
          <div className="graficaeco">
            <h6>
              Distribución en área protegida:
            </h6>
            <GraphLoader
              graphType="SmallBarStackGraph"
              data={protectedAreas}
              units="ha"
              colors={matchColor('pa')}
            />
          </div>
          <div className="ecoest">
            <h4 className="minus20">
              Ecosistemas estratégicos
              <b>{`${numberWithCommas(SEArea)} ha`}</b>
            </h4>
            <h5 className="minusperc">{`${getPercentage(SEArea, generalArea)} %`}</h5>
            {this.displaySE(strategicEcosistems, SEArea)}
          </div>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  generalArea: PropTypes.number,
};

Overview.defaultProps = {
  generalArea: 0,
};

export default Overview;

Overview.contextType = SearchContext;
