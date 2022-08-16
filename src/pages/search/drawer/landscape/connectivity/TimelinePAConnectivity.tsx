import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import GraphLoader from "components/charts/GraphLoader";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "components/Tooltips";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import matchColor from "utils/matchColor";
import processDataCsv from "utils/processDataCsv";
import TextBoxes from "components/TextBoxes";
import {
  timelinePAConn,
  timeLinePAConnValues,
} from "pages/search/types/connectivity";
import { TextObject } from "pages/search/types/texts";
import SearchAPI from "utils/searchAPI";

const getLabel = {
  prot: "Protegida",
  prot_conn: "Protegida conectada",
};

interface timelinePAConnExt extends timelinePAConn {
  label: string;
}
interface timelinePAConnState {
  showInfoGraph: boolean;
  timelinePAConnData: Array<timelinePAConnExt>;
  message: string | null;
  texts: {
    paConnTimeline: TextObject;
  };
}
class TimelinePAConnectivity extends React.Component<any, timelinePAConnState> {
  static contextType = SearchContext;
  mounted = false;

  constructor(props: any) {
    super(props);
    this.state = {
      showInfoGraph: true,
      timelinePAConnData: [],
      message: "loading",
      texts: {
        paConnTimeline: { info: "", cons: "", meto: "", quote: "" },
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    switchLayer("timelinePAConn");

    Promise.all([
      SearchAPI.requestTimelinePAConnectivity(areaId, geofenceId, "prot"),
      SearchAPI.requestTimelinePAConnectivity(areaId, geofenceId, "prot_conn"),
    ])
      .then((res) => {
        if (this.mounted) {
          this.setState(() => ({
            timelinePAConnData: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
              data: item.data.map((i: timeLinePAConnValues) => ({
                ...i,
                y: i.y * 100,
              })),
            })),
            message: null,
          }));
        }
      })
      .catch(() => {
        this.setState({ message: "no-data" });
      });

    SearchAPI.requestSectionTexts("paConnTimeline")
      .then((res: TextObject) => {
        if (this.mounted) {
          this.setState({ texts: { paConnTimeline: res } });
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

  render() {
    const { showInfoGraph, timelinePAConnData, message, texts } = this.state;
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
              data={timelinePAConnData}
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
              downloadData={processDataCsv(timelinePAConnData)}
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
