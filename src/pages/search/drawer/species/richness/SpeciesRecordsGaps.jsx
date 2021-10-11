import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { IconTooltip } from 'components/Tooltips';
import GraphLoader from 'components/charts/GraphLoader';
import { LineLegend } from 'components/CssLegends';
import matchColor from 'utils/matchColor';
import ShortInfo from 'components/ShortInfo';
import SearchContext from 'pages/search/SearchContext';
import RestAPI from 'utils/restAPI';

const areaTypeName = (areaType) => {
  switch (areaType) {
    case 'states':
      return 'departamentos';
    case 'pa':
      return 'áreas de manejo especial';
    case 'ea':
      return 'jurisdicciones ambientales';
    case 'basinSubzones':
      return 'subzonas hidrográficas';
    default:
      return 'cerca';
  }
};

const getLabelGaps = (key, areaType) => ({
  value: 'Promedio de vacios en el área de consulta',
  min: 'Mínimo del área de consulta',
  max: 'Máximo del área de consulta',
  min_region: 'Mínimo por región biótica',
  max_region: 'Máximo por región biótica',
  min_threshold: `Mínimo por ${areaTypeName(areaType)}`,
  max_threshold: `Máximo por ${areaTypeName(areaType)}`,
}[key]
);

const getLabelConcentration = (key) => ({
  min: 'Mínimo del área de consulta',
  max: 'Máximo del área de consulta',
  min_region: 'Mínimo por región biótica',
  max_region: 'Máximo por región biótica',
  min_threshold: 'Mínimo nacional',
  max_threshold: 'Máximo nacional',
  value: 'Promedio de representación en el área de consulta',
}[key]
);

class SpeciesRecordsGaps extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      gaps: {},
      concentration: {},
      messageGaps: 'loading',
      messageConc: 'loading',
      selected: 'gaps',
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;

    RestAPI.requestGaps(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            gaps: this.transformData(res),
            messageGaps: null,
          });
        }
      })
      .catch(() => {
        this.setState({ messageGaps: 'no-data' });
      });

    RestAPI.requestConcentration(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            concentration: this.transformData(res),
            messageConc: null,
          });
        }
      })
      .catch(() => {
        this.setState({ messageConc: 'no-data' });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Transform data structure to be passed to graph component as a prop
   *
   * @param {Object} rawData raw data from RestAPI
   */
   transformData = (rawData) => {
    const { id, avg, ...limits } = rawData[0];
    Object.keys(limits).forEach((key) => {
      Object.defineProperty(limits, key, { value: Math.round(limits[key] * 100) });
    });
    return {
      id,
      ranges: {
        area: Math.max(limits.max, limits.max_threshold, limits.max_region),
      },
      markers: {
        value: avg * 100,
      },
      measures: limits,
      title: '',
    };
  };

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const { areaId } = this.context;
    const {
      showInfoGraph,
      messageGaps,
      messageConc,
      gaps,
      concentration,
      selected,
    } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Acerca de esta sección">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {(
          showInfoGraph && (
          <ShortInfo
            name="Vacios"
            description="Vacios"
            className="graphinfo2"
            collapseButton={false}
          />
          )
        )}
        <div className={`nos-title${selected === 'gaps' ? ' selected' : ''}`}>
          Vacios de datos
        </div>
        <div>
          <GraphLoader
            message={messageGaps}
            data={gaps}
            graphType="singleBullet"
            colors={matchColor('richnessGaps')}
            onClickGraphHandler={() => { this.setState({ selected: 'gaps' }); }}
            reverse
            labelXLeft="Pocos datos"
            labelXRight="Muchos datos"
          />
        </div>
        <div className="richnessLegend">
          {messageGaps === null && gaps.measures && Object.keys(gaps.measures).map((key) => (
            <LineLegend
              orientation="column"
              color={matchColor('richnessGaps')(key)}
              key={key}
            >
              {getLabelGaps(key, areaId)}
            </LineLegend>

          ))}
          {messageGaps === null && (
            <LineLegend
              orientation="column"
              color={matchColor('richnessGaps')('value')}
              key="value"
            >
              {getLabelGaps('value', areaId)}
            </LineLegend>
          )}
        </div>
        <br />
        <div className={`nos-title${selected === 'concentration' ? ' selected' : ''}`}>
          Concentración de registros
          <br />
          <b>5 km x 5 km</b>
        </div>
        <div>
          <GraphLoader
            message={messageConc}
            data={concentration}
            graphType="singleBullet"
            colors={matchColor('richnessGaps')}
            onClickGraphHandler={() => { this.setState({ selected: 'concentration' }); }}
            labelXLeft="Poco representado"
            labelXRight="Bien representado"
          />
        </div>
        <div className="richnessLegend">
          {concentration.measures && Object.keys(concentration.measures).map((key) => (
            <LineLegend
              orientation="column"
              color={matchColor('richnessGaps')(key)}
              key={key}
            >
              {getLabelConcentration(key, areaId)}
            </LineLegend>

          ))}
          <LineLegend
            orientation="column"
            color={matchColor('richnessGaps')('value')}
            key="value"
          >
            {getLabelConcentration('value', areaId)}
          </LineLegend>
        </div>
      </div>
    );
  }
}

export default SpeciesRecordsGaps;

SpeciesRecordsGaps.contextType = SearchContext;
