import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import GraphLoader from "components/charts/GraphLoader";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "components/Tooltips";
import SearchContext from "pages/search/SearchContext";
import matchColor from "utils/matchColor";
import processDataCsv from "utils/processDataCsv";
import RestAPI from "utils/restAPI";
import TextBoxes from "components/TextBoxes";
import { AnyObject } from "chart.js/types/basic";
import { InfoTexts } from "pages/search/types/texts.types";

interface TimelinePAConnectivityState {
  showInfoGraph: boolean;
  timelinePAConnectivity: Array<unknown>;
  message: string | null;
  texts: { paConnTimeline: InfoTexts | any };
}

interface SearchContextValues {
  areaId: string;
  geofenceId: string | number;
  switchLayer(layer: string): void;
}

class TimelinePAConnectivity extends React.Component<
  any,
  TimelinePAConnectivityState
> {
  static contextType = SearchContext;
  mounted = false;

  constructor(props: any) {
    super(props);
    this.state = {
      showInfoGraph: true,
      timelinePAConnectivity: [],
      message: "loading",
      texts: {
        paConnTimeline: { meto: "", cons: "", quote: "", info: "" },
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    switchLayer("timelinePAConn");

    Promise.all([
      RestAPI.requestTimelinePAConnectivity(areaId, geofenceId, "prot"),
      RestAPI.requestTimelinePAConnectivity(areaId, geofenceId, "prot_conn"),
    ]).then((res) => {
      if (this.mounted) {
        this.setState({
          timelinePAConnectivity: this.processData(res),
          message: null,
        });
      }
    });

    RestAPI.requestSectionTexts("paConnTimeline")
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { paConnTimeline: res } });
        }
      })
      .catch(() => {
        this.setState({ texts: { paConnTimeline: {} } });
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
   * Defines the label for a given data
   * @param {string} key key identifier
   *
   * @returns {string} label to be used for tooltips and legends.
   */
  getLabel = (key: string): string => {
    switch (key) {
      case "prot":
        return "Protegida";
      case "prot_conn":
        return "Protegida Conectada";
      default:
        return "";
    }
  };

  /**
   * Transform data to fit in the graph structure
   * @param {array} data data to be transformed
   *
   * @returns {array} transformed array
   */
  processData = (data: Array<any>): Array<any> => {
    if (!data) return [];
    return data.map((obj) => ({
      ...obj,
      data: obj.data.map((item: { y: number }) => ({
        ...item,
        y: item.y * 100,
      })),
      label: this.getLabel(obj.key),
    }));
  };

  render() {
    const { showInfoGraph, timelinePAConnectivity, message, texts } =
      this.state;
    const { areaId, geofenceId } = this.context as SearchContextValues;
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
            description={texts.paConnTimeline.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h6>Conectividad áreas protegidas en el tiempo</h6>
          <div>
            <GraphLoader
              graphType="MultiLinesGraph"
              colors={matchColor("timelinePAConn")}
              data={timelinePAConnectivity}
              message={message}
              labelX="Año"
              labelY="Porcentaje"
              units="%"
              yMax={50}
            />
            <TextBoxes
              consText={texts.paConnTimeline.cons}
              metoText={texts.paConnTimeline.meto}
              quoteText={texts.paConnTimeline.quote}
              downloadData={processDataCsv(timelinePAConnectivity)}
              downloadName={`conn_timeline_${areaId}_${geofenceId}.csv`}
              isInfoOpen={showInfoGraph}
              toggleInfo={this.toggleInfoGraph}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TimelinePAConnectivity;

TimelinePAConnectivity.contextType = SearchContext;
