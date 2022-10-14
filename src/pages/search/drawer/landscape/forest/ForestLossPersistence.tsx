import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import matchColor from "utils/matchColor";
import formatNumber from "utils/format";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import SmallBars from "pages/search/shared_components/charts/SmallBars";
import { textsObject } from "pages/search/types/texts";
import { wrapperMessage } from "pages/search/types/charts";
import { ForestLossPersistenceController } from "pages/search/drawer/landscape/forest/ForestLossPersistenceController";
import { ForestLP } from "pages/search/types/forest";

interface Props {}
interface State {
  showInfoGraph: boolean;
  forestLP: Array<ForestLP>;
  message: wrapperMessage;
  forestPersistenceValue: number;
  texts: {
    forestLP: textsObject;
  };
}

const LATEST_PERIOD = "2016-2021";

class ForestLossPersistence extends React.Component<Props, State> {
  mounted = false;
  flpController;

  constructor(props: Props) {
    super(props);
    this.flpController = new ForestLossPersistenceController();
    this.state = {
      showInfoGraph: true,
      forestLP: [],
      message: "loading",
      forestPersistenceValue: 0,
      texts: {
        forestLP: { info: "", cons: "", meto: "", quote: "" },
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    switchLayer(`forestLP-${LATEST_PERIOD}`);

    this.flpController
      .getForestLPData(areaId, geofenceId, LATEST_PERIOD)
      .then((data) => {
        if (this.mounted) {
          this.setState({
            forestLP: data.forestLP,
            forestPersistenceValue: data.forestPersistenceValue,
            message: null,
          });
        }
      })
      .catch(() => {
        this.setState({ message: "no-data" });
      });

    this.flpController
      .getForestLPTexts("forestLP")
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { forestLP: res } });
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
    const { forestLP, forestPersistenceValue, showInfoGraph, message, texts } =
      this.state;
    const { areaId, geofenceId, handlerClickOnGraph } = this
      .context as SearchContextValues;

    const dataLP = this.flpController.getGraphData(forestLP);

    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`graphinfo${showInfoGraph ? " activeBox" : ""}`}
              onClick={this.toggleInfoGraph}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={texts.forestLP.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h6>Cobertura actual</h6>
          <h5
            style={{ backgroundColor: matchColor("forestLP")("persistencia") }}
          >
            {`${formatNumber(forestPersistenceValue, 0)} ha `}
          </h5>
        </div>
        <div>
          <h6>Cobertura de bosque en el tiempo</h6>
        </div>
        <div>
          <SmallBars
            data={dataLP.transformedData}
            keys={dataLP.keys}
            selectedIndexValue="2016-2021"
            message={message}
            height={250}
            padding={0.35}
            margin={{
              top: 20,
              right: 15,
              bottom: 50,
              left: 90,
            }}
            axisBottom={{
              tickSize: 0,
              tickPadding: 0,
              tickRotation: 0,
              format: ".2s",
              legend: "Hectáreas",
              legendPosition: "start",
              legendOffset: 25,
            }}
            axisLeft={{
              tickSize: 3,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Periodo",
              legendPosition: "middle",
              legendOffset: -80,
            }}
            enableGridX={true}
            colors={matchColor("forestLP")}
            onClickHandler={(period, key) => {
              handlerClickOnGraph({
                chartType: "forestLP",
                chartSection: period,
                selectedKey: key,
              });
            }}
            tooltip={({ id, data: allData, color }) => (
              <div
                className="tooltip-graph-container"
                style={{ position: "absolute" }}
              >
                <strong style={{ color }}>{allData[`${id}Label`]}</strong>
                <div style={{ color: "#ffffff" }}>
                  {`${formatNumber(allData[id], 0)} ha`}
                </div>
              </div>
            )}
          />
        </div>
        <TextBoxes
          consText={texts.forestLP.cons}
          metoText={texts.forestLP.meto}
          quoteText={texts.forestLP.quote}
          downloadData={this.flpController.getDownloadData(forestLP)}
          downloadName={`forest_loss_persistence_${areaId}_${geofenceId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
      </div>
    );
  }
}

export default ForestLossPersistence;

ForestLossPersistence.contextType = SearchContext;
