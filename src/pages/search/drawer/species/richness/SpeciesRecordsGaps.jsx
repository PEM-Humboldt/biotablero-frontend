import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { IconTooltip } from 'components/Tooltips';
import GraphLoader from 'components/charts/GraphLoader';
import { LineLegend } from 'components/CssLegends';
import matchColor from 'utils/matchColor';
import ShortInfo from 'components/ShortInfo';
import SearchContext from 'pages/search/SearchContext';

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
  min_threshold: `Mínimo por ${areaTypeName(areaType)}`,
  max_threshold: `Máximo por ${areaTypeName(areaType)}`,
}[key]
);

const getLabelConcentration = (key) => ({
  min: 'Mínimo del área de consulta',
  max: 'Máximo del área de consulta',
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
      message: 'loading',
      selected: 'gaps',
    };
  }

  componentDidMount() {
    this.mounted = true;

    const gapsValues = {
      id: 'gaps',
      avg: 0.34,
      min: 0.4,
      max: 0.8,
      min_threshold: 0.15,
      max_threshold: 0.95,
    };

    const concentrationValues = {
      id: 'concentration',
      avg: 0.3,
      min: 0.2,
      max: 0.6,
      min_threshold: 0.1,
      max_threshold: 1,
    };

    [gapsValues, concentrationValues].forEach((item) => {
      const { id, avg, ...limits } = item;
      const object = {
        id,
        ranges: {
          area: Math.max(limits.max, limits.max_threshold),
        },
        markers: {
          value: avg,
        },
        measures: limits,
        title: '',
      };
      this.setState({ [id]: object, message: null });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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
      message,
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
            message={message}
            data={gaps}
            graphType="singleBullet"
            colors={matchColor('gaps')}
            onClickGraphHandler={() => { this.setState({ selected: 'gaps' }); }}
            reverse
          />
        </div>
        <div className="richnessLegend">
          {gaps.measures && Object.keys(gaps.measures).map((key) => (
            <LineLegend
              orientation="column"
              color={matchColor('gaps')(key)}
              key={key}
            >
              {getLabelGaps(key, areaId)}
            </LineLegend>

          ))}
          <LineLegend
            orientation="column"
            color={matchColor('gaps')('value')}
            key="value"
          >
            {getLabelGaps('value', areaId)}
          </LineLegend>
        </div>
        <br />
        <div className={`nos-title${selected === 'concentration' ? ' selected' : ''}`}>
          Concentración de registros 5 km x 5 km
        </div>
        <div>
          <GraphLoader
            message={message}
            data={concentration}
            graphType="singleBullet"
            colors={matchColor('gaps')}
            onClickGraphHandler={() => { this.setState({ selected: 'concentration' }); }}
          />
        </div>
        <div className="richnessLegend">
          {concentration.measures && Object.keys(concentration.measures).map((key) => (
            <LineLegend
              orientation="column"
              color={matchColor('gaps')(key)}
              key={key}
            >
              {getLabelConcentration(key, areaId)}
            </LineLegend>

          ))}
          <LineLegend
            orientation="column"
            color={matchColor('gaps')('value')}
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
