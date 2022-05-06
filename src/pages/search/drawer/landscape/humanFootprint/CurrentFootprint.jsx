import InfoIcon from '@mui/icons-material/Info';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import React from 'react';

import SearchContext from 'pages/search/SearchContext';
import {
 currentHFText, currentHFQuote, currentHFMeta, currentHFConsiderations,
} from 'pages/search/drawer/landscape/InfoTexts';
import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import DownloadCSV from 'components/DownloadCSV';

class CurrentFootprint extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      showQuoteGraph: false,
      showMetaGraph: false,
      showConsGraph: false,
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
      showQuoteGraph: false,
      showMetaGraph: false,
      showConsGraph: false,
    }));
  };

  /**
   * Show or hide the Quote information on each graph
   */
  toggleQuote = () => {
    this.setState((prevState) => ({
      showQuoteGraph: !prevState.showQuoteGraph,
      showInfoGraph: false,
      showConsGraph: false,
      showMetaGraph: false,
    }));
  };

  toggleMeta = () => {
    this.setState((prevState) => ({
      showMetaGraph: !prevState.showMetaGraph,
      showInfoGraph: false,
      showQuoteGraph: false,
      showConsGraph: false,
    }));
  };

  toggleCons = () => {
    this.setState((prevState) => ({
      showConsGraph: !prevState.showConsGraph,
      showInfoGraph: false,
      showQuoteGraph: false,
      showMetaGraph: false,
    }));
  };

  render() {
    const {
      areaId,
      geofenceId,
      handlerClickOnGraph,
    } = this.context;
    const {
      hfCurrent,
      hfCurrentValue,
      hfCurrentCategory,
      showInfoGraph,
      showQuoteGraph,
      showMetaGraph,
      showConsGraph,
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
            onClickGraphHandler={(selected) => handlerClickOnGraph({ selectedKey: selected })}
          />
        </div>
        <h3>
          <IconTooltip title="Metodología">
            <CollectionsBookmarkIcon
              className="graphinfo3"
              onClick={() => this.toggleMeta()}
            />
          </IconTooltip>
          <IconTooltip title="Autoría">
            <FormatQuoteIcon
              className="graphinfo3"
              onClick={() => this.toggleQuote()}
            />
          </IconTooltip>
          <IconTooltip title="Consideraciones">
            <AnnouncementIcon
              className="graphinfo3"
              onClick={() => this.toggleCons()}
            />
          </IconTooltip>
          {(hfCurrent && hfCurrent.length > 0) && (
            <DownloadCSV
              className="downBtnSpecial"
              data={hfCurrent}
              filename={`bt_hf_current_${areaId}_${geofenceId}.csv`}
            />
          )}
        </h3>
        {showQuoteGraph && (
          <ShortInfo
            description={currentHFQuote}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        {showMetaGraph && (
        <ShortInfo
          description={currentHFMeta}
          className="graphinfo2"
          collapseButton={false}
        />
        )}
        {showConsGraph && (
        <ShortInfo
          description={currentHFConsiderations}
          className="graphinfo2"
          collapseButton={false}
        />
        )}
      </div>
    );
  }
}

export default CurrentFootprint;

CurrentFootprint.contextType = SearchContext;
