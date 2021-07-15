import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { IconTooltip } from 'components/Tooltips';
import GraphLoader from 'components/charts/GraphLoader';
import Icon from 'components/CssIcons';
import { LineLegend, TextLegend } from 'components/CssLegends';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import SearchContext from 'pages/search/SearchContext';
import ShortInfo from 'components/ShortInfo';

import biomodelos from 'images/biomodelos.png';
import mappoint from 'images/mappoint.png';

const getLabel = (key, area) => {
  let areaLbl = 'cerca';
  switch (area) {
    case 'states':
      areaLbl = 'departamentos';
      break;
    case 'pa':
      areaLbl = 'áreas de manejo especial';
      break;
    case 'ea':
      areaLbl = 'jurisdicciones ambientales';
      break;
    case 'basinSubzones':
      areaLbl = 'subzonas hidrográficas';
      break;
    default:
    break;
  }

  return {
    total: 'Total',
    endemic: 'Endémicas',
    invasive: 'Invasoras',
    threatened: 'Amenazadas',
    inferred: 'Inferido (BioModelos)',
    observed: 'Observado (visor I2D)',
    min_inferred: `Mínimo inferido por ${areaLbl}`,
    min_observed: `Mínimo observado por ${areaLbl}`,
    max_inferred: `Máximo inferido por ${areaLbl}`,
    max_observed: `Máximo observado por ${areaLbl}`,
    region_observed: 'Máximo observado por región biótica',
    region_inferred: 'Máximo inferido por región biótica',
  }[key];
};

class NumberOfSpecies extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      data: [],
      message: 'loading',
      selected: 'total',
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;

    Promise.all([
      RestAPI.requestNumberOfSpecies(areaId, geofenceId, 'all'),
      RestAPI.requestNSThresholds(areaId, geofenceId, 'all'),
    ])
      .then(([values, thresholds]) => {
        const data = [];
        values.forEach((groupVal) => {
          const { id, ...limits } = thresholds.find((e) => e.id === groupVal.id);
          data.push({
            id: groupVal.id,
            ranges: {
              area: Math.max(limits.max_inferred, limits.max_observed),
              region: Math.max(groupVal.region_observed, groupVal.region_inferred),
            },
            markers: {
              inferred: groupVal.inferred,
              observed: groupVal.observed,
            },
            measures: {
              ...limits,
              region_observed: groupVal.region_observed,
              region_inferred: groupVal.region_inferred,
            },
            title: '',
          });
        });
        this.setState({ data, message: null });
      })
      .catch(() => {
        this.setState({ message: 'no-data' });
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
    const {
      areaId,
      handlerClickOnGraph,
    } = this.context;
    const {
      showInfoGraph,
      message,
      data,
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
            name="Número de especies"
            description="Número de especies"
            className="graphinfo2"
            collapseButton={false}
          />
          )
        )}
        <h3>Haga click en la barra para visualizar su mapa</h3>
        <div className="nos-title legend">
          <TextLegend
            orientation="row"
            color={matchColor('richnessNos')('observed')}
            image={mappoint}
          >
            {getLabel('observed', areaId)}
          </TextLegend>
          <TextLegend
            orientation="row"
            color={matchColor('richnessNos')('inferred')}
            image={biomodelos}
          >
            {getLabel('inferred', areaId)}
          </TextLegend>
        </div>
        <div>
          {message === 'no-data' && (
            <GraphLoader
              message={message}
              data={[]}
              graphType="singleBullet"
            />
          )}
          {data.map((bar) => (
            <div key={bar.id}>
              <div
                className={`nos-title${bar.id === selected ? ' selected' : ''}`}
              >
                {getLabel(bar.id)}
                <Icon image={biomodelos} />
                <Icon image={mappoint} />
              </div>
              <div className="svgPointer">
                <GraphLoader
                  message={message}
                  data={bar}
                  graphType="singleBullet"
                  colors={matchColor('richnessNos')}
                  onClickGraphHandler={() => {
                    this.setState({ selected: bar.id });
                    handlerClickOnGraph({
                      chartType: 'numberOfSpecies',
                      chartSection: bar.id,
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="richnessLegend">
          {data[0] && Object.keys(data[0].measures).map((key) => (
            <LineLegend
              orientation="column"
              color={matchColor('richnessNos')(key)}
              key={key}
            >
              {getLabel(key, areaId)}
            </LineLegend>

          ))}
        </div>
      </div>
    );
  }
}

export default NumberOfSpecies;

NumberOfSpecies.contextType = SearchContext;
