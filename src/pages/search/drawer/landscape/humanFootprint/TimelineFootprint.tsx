import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import formatNumber from "utils/format";
import matchColor from "utils/matchColor";
import processDataCsv from "utils/processDataCsv";
import SearchAPI from "utils/searchAPI";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import { hfTimeline } from "pages/search/types/humanFootprint";
import { seDetails } from "pages/search/types/ecosystems";
import { TextObject } from "pages/search/types/texts";
import MultiLinesGraph from "pages/search/shared_components/charts/MultiLinesGraph";
import { wrapperMessage } from "pages/search/types/charts";
import { DatumValue } from "@nivo/line";
import { CartesianMarkerProps } from "@nivo/core";

const changeValues: Array<CartesianMarkerProps> = [
  {
    axis: "y",
    value: 15,
    legend: "Natural",
    lineStyle: { stroke: "#909090", strokeWidth: 1 },
    textStyle: {
      fill: "#3fbf9f",
      fontSize: 9,
    },
    legendPosition: "bottom-right",
  },
  {
    axis: "y",
    value: 40,
    legend: "Baja",
    lineStyle: { stroke: "#909090", strokeWidth: 1 },
    textStyle: {
      fill: "#d5a529",
      fontSize: 9,
    },
    legendPosition: "bottom-right",
  },
  {
    axis: "y",
    value: 60,
    legend: "Media",
    lineStyle: { stroke: "#909090", strokeWidth: 1 },
    textStyle: {
      fill: "#e66c29",
      fontSize: 9,
    },
    legendPosition: "bottom-right",
  },
  {
    axis: "y",
    value: 100,
    legend: "Alta",
    lineStyle: { stroke: "#909090", strokeWidth: 1 },
    textStyle: {
      fill: "#cf324e",
      fontSize: 9,
    },
    legendPosition: "bottom-right",
  },
];

const dataMock = [
  {
    "key": "paramo",
    "data": [
      {
        "x": "1970",
        "y": 13.0266301199902,
        "key": "paramo",
      },
      {
        "x": "1990",
        "y": 15.8923998054669,
        "key": "paramo",
      },
      {
        "x": "2000",
        "y": 19.3378672984981,
        "key": "paramo",
      },
      {
        "x": "2015",
        "y": 23.0074804830625,
        "key": "paramo",
      },
      {
        "x": "2018",
        "y": 23.4133412384265,
        "key": "paramo",
      }
    ],
    "label": "Páramo",
    "id": "paramo",
    "color": "#bba2ff"
  },
  {
    "key": "wetland",
    "data": [
      {
        "x": "1970",
        "y": 35.8267953418995,
        "key": "wetland",
      },
      {
        "x": "1990",
        "y": 40.220059966881,
        "key": "wetland",
      },
      {
        "x": "2000",
        "y": 42.4652046692811,
        "key": "wetland",
      },
      {
        "x": "2015",
        "y": 43.7276521264575,
        "key": "wetland",
      },
      {
        "x": "2018",
        "y": 44.3827462085131,
        "key": "wetland",
      }
    ],
    "label": "Humedal",
    "id": "wetland",
    "color": "#95b4db"
  },
  {
    "key": "dryForest",
    "data": [
      {
        "x": "1970",
        "y": 52.2278092694628,
        "key": "dryForest",
      },
      {
        "x": "1990",
        "y": 54.6841757981244,
        "key": "dryForest",
      },
      {
        "x": "2000",
        "y": 55.8276304672073,
        "key": "dryForest",
      },
      {
        "x": "2015",
        "y": 56.8961844866329,
        "key": "dryForest",
      },
      {
        "x": "2018",
        "y": 57.432031522404,
        "key": "dryForest",
      }
    ],
    "label": "Bosque Seco T",
    "id": "dryForest",
    "color": "#afcc83"
  },
  {
    "key": "aTotal",
    "data": [
      {
        "x": "1970",
        "y": 33.102116221481,
        "key": "aTotal",
      },
      {
        "x": "1990",
        "y": 35.9939376304085,
        "key": "aTotal",
      },
      {
        "x": "2000",
        "y": 37.7592021782625,
        "key": "aTotal",
      },
      {
        "x": "2015",
        "y": 38.4246954598706,
        "key": "aTotal",
      },
      {
        "x": "2018",
        "y": 38.8128220202167,
        "key": "aTotal",
      }
    ],
    "label": "Área consulta",
    "id": "aTotal",
    "color": "#3d3c48"
  }
];

interface Props {}

interface State {
  showInfoGraph: boolean;
  hfTimeline: Array<hfTimelineExt>;
  message: wrapperMessage;
  selectedEcosystem: seDetailsExt | null;
  texts: {
    hfTimeline: TextObject;
  };
}

