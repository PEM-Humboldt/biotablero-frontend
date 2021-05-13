import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { IconTooltip } from 'components/Tooltips';
import GraphLoader from 'components/charts/GraphLoader';
import { LineLegend, TextLegend } from 'components/CssLegends';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import SearchContext from 'pages/search/SearchContext';
import ShortInfo from 'components/ShortInfo';

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
      RestAPI.requestNSThresholds(areaId, 'all'),
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
            title: getLabel(groupVal.id),
          });
        });
        this.setState({ data, message: null });
      })
      .catch(() => {});
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
      data,
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
            name="Integridad"
            description="Integridad"
            className="graphinfo2"
            collapseButton={false}
          />
          )
        )}
        <div className="richnessLegend">
          <TextLegend orientation="row" color={matchColor('richness')('observed')}>
            {getLabel('observed', areaId)}
          </TextLegend>
          <TextLegend orientation="row" color={matchColor('richness')('inferred')}>
            {getLabel('inferred', areaId)}
          </TextLegend>
        </div>
        <div>
          {data.map((bar) => (
            <GraphLoader
              message={message}
              data={bar}
              graphType="singleBullet"
              key={bar.id}
              colors={matchColor('richness')}
            />
          ))}
        </div>
        <div className="richnessLegend">
          {data[0] && Object.keys(data[0].measures).map((key) => (
            <LineLegend
              orientation="column"
              color={matchColor('richness')(key)}
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
