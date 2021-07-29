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
// import mappoint2 from 'images/mappoint2.png';

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
    region_observed: 'Max. observado región biótica',
    region_inferred: 'Max. inferido región biótica',
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
              area: Math.max(limits.max_inferred, limits.max_observed),
              region: Math.max(groupVal.region_observed, groupVal.region_inferred),
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
        this.setState({ data, maximumValues: nationalMax, message: null });
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
          >
            {getLabel('inferred', areaId)}
          </TextLegend>
          <TextLegend
            orientation="row"
            color={matchColor('richnessNos')('observed')}
            image={mappoint}
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
                      <Icon image={biomodelos} image2={biomodelos2} />
                    </a>
                    {/* <a href="http://i2d.humboldt.org.co/visor-I2D/" target="_blank" rel="noopener noreferrer">
                      <Icon image={mappoint} image2={mappoint2} />
                    </a> */}
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
