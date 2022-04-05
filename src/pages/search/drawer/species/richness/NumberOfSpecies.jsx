import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import { IconTooltip } from 'components/Tooltips';
import GraphLoader from 'components/charts/GraphLoader';
import {
  LegendColor,
  LineLegend,
  TextLegend,
  ThickLineLegend,
} from 'components/CssLegends';
import Icon from 'components/CssIcons';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import SearchContext from 'pages/search/SearchContext';
import ShortInfo from 'components/ShortInfo';
import { NumberOfSpeciesText, NumberOfSpeciesTextHelper } from 'pages/search/drawer/species/richness/InfoTexts';

import biomodelos from 'images/biomodelos.png';
import mappoint from 'images/mappoint.png';
import biomodelos2 from 'images/biomodelos2.png';
import mappoint2 from 'images/mappoint2.png';
import biomodeloslink from 'images/biomodeloslink.png';
import biomodeloslink2 from 'images/biomodeloslink2.png';
import fullview from 'images/fullview.png';

const getLabel = (key, area, region) => {
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
    min_inferred: `Min. inferido ${areaLbl} de la región ${region}`,
    min_observed: `Min. observado ${areaLbl} de la región ${region}`,
    max_inferred: `Max. inferido ${areaLbl} de la región ${region}`,
    max_observed: `Max. observado ${areaLbl} de la región ${region}`,
    region_observed: `Observado región ${region}`,
    region_inferred: `Inferido región ${region}`,
    area: `${areaLbl.replace(/^\w/, (l) => l.toUpperCase())} de la región ${region}`,
    region: `Región ${region}`,
    inferred2: 'Inferido en el área de consulta',
    observed2: 'Observado en el área de consulta',
    national_inferred: `Max. inferido en ${areaLbl} a nivel nacional: `,
    national_observed: `Max. observado en ${areaLbl} a nivel nacional: `,
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
      filter: 'all',
      message: 'loading',
      selected: 'total',
      bioticRegion: 'Región Biótica',
      maximumValues: [],
      showErrorMessage: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    switchLayer('numberOfSpecies');

    Promise.all([
      RestAPI.requestNumberOfSpecies(areaId, geofenceId, 'all'),
      RestAPI.requestNSThresholds(areaId, geofenceId, 'all'),
      RestAPI.requestNSNationalMax(areaId, 'all'),
    ])
      .then(([values, thresholds, nationalMax]) => {
        const data = [];
        let region = null;
        let showErrorMessage = false;
        values.forEach((groupVal) => {
          if (!region) region = groupVal.region_name;
          const { id, ...limits } = thresholds.find((e) => e.id === groupVal.id);
          showErrorMessage = groupVal.inferred > groupVal.region_inferred;
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
          allData: data,
          maximumValues: nationalMax,
          message: null,
          bioticRegion: region,
          showErrorMessage,
        }, () => {
          this.filter('inferred')();
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
    const { allData, selected } = this.state;
    const { handlerClickOnGraph } = this.context;
    if (category === 'all') {
      this.setState({
        data: allData.map((group) => ({
          ...group,
          ranges: {
            area: group.ranges.area.max,
            region: group.ranges.region.max,
          },
        })),
        filter: 'all',
      });
      handlerClickOnGraph({
        chartType: 'numberOfSpecies',
        chartSection: 'all',
        selectedKey: selected,
      });
    } else {
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
      this.setState({ data: newData, filter: category });
      handlerClickOnGraph({
        chartType: 'numberOfSpecies',
        chartSection: category,
        selectedKey: selected,
      });
    }
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
      filter,
      bioticRegion,
      showErrorMessage,
    } = this.state;

    let legends = ['inferred', 'min_inferred', 'max_inferred', 'region_inferred',
    'observed', 'min_observed', 'max_observed', 'region_observed'];

    if (filter !== 'all') {
      legends = legends.filter((leg) => {
        const regex = new RegExp(`${filter}$`);
        return regex.test(leg);
      });
    }

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
            description={NumberOfSpeciesText}
            className="graphinfo2"
            collapseButton={false}
          />
          )
        )}
        {showErrorMessage && (
          <div className="disclaimer">
            La riqueza inferida del área de consulta supera la de la región biótica en algunos
            casos pues sus límites intersectan dos o más regiones bióticas.
          </div>
        )}
        <h3>
          {NumberOfSpeciesTextHelper}
        </h3>
        <div className="nos-title legend">
          <TextLegend
            className={`${filter === 'inferred' ? 'filtered' : ''}`}
            orientation="row"
            color={matchColor('richnessNos')('inferred')}
            image={biomodelos}
            hoverImage={biomodelos2}
            onClick={this.filter('inferred')}
          >
            {getLabel('inferred', areaId)}
          </TextLegend>
          <TextLegend
            className={`${filter === 'observed' ? 'filtered' : ''}`}
            orientation="row"
            color={matchColor('richnessNos')('observed')}
            image={mappoint}
            hoverImage={mappoint2}
            onClick={this.filter('observed')}
          >
            {getLabel('observed', areaId)}
          </TextLegend>
          <div
            className={`fullview-container${filter === 'all' ? ' filtered' : ''}`}
            onClick={this.filter('all')}
            onKeyPress={this.filter('all')}
            role="button"
            tabIndex={0}
          >
            <img
              className="fullview"
              src={fullview}
              alt="Ver ambos"
            />
          </div>
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
                    {(filter === 'all' || filter === 'inferred') && (
                      <>
                        {getLabel('national_inferred', areaId)}
                        <b>
                          {maximumValues.find((e) => e.id === bar.id).max_inferred}
                        </b>
                      </>
                    )}
                    {filter === 'all' && (
                      <br />
                    )}
                    {(filter === 'all' || filter === 'observed') && (
                      <>
                        {getLabel('national_observed', areaId)}
                        <b>
                          {maximumValues.find((e) => e.id === bar.id).max_observed}
                        </b>
                      </>
                    )}
                  </div>
                  {(filter === 'inferred') && (
                    <div>
                      <a href="http://biomodelos.humboldt.org.co" target="_blank" rel="noopener noreferrer">
                        <Icon image={biomodeloslink} hoverImage={biomodeloslink2} />
                      </a>
                      {/* TODO:
                      Add I2D link when it's ready (import mappointlink and mappointlink2 images)
                      */}
                    </div>
                  )}
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
                      chartSection: filter,
                      selectedKey: bar.id,
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="richnessLegend">
          {data[0] && Object.keys(data[0].ranges).map((key) => (
            <ThickLineLegend
              orientation="column"
              color={matchColor('richnessNos')(key)}
              key={key}
            >
              {getLabel(key, areaId, bioticRegion)}
            </ThickLineLegend>
          ))}
          {data[0] && legends.map((key) => {
            if (key === 'inferred' || key === 'observed') {
              return (
                <LegendColor
                  orientation="column"
                  color={matchColor('richnessNos')(key)}
                  key={key}
                  marginLeft="2px"
                  marginRight="6px"
                >
                  {getLabel(`${key}2`, areaId, bioticRegion)}
                </LegendColor>
              );
            }
            return (
              <LineLegend
                orientation="column"
                color={matchColor('richnessNos')(key)}
                key={key}
              >
                {getLabel(key, areaId, bioticRegion)}
              </LineLegend>
            );
          })}
        </div>
      </div>
    );
  }
}

export default NumberOfSpecies;

NumberOfSpecies.contextType = SearchContext;
