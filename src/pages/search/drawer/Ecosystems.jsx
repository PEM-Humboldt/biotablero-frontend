import InfoIcon from '@mui/icons-material/Info';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PropTypes from 'prop-types';
import React from 'react';

import {
  sectionInfo,
  CoverageText,
  coverageMeta,
  coverageCons,
  coverageQuote,
  PAText,
  PACons,
  PAQuote,
  PAMeta,
  SEText,
  SEQuote,
  SEMeta,
  SECons,
} from 'pages/search/drawer/strategicEcosystems/InfoTexts';
import {
  transformPAValues,
  transformCoverageValues,
  transformSEAreas,
} from 'pages/search/utils/transformData';
import EcosystemsBox from 'pages/search/drawer/strategicEcosystems/EcosystemsBox';
import SearchContext from 'pages/search/SearchContext';
import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import DownloadCSV from 'components/DownloadCSV';
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
      showInfoGraph: false,
      showInfoMain: false,
      showQuoteGraph: false,
      showMetaGraph: false,
      showConsGraph: false,
      showInfoPA: false,
      showQuotePA: false,
      showMetaPA: false,
      showConsPA: false,
      showInfoSE: false,
      showQuoteSE: false,
      showMetaSE: false,
      showConsSE: false,
      coverage: [],
      PAAreas: [],
      PATotalArea: 0,
      SEAreas: [],
      SETotalArea: 0,
      loadingSE: true,
      activeSE: null,
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
          this.setState({ coverage: transformCoverageValues(res) });
        }
      })
      .catch(() => {});

    RestAPI.requestProtectedAreas(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          if (Array.isArray(res) && res[0]) {
            const PATotalArea = res.map((i) => i.area).reduce((prev, next) => prev + next);
            const PAAreas = transformPAValues(res, generalArea);
            this.setState({ PAAreas, PATotalArea });
          }
        }
      })
      .catch(() => {});

    RestAPI.requestStrategicEcosystems(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          if (Array.isArray(res)) {
            const SETotal = res.find((obj) => obj.type === 'Total');
            const SETotalArea = SETotal ? SETotal.area : 0;
            const SEAreas = res.slice(1);
            this.setState({ SEAreas, SETotalArea });
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (this.mounted) {
          this.setState({ loadingSE: false });
        }
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

  /**
   * Show or hide the detailed information on each graph
   */
   toggleInfoGraph = () => {
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
      showQuoteGraph: false,
      showMetaGraph: false,
      showConsGraph: false,
    }));
  };

  /**
   * Show or hide the Quote information on each graph
   */
  toggleQuote = () => {
    this.setState((prevState) => ({
      showQuoteGraph: !prevState.showQuoteGraph,
      showInfoGraph: false,
      showConsGraph: false,
      showMetaGraph: false,
    }));
  };

  toggleMeta = () => {
    this.setState((prevState) => ({
      showMetaGraph: !prevState.showMetaGraph,
      showInfoGraph: false,
      showQuoteGraph: false,
      showConsGraph: false,
    }));
  };

  toggleCons = () => {
    this.setState((prevState) => ({
      showConsGraph: !prevState.showConsGraph,
      showInfoGraph: false,
      showQuoteGraph: false,
      showMetaGraph: false,
    }));
  };

  /**
   * Show or hide the detailed information on each graph PA
   */
   toggleInfoPA = () => {
    this.setState((prevState) => ({
      showInfoPA: !prevState.showInfoPA,
      showQuotePA: false,
      showMetaPA: false,
      showConsPA: false,
    }));
  };

  /**
   * Show or hide the Quote information on each graph
   */
  toggleQuotePA = () => {
    this.setState((prevState) => ({
      showQuotePA: !prevState.showQuotePA,
      showInfoPA: false,
      showConsPA: false,
      showMetaPA: false,
    }));
  };

  toggleMetaPA = () => {
    this.setState((prevState) => ({
      showMetaPA: !prevState.showMetaPA,
      showInfoPA: false,
      showQuotePA: false,
      showConsPA: false,
    }));
  };

  toggleConsPA = () => {
    this.setState((prevState) => ({
      showConsPA: !prevState.showConsPA,
      showInfoPA: false,
      showQuotePA: false,
      showMetaPA: false,
    }));
  };

    /**
   * Show or hide the detailed information on each graph SE
   */
     toggleInfoSE = () => {
      this.setState((prevState) => ({
        showInfoSE: !prevState.showInfoSE,
        showQuoteSE: false,
        showMetaSE: false,
        showConsSE: false,
      }));
    };

    /**
     * Show or hide the Quote information on each graph
     */
    toggleQuoteSE = () => {
      this.setState((prevState) => ({
        showQuoteSE: !prevState.showQuoteSE,
        showInfoSE: false,
        showConsSE: false,
        showMetaSE: false,
      }));
    };

    toggleMetaSE = () => {
      this.setState((prevState) => ({
        showMetaSE: !prevState.showMetaSE,
        showInfoSE: false,
        showQuoteSE: false,
        showConsSE: false,
      }));
    };

    toggleConsSE = () => {
      this.setState((prevState) => ({
        showConsSE: !prevState.showConsSE,
        showInfoSE: false,
        showQuoteSE: false,
        showMetaSE: false,
      }));
    };

  /**
   * Returns the component EcosystemsBox that contains the list of strategic ecosystems
   * @param {Array} SEAreas area of each strategic ecosystem
   * @param {Number} SETotalArea total area of all strategic ecosystems
   *
   * @returns {node} Component to be rendered
   */
  renderEcosystemsBox = (SEAreas, SETotalArea) => {
    const { generalArea } = this.props;
    const { loadingSE, activeSE } = this.state;
    if (loadingSE) return ('Cargando...');
    if (SEAreas.length <= 0) return ('No hay información de áreas protegidas en el área de consulta');
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
    const {
      generalArea,
    } = this.props;
    const {
      showInfoMain,
      showInfoGraph,
      showQuoteGraph,
      showMetaGraph,
      showConsGraph,
      showInfoPA,
      showQuotePA,
      showMetaPA,
      showConsPA,
      showInfoSE,
      showQuoteSE,
      showMetaSE,
      showConsSE,
      coverage,
      PAAreas,
      PATotalArea,
      SEAreas,
      SETotalArea,
      activeSE,
    } = this.state;
    const { handlerClickOnGraph } = this.context;
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
            description={sectionInfo}
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
              className="downSpecial"
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
          {(
            showInfoGraph && (
              <ShortInfo
                description={CoverageText}
                className="graphinfo3"
                collapseButton={false}
              />
            )
          )}
          <h6>
            Natural, Secundaria y Transformada:
          </h6>
          <div className="graficaeco">
            <div className="svgPointer">
              <GraphLoader
                graphType="SmallBarStackGraph"
                data={coverage}
                units="ha"
                colors={matchColor('coverage')}
                onClickGraphHandler={(selected) => {
                  handlerClickOnGraph({ chartType: 'coverage', selectedKey: selected });
                }}
              />
            </div>
          </div>
          <h3>
            <IconTooltip title="Metodología">
              <CollectionsBookmarkIcon
                className="graphinfo3"
                onClick={() => this.toggleMeta()}
              />
            </IconTooltip>
            <IconTooltip title="Autoría">
              <FormatQuoteIcon
                className="graphinfo3"
                onClick={() => this.toggleQuote()}
              />
            </IconTooltip>
            <IconTooltip title="Consideraciones">
              <AnnouncementIcon
                className="graphinfo3"
                onClick={() => this.toggleCons()}
              />
            </IconTooltip>
            <DownloadCSV
              className="downBtnSpecial"
              data={coverage}
              filename="Cobertura.csv"
            />
          </h3>
          {showQuoteGraph && (
          <ShortInfo
            description={coverageQuote}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
          {showMetaGraph && (
          <ShortInfo
            description={coverageMeta}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
          {showConsGraph && (
          <ShortInfo
            description={coverageCons}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
          <h4>
            Áreas protegidas
            <b>{`${formatNumber(PATotalArea, 0)} ha `}</b>
          </h4>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className="downSpecial"
              onClick={() => this.toggleInfoPA()}
            />
          </IconTooltip>
          <h5>
            {`${getPercentage(PATotalArea, generalArea)} %`}
          </h5>
          {(
            showInfoPA && (
              <ShortInfo
                description={PAText}
                className="graphinfo3"
                collapseButton={false}
              />
            )
          )}
          <div className="graficaeco">
            <h6>
              Distribución por áreas protegidas:
            </h6>
            <GraphLoader
              graphType="SmallBarStackGraph"
              data={PAAreas}
              units="ha"
              colors={matchColor('pa', true)}
            />
          </div>
          <h3>
            <IconTooltip title="Metodología">
              <CollectionsBookmarkIcon
                className="graphinfo3"
                onClick={() => this.toggleMetaPA()}
              />
            </IconTooltip>
            <IconTooltip title="Autoría">
              <FormatQuoteIcon
                className="graphinfo3"
                onClick={() => this.toggleQuotePA()}
              />
            </IconTooltip>
            <IconTooltip title="Consideraciones">
              <AnnouncementIcon
                className="graphinfo3"
                onClick={() => this.toggleConsPA()}
              />
            </IconTooltip>
            <DownloadCSV
              className="downBtnSpecial"
              data={PAAreas}
              filename="Areas_protegidas.csv"
            />
          </h3>
          {showQuotePA && (
          <ShortInfo
            description={PAQuote}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
          {showMetaPA && (
          <ShortInfo
            description={PAMeta}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
          {showConsPA && (
          <ShortInfo
            description={PACons}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
          <div className="ecoest">
            <h4 className="minus20">
              Ecosistemas estratégicos
              <b>{`${formatNumber(SETotalArea, 0)} ha`}</b>
            </h4>
            <IconTooltip title="Interpretación">
              <InfoIcon
                className="downSpecial2"
                onClick={() => this.toggleInfoSE()}
              />
            </IconTooltip>
            <h5 className="minusperc">
              {`${getPercentage(SETotalArea, generalArea)} %`}
            </h5>
            {(
            showInfoSE && (
              <ShortInfo
                description={SEText}
                className="graphinfo3"
                collapseButton={false}
              />
            )
          )}
            {this.renderEcosystemsBox(SEAreas, SETotalArea)}
            <h3>
              <IconTooltip title="Metodología">
                <CollectionsBookmarkIcon
                  className="graphinfo3"
                  onClick={() => this.toggleMetaSE()}
                />
              </IconTooltip>
              <IconTooltip title="Autoría">
                <FormatQuoteIcon
                  className="graphinfo3"
                  onClick={() => this.toggleQuoteSE()}
                />
              </IconTooltip>
              <IconTooltip title="Consideraciones">
                <AnnouncementIcon
                  className="graphinfo3"
                  onClick={() => this.toggleConsSE()}
                />
              </IconTooltip>
              <DownloadCSV
                className="downBtnSpecial"
                data={SEAreas}
                filename="Porcentajes_Totales_EE_en_area_de_consulta.csv"
              />
            </h3>
            {showQuoteSE && (
            <ShortInfo
              description={SEQuote}
              className="graphinfo2"
              collapseButton={false}
            />
        )}
            {showMetaSE && (
            <ShortInfo
              description={SEMeta}
              className="graphinfo2"
              collapseButton={false}
            />
        )}
            {showConsSE && (
            <ShortInfo
              description={SECons}
              className="graphinfo2"
              collapseButton={false}
            />
        )}
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
