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
import biomodelos2 from 'images/biomodelos2.png';
import mappoint2 from 'images/mappoint2.png';

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
    total: 'TOTAL',
    endemic: 'ENDÉMICAS',
    invasive: 'INVASORAS',
    threatened: 'AMENAZADAS',
    inferred: 'Inferido (BioModelos)',
    observed: 'Observado (visor I2D)',
    min_inferred: `Min. inferido ${areaLbl} de la R.B.`,
    min_observed: `Min. observado ${areaLbl} de la R.B.`,
    max_inferred: `Max. inferido ${areaLbl} de la R.B.`,
    max_observed: `Max. observado ${areaLbl} de la R.B.`,
    region_observed: 'Observado región biótica',
    region_inferred: 'Inferido región biótica',
    area: 'Área de consulta',
    region: 'Región biótica (R.B.)',
  }[key];
};

class NumberOfSpecies extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      data: [],
      allData: [],
      message: 'loading',
      selected: 'total',
      maximumValues: [],
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
      RestAPI.requestNSNationalMax(areaId, 'all'),
    ])
      .then(([values, thresholds, nationalMax]) => {
        const data = [];
        values.forEach((groupVal) => {
          const { id, ...limits } = thresholds.find((e) => e.id === groupVal.id);
          data.push({
            id: groupVal.id,
            ranges: {
              area: {
                max: Math.max(limits.max_inferred, limits.max_observed),
                max_inferred: limits.max_inferred,
                max_observed: limits.max_observed,
              },
              region: {
                max: Math.max(groupVal.region_observed, groupVal.region_inferred),
                region_observed: groupVal.region_observed,
                region_inferred: groupVal.region_inferred,
              },
            },
            markers: {
              inferred: groupVal.inferred,
              observed: groupVal.observed,
            },
            measures: {
              ...limits,
              region_inferred: groupVal.region_inferred,
              region_observed: groupVal.region_observed,
            },
            title: '',
          });
        });
        this.setState({
          data: data.map((group) => ({
            ...group,
            ranges: {
              area: group.ranges.area.max,
              region: group.ranges.region.max,
            },
          })),
          allData: data,
          maximumValues: nationalMax,
          message: null,
        });
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

  /**
   * Filter data by the given category
   *
   * @param {String} category category to filter by
   * @returns void
   */
  filter = (category) => () => {
    const { allData } = this.state;
    const newData = allData.map((group) => {
      const regex = new RegExp(`${category}$`);
      const measureKeys = Object.keys(group.measures).filter((key) => regex.test(key));
      const areaKey = Object.keys(group.ranges.area).filter((key) => regex.test(key));
      const regionKey = Object.keys(group.ranges.region).filter((key) => regex.test(key));
      return {
        id: group.id,
        markers: {
          [category]: group.markers[category],
        },
        measures: measureKeys.reduce(
          (result, key) => ({ ...result, [key]: group.measures[key] }),
          {},
        ),
        ranges: {
          area: group.ranges.area[areaKey],
          region: group.ranges.region[regionKey],
        },
      };
    });
    this.setState({ data: newData });
  }

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
      maximumValues,
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
            color={matchColor('richnessNos')('inferred')}
            image={biomodelos}
            hoverImage={biomodelos2}
            onClick={this.filter('inferred')}
          >
            {getLabel('inferred', areaId)}
          </TextLegend>
          <TextLegend
            orientation="row"
            color={matchColor('richnessNos')('observed')}
            image={mappoint}
            hoverImage={mappoint2}
            onClick={this.filter('observed')}
          >
            {getLabel('observed', areaId)}
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
                <div>
                  {getLabel(bar.id)}
                </div>
                <div className="numberSP">
                  <div>
                    {'Max. inferido nacional: '}
                    <b>
                      {maximumValues.find((e) => e.id === bar.id).max_inferred}
                    </b>
                    <br />
                    {'Max. observado nacional: '}
                    <b>
                      {maximumValues.find((e) => e.id === bar.id).max_observed}
                    </b>
                  </div>
                  <div>
                    <a href="http://biomodelos.humboldt.org.co" target="_blank" rel="noopener noreferrer">
                      <Icon image={biomodelos} hoverImage={biomodelos2} />
                    </a>
                    {/* TODO: Add I2D link when it's ready (import mappoint2 image) */}
                  </div>
                </div>
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
          {data[0] && Object.keys(data[0].ranges).map((key) => (
            <LineLegend
              orientation="column"
              color={matchColor('richnessNos')(key)}
              key={key}
            >
              {getLabel(key, areaId)}
            </LineLegend>

          ))}
          {data[0] && Object.keys(data[0].measures)
            .sort((first, second) => {
              if (/inferred$/.test(first)) return 0;
              if (/inferred$/.test(second)) return 1;
              if (/^min/.test(first)) return 0;
              if (/^max/.test(first)) return 0;
              return 1;
            })
            .map((key) => (
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
