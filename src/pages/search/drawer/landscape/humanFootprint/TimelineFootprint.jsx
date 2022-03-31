import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import GraphLoader from 'components/charts/GraphLoader';
import DownloadCSV from 'components/DownloadCSV';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import SearchContext from 'pages/search/SearchContext';
import { timelineHFText } from 'pages/search/drawer/landscape/InfoTexts';
import formatNumber from 'utils/format';
import matchColor from 'utils/matchColor';
import processDataCsv from 'utils/processDataCsv';
import RestAPI from 'utils/restAPI';

const changeValues = [
  {
    axis: 'y',
    value: 15,
    legend: 'Natural',
    lineStyle: { stroke: '#3fbf9f', strokeWidth: 1 },
    textStyle: {
      fill: '#3fbf9f',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
  {
    axis: 'y',
    value: 30,
    legend: 'Baja',
    lineStyle: { stroke: '#d5a529', strokeWidth: 1 },
    textStyle: {
      fill: '#d5a529',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
  {
    axis: 'y',
    value: 60,
    legend: 'Media',
    lineStyle: { stroke: '#e66c29', strokeWidth: 1 },
    textStyle: {
      fill: '#e66c29',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
  {
    axis: 'y',
    value: 100,
    legend: 'Alta',
    lineStyle: { stroke: '#cf324e', strokeWidth: 1 },
    textStyle: {
      fill: '#cf324e',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
];

class TimelineFootprint extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      hfTimeline: [],
      selectedEcosystem: null,
    };
  }

  componentDidMount() {
    this.mounted = true;

    const { areaId, geofenceId, switchLayer } = this.context;
    switchLayer('hfTimeline');

    Promise.all([
      RestAPI.requestSEHFTimeline(areaId, geofenceId, 'Páramo'),
      RestAPI.requestSEHFTimeline(areaId, geofenceId, 'Humedal'),
      RestAPI.requestSEHFTimeline(areaId, geofenceId, 'Bosque Seco Tropical'),
      RestAPI.requestTotalHFTimeline(areaId, geofenceId),
    ])
      .then(([paramo, wetland, dryForest, aTotal]) => {
        if (this.mounted) {
          this.setState({ hfTimeline: this.processData([paramo, wetland, dryForest, aTotal]) });
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

  /**
   * Set data about selected ecosystem
   *
   * @param {string} seType type of strategic ecosystem to request
   */
  setSelectedEcosystem = (seType) => {
    const {
      areaId,
      geofenceId,
    } = this.context;
    if (seType !== 'aTotal') {
      RestAPI.requestSEDetailInArea(areaId, geofenceId, this.getLabel(seType))
        .then((value) => {
          const res = { ...value, type: seType };
          this.setState({ selectedEcosystem: res });
        });
    } else {
      this.setState({ selectedEcosystem: null });
    }
  }

  /**
   * Defines the label for a given data
   * @param {string} type data identifier
   *
   * @returns {string} label to be used for tooltips, legends, etc.
   * Max. length = 16 characters
   */
  getLabel = (type) => {
    switch (type) {
      case 'paramo': return 'Páramo';
      case 'wetland': return 'Humedal';
      case 'dryForest': return 'Bosque Seco Tropical';
      default: return 'Área total';
    }
  };

  /**
   * Transform data to fit in the graph structure
   * @param {array} data data to be transformed
   *
   * @returns {array} data transformed
   */
  processData = (data) => {
    if (!data) return [];
    return data.map((obj) => ({
      ...obj,
      label: this.getLabel(obj.key).substr(0, 11),
    }));
  };

  render() {
    const {
      areaId,
      geofenceId,
      handlerClickOnGraph,
    } = this.context;
    const {
      showInfoGraph,
      hfTimeline,
      selectedEcosystem,
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
              description={timelineHFText}
              className="graphinfo2"
              collapseButton={false}
            />
          )
        )}
        <h6>
          Huella humana comparada con EE
        </h6>
        {(hfTimeline && hfTimeline.length > 0) && (
          <DownloadCSV
            data={processDataCsv(hfTimeline)}
            filename={`bt_hf_timeline_${areaId}_${geofenceId}.csv`}
          />
        )}
        <p>
          Haz clic en un ecosistema para ver su comportamiento
        </p>
        <div>
          <GraphLoader
            graphType="MultiLinesGraph"
            colors={matchColor('hfTimeline')}
            data={hfTimeline}
            markers={changeValues}
            labelX="Año"
            labelY="Indice promedio Huella Humana"
            onClickGraphHandler={(selection) => {
              this.setSelectedEcosystem(selection);
              handlerClickOnGraph({ chartType: 'hfTimeline', selectedKey: selection });
            }}
          />
          {selectedEcosystem && (
            <div>
              <h6>
                {`${this.getLabel(selectedEcosystem.type)} dentro de la unidad de consulta`}
              </h6>
              <h5>
                {`${formatNumber(selectedEcosystem.total_area, 2)} ha`}
              </h5>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TimelineFootprint;

TimelineFootprint.contextType = SearchContext;
