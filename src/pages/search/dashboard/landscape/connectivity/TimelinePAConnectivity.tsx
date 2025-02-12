import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import matchColor from "utils/matchColor";
import processDataCsv from "utils/processDataCsv";
import TextBoxes from "pages/search/shared_components/TextBoxes";
import {
  timelinePAConn,
  timeLinePAConnValues,
} from "pages/search/types/connectivity";
import { textsObject } from "pages/search/types/texts";
import BackendAPI from "utils/backendAPI";
import Lines from "pages/search/shared_components/charts/Lines";
import { wrapperMessage } from "pages/search/types/charts";
import { TimelinePAConnectivityController } from "pages/search/dashboard/landscape/connectivity/TimelinePAConnectivityController";
import { shapeLayer } from "pages/search/types/layers";

const getLabel = {
  prot: "Protegida",
  prot_conn: "Protegida conectada",
};

interface timelinePAConnExt extends timelinePAConn {
  label: string;
}
interface Props {}
interface timelinePAConnState {
  showInfoGraph: boolean;
  timelinePAConnData: Array<timelinePAConnExt>;
  message: wrapperMessage;
  texts: {
    paConnTimeline: textsObject;
  };
  layers: Array<shapeLayer>;
}
class TimelinePAConnectivity extends React.Component<
  Props,
  timelinePAConnState
> {
  static contextType = SearchContext;
  mounted = false;
  TimelinePACController;

  constructor(props: Props) {
    super(props);
    this.TimelinePACController = new TimelinePAConnectivityController();
    this.state = {
      showInfoGraph: true,
      timelinePAConnData: [],
      message: "loading",
      texts: {
        paConnTimeline: { info: "", cons: "", meto: "", quote: "" },
      },
      layers: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaType,
      areaId,
      setShapeLayers,
      setLoadingLayer,
      setMapTitle,
      setShowAreaLayer,
    } = this.context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.TimelinePACController.setArea(areaTypeId, areaIdId);

    Promise.all([
      BackendAPI.requestTimelinePAConnectivity(areaTypeId, areaIdId, "prot"),
      BackendAPI.requestTimelinePAConnectivity(
        areaTypeId,
        areaIdId,
        "prot_conn"
      ),
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

    BackendAPI.requestSectionTexts("paConnTimeline")
      .then((res: textsObject) => {
        if (this.mounted) {
          this.setState({ texts: { paConnTimeline: res } });
        }
      })
      .catch(() => {});

    setLoadingLayer(true, false);

    this.TimelinePACController.getLayer()
      .then((timelinePAConn) => {
        if (this.mounted) {
          this.setState(
            () => ({ layers: [timelinePAConn] }),
            () => setLoadingLayer(false, false)
          );
          setShowAreaLayer(true);
          setShapeLayers(this.state.layers);
          setMapTitle("Conectividad de áreas protegidas");
        }
      })
      .catch(() => setLoadingLayer(false, true));
  }

  componentWillUnmount() {
    this.mounted = false;
    const { setShapeLayers, setLoadingLayer, setShowAreaLayer } = this
      .context as SearchContextValues;
    this.TimelinePACController.cancelActiveRequests();
    setShowAreaLayer(false);
    setShapeLayers([]);
    setLoadingLayer(false, false);
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
    const { areaType, areaId } = this.context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

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
            description={`<p>${texts.paConnTimeline.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h6>Conectividad áreas protegidas en el tiempo</h6>
          <div>
            <Lines
              colors={matchColor("timelinePAConn")}
              data={timelinePAConnData}
              message={message}
              units="%"
              yMax={50}
            />
            <TextBoxes
              consText={texts.paConnTimeline.cons}
              metoText={texts.paConnTimeline.meto}
              quoteText={texts.paConnTimeline.quote}
              downloadData={processDataCsv(timelinePAConnData)}
              downloadName={`conn_timeline_${areaTypeId}_${areaIdId}.csv`}
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
