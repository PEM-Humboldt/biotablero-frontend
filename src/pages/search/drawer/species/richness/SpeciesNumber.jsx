import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { IconTooltip } from 'components/Tooltips';
import GraphLoader from 'components/charts/GraphLoader';
import { LegendColor } from 'components/CssLegends';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import SearchContext from 'pages/search/SearchContext';
import ShortInfo from 'components/ShortInfo';

const getLabel = {
  total: 'Riqueza Total',
  endemic: 'Riqueza Endémicas',
  invasive: 'Riqueza Invasoras',
  threatened: 'Riqueza Amenazadas',
  inferred: 'Inferida (BioModelos)',
  observed: 'Observada (visor I2D)',
  min_inferred: 'Mínima Inferida relativa a la cerca',
  min_observed: 'Mínima Observada relativa a la cerca',
  max_inferred: 'Máxima Inferida relativa a la cerca',
  max_observed: 'Máxima Observada relativa a la cerca',
};

class SpeciesNumber extends React.Component {
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
              region: groupVal.region,
            },
            markers: {
              inferred: groupVal.inferred,
              observed: groupVal.observed,
            },
            measures: limits,
            title: getLabel[groupVal.id],
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
          <LegendColor orientation="row" color={matchColor('richness')('observed')}>
            {getLabel.observed}
          </LegendColor>
          <LegendColor orientation="row" color={matchColor('richness')('inferred')}>
            {getLabel.inferred}
          </LegendColor>
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
          <LegendColor orientation="row" color={matchColor('richness')('min_observed')}>
            {getLabel.min_observed}
          </LegendColor>
          <LegendColor orientation="row" color={matchColor('richness')('min_inferred')}>
            {getLabel.min_inferred}
          </LegendColor>
          <LegendColor orientation="row" color={matchColor('richness')('max_observed')}>
            {getLabel.max_observed}
          </LegendColor>
          <LegendColor orientation="row" color={matchColor('richness')('max_inferred')}>
            {getLabel.max_inferred}
          </LegendColor>
        </div>
      </div>
    );
  }
}

export default SpeciesNumber;

SpeciesNumber.contextType = SearchContext;
