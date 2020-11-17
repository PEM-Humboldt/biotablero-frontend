import InfoIcon from '@material-ui/icons/Info';
import React from 'react';

import { currentHFText } from '../assets/info_texts';
import { IconTooltip } from '../../commons/tooltips';
import GraphLoader from '../../charts/GraphLoader';
import matchColor from '../../commons/matchColor';
import RestAPI from '../../api/RestAPI';
import SearchContext from '../../SearchContext';
import ShortInfo from '../../commons/ShortInfo';

class CurrentFootprint extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      hfCurrent: [],
      hfCurrentValue: '0',
      hfCurrentCategory: '',
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;

    RestAPI.requestCurrentHFValue(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            hfCurrentValue: Number(res.value).toFixed(2),
            hfCurrentCategory: res.category,
          });
        }
      })
      .catch(() => {});
    RestAPI.requestCurrentHFCategories(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            hfCurrent: res.map(item => ({
              ...item,
              label: `${item.key[0].toUpperCase()}${item.key.slice(1)}`,
            })),
          });
        }
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
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const { handlerClickOnGraph } = this.context;
    const {
      hfCurrent,
      hfCurrentValue,
      hfCurrentCategory,
      showInfoGraph,
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
          <div
            className="graphinfo"
            onClick={() => this.toggleInfoGraph()}
            onKeyPress={() => this.toggleInfoGraph()}
            role="button"
            tabIndex="0"
          />
        </h2>
        {(
          showInfoGraph && (
            <ShortInfo
              description={currentHFText}
              className="graphinfo2"
              collapseButton={false}
            />
          )
        )}
        <div>
          <h6>
            Huella humana promedio · 2018
          </h6>
          <h5 style={{ backgroundColor: matchColor('hfCurrent')(hfCurrentCategory) }}>
            {hfCurrentValue}
          </h5>
        </div>
        <h6>
          Natural, Baja, Media y Alta
        </h6>
        <div>
          <GraphLoader
            graphType="LargeBarStackGraph"
            data={hfCurrent}
            labelX="Hectáreas"
            labelY="Huella Humana Actual"
            units="ha"
            colors={matchColor('hfCurrent')}
            padding={0.25}
            onClickGraphHandler={handlerClickOnGraph}
          />
        </div>
      </div>
    );
  }
}

export default CurrentFootprint;

CurrentFootprint.contextType = SearchContext;
