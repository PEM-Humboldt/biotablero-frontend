import React from 'react';
import PropTypes from 'prop-types';

import InfoIcon from '@mui/icons-material/Info';

import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import TextBoxes from 'components/TextBoxes';
import {
  transformPAValues,
  transformCoverageValues,
  transformSEAreas,
} from 'pages/search/utils/transformData';
import EcosystemsBox from 'pages/search/drawer/strategicEcosystems/EcosystemsBox';
import SearchContext from 'pages/search/SearchContext';
import formatNumber from 'utils/format';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';

/**
 * Calculate percentage for a given value according to total
 *
 * @param {number} part value for the given part
 * @param {number} total value obtained by adding all parts
 * @returns {number} percentage associated to each part
 */
const getPercentage = (part, total) => ((part * 100) / total).toFixed(2);

class StrategicEcosystems extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoMain: false,
      infoShown: new Set(),
      coverage: [],
      PAAreas: [],
      PATotalArea: 0,
      SEAreas: [],
      SETotalArea: 0,
      activeSE: null,
      messages: {
        cov: 'loading',
        pa: 'loading',
        se: 'loading',
      },
      texts: {
        ecosystems: {},
        coverage: {},
        pa: {},
        se: {},
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;
    const { generalArea } = this.props;

    switchLayer('coverages');

    RestAPI.requestCoverage(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState((prev) => ({
            coverage: transformCoverageValues(res),
            messages: {
              ...prev.messages,
              cov: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            cov: 'no-data',
          },
        }));
      });

    RestAPI.requestProtectedAreas(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          if (Array.isArray(res) && res[0]) {
            const PATotalArea = res.map((i) => i.area).reduce((prev, next) => prev + next);
            const PAAreas = transformPAValues(res, generalArea);
            this.setState((prev) => ({
              PAAreas,
              PATotalArea,
              messages: {
                ...prev.messages,
                pa: null,
              },
            }));
          }
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            pa: 'no-data',
          },
        }));
      });

    RestAPI.requestStrategicEcosystems(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          if (Array.isArray(res)) {
            const SETotal = res.find((obj) => obj.type === 'Total');
            const SETotalArea = SETotal ? SETotal.area : 0;
            const SEAreas = res.slice(1);
            this.setState((prev) => ({
              SEAreas,
              SETotalArea,
              messages: {
                ...prev.messages,
                se: null,
              },
            }));
          }
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            se: 'no-data',
          },
        }));
      });

      ['ecosystems', 'coverage', 'pa', 'se'].forEach((item) => {
        RestAPI.requestSectionTexts(item)
        .then((res) => {
          if (this.mounted) {
            this.setState((prevState) => ({
              texts: { ...prevState.texts, [item]: res },
            }));
          }
        })
        .catch(() => {
          this.setState((prevState) => ({
            texts: { ...prevState.texts, [item]: {} },
          }));
        });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  toggleInfoGeneral = () => {
    this.setState((prevState) => ({
      showInfoMain: !prevState.showInfoMain,
    }));
  }

  toggleInfo = (value) => {
    this.setState((prev) => {
      const newState = prev;
      if (prev.infoShown.has(value)) {
        newState.infoShown.delete(value);
        return newState;
      }
      newState.infoShown.add(value);
      return newState;
    });
  }

  /**
   * Returns the component EcosystemsBox that contains the list of strategic ecosystems
   * @param {Array} SEAreas area of each strategic ecosystem
   * @param {Number} SETotalArea total area of all strategic ecosystems
   *
   * @returns {node} Component to be rendered
   */
  renderEcosystemsBox = (SEAreas, SETotalArea) => {
    const { generalArea } = this.props;
    const { activeSE, messages: { se } } = this.state;
    if (se === 'loading') return ('Cargando...');
    if (se === 'no-data') return ('No hay información de áreas protegidas en el área de consulta');
    if (generalArea !== 0) {
      return (
        <EcosystemsBox
          SETotalArea={Number(SETotalArea)}
          SEAreas={transformSEAreas(SEAreas, generalArea)}
          activeSE={activeSE}
          setActiveSE={this.switchActiveSE}
        />
      );
    }
    return null;
  };

  /**
   * Set active strategic ecosystem graph
   *
   * @param {String} se selected strategic ecosystem
   */
  switchActiveSE = (se) => {
    const { switchLayer } = this.context;
    this.setState((prevState) => {
      const newState = prevState;
      if (prevState.activeSE !== se && se !== null) {
        newState.activeSE = se;
      } else {
        newState.activeSE = null;
        switchLayer('coverages');
      }
      return newState;
    });
  }

  render() {
    const { generalArea } = this.props;
    const {
      showInfoMain,
      infoShown,
      coverage,
      PAAreas,
      PATotalArea,
      SEAreas,
      SETotalArea,
      activeSE,
      messages: { cov, pa },
      texts,
    } = this.state;
    const {
      areaId,
      geofenceId,
      handlerClickOnGraph,
    } = this.context;
    return (
      <div className="graphcard">
        <h2>
          <IconTooltip title="¿Cómo interpretar las gráficas?">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGeneral()}
            />
          </IconTooltip>
        </h2>
        {showInfoMain && (
          <ShortInfo
            description={texts.ecosystems.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div className="graphcontainer pt5">
          <button
            onClick={() => {
                if (activeSE !== null) {
                  this.switchActiveSE(null);
                }
              }}
            type="button"
            className="tittlebtn"
          >
            <h4>
              Cobertura
            </h4>
          </button>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${infoShown.has('coverage') ? ' activeBox' : ''}`}
              onClick={() => this.toggleInfo('coverage')}
            />
          </IconTooltip>
          {infoShown.has('coverage') && (
            <ShortInfo
              description={texts.coverage.info}
              className="graphinfo3"
              collapseButton={false}
            />
          )}
          <h6>
            Natural, Secundaria y Transformada:
          </h6>
          <div className="graficaeco">
            <div className="svgPointer">
              <GraphLoader
                graphType="SmallBarStackGraph"
                data={coverage}
                message={cov}
                units="ha"
                colors={matchColor('coverage')}
                onClickGraphHandler={(selected) => {
                  handlerClickOnGraph({ chartType: 'coverage', selectedKey: selected });
                }}
              />
            </div>
          </div>
          <TextBoxes
            downloadData={coverage}
            downloadName={`eco_coverages_${areaId}_${geofenceId}.csv`}
            quoteText={texts.coverage.quote}
            metoText={texts.coverage.meto}
            consText={texts.coverage.cons}
            toggleInfo={() => this.toggleInfo('coverage')}
            isInfoOpen={infoShown.has('coverage')}
          />
          <h4>
            Áreas protegidas
            <b>{`${formatNumber(PATotalArea, 0)} ha `}</b>
          </h4>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${infoShown.has('pa') ? ' activeBox' : ''}`}
              onClick={() => this.toggleInfo('pa')}
            />
          </IconTooltip>
          <h5>
            {`${getPercentage(PATotalArea, generalArea)} %`}
          </h5>
          {infoShown.has('pa') && (
            <ShortInfo
              description={texts.pa.info}
              className="graphinfo3"
              collapseButton={false}
            />
          )}
          <div className="graficaeco">
            <h6>
              Distribución por áreas protegidas:
            </h6>
            <GraphLoader
              graphType="SmallBarStackGraph"
              data={PAAreas}
              message={pa}
              units="ha"
              colors={matchColor('pa', true)}
            />
          </div>
          <TextBoxes
            downloadData={PAAreas}
            downloadName={`eco_protected_areas_${areaId}_${geofenceId}.csv`}
            quoteText={texts.pa.quote}
            metoText={texts.pa.meto}
            consText={texts.pa.cons}
            toggleInfo={() => this.toggleInfo('pa')}
            isInfoOpen={infoShown.has('pa')}
          />
          <div className="ecoest">
            <h4 className="minus20">
              Ecosistemas estratégicos
              <b>{`${formatNumber(SETotalArea, 0)} ha`}</b>
            </h4>
            <IconTooltip title="Interpretación">
              <InfoIcon
                className={`downSpecial2${infoShown.has('se') ? ' activeBox' : ''}`}
                onClick={() => this.toggleInfo('se')}
              />
            </IconTooltip>
            <h5 className="minusperc">
              {`${getPercentage(SETotalArea, generalArea)} %`}
            </h5>
            {infoShown.has('se') && (
              <ShortInfo
                description={texts.se.info}
                className="graphinfo3"
                collapseButton={false}
              />
            )}
            {this.renderEcosystemsBox(SEAreas, SETotalArea)}
            <TextBoxes
              downloadData={SEAreas}
              downloadName={`eco_strategic_ecosystems_${areaId}_${geofenceId}.csv`}
              quoteText={texts.se.quote}
              metoText={texts.se.meto}
              consText={texts.se.cons}
              toggleInfo={() => this.toggleInfo('se')}
              isInfoOpen={infoShown.has('se')}
            />
          </div>
        </div>
      </div>
    );
  }
}

StrategicEcosystems.propTypes = {
  generalArea: PropTypes.number,
};

StrategicEcosystems.defaultProps = {
  generalArea: 0,
};

export default StrategicEcosystems;

StrategicEcosystems.contextType = SearchContext;
