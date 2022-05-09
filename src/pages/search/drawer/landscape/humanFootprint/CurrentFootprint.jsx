import React from 'react';

import InfoIcon from '@mui/icons-material/Info';

import SearchContext from 'pages/search/SearchContext';
import {
  currentHFText,
  currentHFQuote,
  currentHFMeta,
  currentHFConsiderations,
} from 'pages/search/drawer/landscape/InfoTexts';
import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import TextBoxes from 'components/TextBoxes';

class CurrentFootprint extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: true,
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
      switchLayer,
    } = this.context;

    switchLayer('hfCurrent');

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
            hfCurrent: res.map((item) => ({
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
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const {
      handlerClickOnGraph,
    } = this.context;
    const {
      hfCurrent,
      hfCurrentValue,
      hfCurrentCategory,
      showInfoGraph,
    } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={currentHFText}
            className="graphinfo2"
            collapseButton={false}
          />
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
            onClickGraphHandler={(selected) => handlerClickOnGraph({ selectedKey: selected })}
          />
        </div>
        <TextBoxes
          consText={currentHFConsiderations}
          metaText={currentHFMeta}
          quoteText={currentHFQuote}
          downloadData={hfCurrent}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
      </div>
    );
  }
}

export default CurrentFootprint;

CurrentFootprint.contextType = SearchContext;