interface hfTimelineExt extends hfTimeline {
  label: string;
}

interface seDetailsExt extends seDetails {
  type: string;
}

class TimelineFootprint extends React.Component<Props, State> {
  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      hfTimeline: [],
      message: "loading",
      selectedEcosystem: null,
      texts: {
        hfTimeline: { info: "", cons: "", meto: "", quote: "" },
      },
    };
  }

  componentDidMount() {
    this.mounted = true;

    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;
    switchLayer("hfTimeline");

    Promise.all([
      SearchAPI.requestSEHFTimeline(areaId, geofenceId, "Páramo"),
      SearchAPI.requestSEHFTimeline(areaId, geofenceId, "Humedal"),
      SearchAPI.requestSEHFTimeline(areaId, geofenceId, "Bosque Seco Tropical"),
      SearchAPI.requestTotalHFTimeline(areaId, geofenceId),
    ])
      .then(([paramo, wetland, dryForest, aTotal]) => {
        if (this.mounted) {
          this.setState({
            hfTimeline: this.processData([paramo, wetland, dryForest, aTotal]),
            message: null,
          });
        }
      })
      .catch(() => {
        this.setState({ message: "no-data" });
      });

    SearchAPI.requestSectionTexts("hfTimeline")
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { hfTimeline: res } });
        }
      })
      .catch(() => {
        this.setState({
          texts: { hfTimeline: { info: "", cons: "", meto: "", quote: "" } },
        });
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
   * Set data about selected ecosystem
   *
   * @param {string} seType type of strategic ecosystem to request
   */
  setSelectedEcosystem = (seType: string) => {
    const { areaId, geofenceId } = this.context as SearchContextValues;
    if (seType !== "aTotal") {
      SearchAPI.requestSEDetailInArea(
        areaId,
        geofenceId,
        this.getLabel(seType)
      ).then((value) => {
        const res = { ...value, type: seType };
        this.setState({ selectedEcosystem: res });
      });
    } else {
      this.setState({ selectedEcosystem: null });
    }
  };

  /**
   * Defines the label for a given data
   * @param {string} type data identifier
   *
   * @returns {string} label to be used for tooltips, legends, etc.
   * Max. length = 16 characters
   */
  getLabel = (type: string) => {
    switch (type) {
      case "paramo":
        return "Páramo";
      case "wetland":
        return "Humedal";
      case "dryForest":
        return "Bosque Seco Tropical";
      default:
        return "Área consulta";
    }
  };

  /**
   * Transform data to fit in the graph structure
   * @param {array} data data to be transformed
   *
   * @returns {array} data transformed
   */
  processData = (data: Array<hfTimeline>) => {
    if (!data) return [];
    return data.map((obj) => ({
      ...obj,
      label: this.getLabel(obj.key).substr(0, 13),
    }));
  };

  render() {
    const { areaId, geofenceId, handlerClickOnGraph } = this
      .context as SearchContextValues;
    const { showInfoGraph, hfTimeline, selectedEcosystem, message, texts } =
      this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`graphinfo${showInfoGraph ? " activeBox" : ""}`}
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={texts.hfTimeline.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <h6>Huella humana comparada con EE</h6>
        <p>Haz clic en un ecosistema para ver su comportamiento</p>
        <div>
          <MultiLinesGraph
            colors={matchColor("hfTimeline")}
            data={dataMock}
            message={message}
            markers={changeValues}
            labelX="Año"
            labelY="Indice promedio Huella Humana"
            onClickGraphHandler={(selection: string) => {
              this.setSelectedEcosystem(selection);
              handlerClickOnGraph({
                chartType: "hfTimeline",
                selectedKey: selection,
              });
            }}
            yMax={100}
            yMin={0}
          />
          {selectedEcosystem && (
            <div>
              <h6>
                {`${this.getLabel(
                  selectedEcosystem.type
                )} dentro de la unidad de consulta`}
              </h6>
              <h5>{`${formatNumber(selectedEcosystem.total_area, 2)} ha`}</h5>
            </div>
          )}
          <TextBoxes
            consText={texts.hfTimeline.cons}
            metoText={texts.hfTimeline.meto}
            quoteText={texts.hfTimeline.quote}
            downloadData={processDataCsv(hfTimeline)}
            downloadName={`hf_timeline_${areaId}_${geofenceId}.csv`}
            isInfoOpen={showInfoGraph}
            toggleInfo={this.toggleInfoGraph}
          />
        </div>
      </div>
    );
  }
}

export default TimelineFootprint;

TimelineFootprint.contextType = SearchContext;
