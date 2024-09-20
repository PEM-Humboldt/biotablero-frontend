import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import matchColor from "utils/matchColor";
import formatNumber from "utils/format";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import { ForestLPExt } from "pages/search/types/forest";
import SmallBars from "pages/search/shared_components/charts/SmallBars";
import { textsObject } from "pages/search/types/texts";
import { wrapperMessage } from "pages/search/types/charts";
import { ForestLossPersistenceController } from "pages/search/drawer/landscape/forest/ForestLossPersistenceController";

interface Props {}
interface State {
  showInfoGraph: boolean;
  forestLP: Array<ForestLPExt>;
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
    const {
      areaId,
      geofenceId,
      searchType,
      polygon,
      setPolygonValues,
      switchLayer,
    } = this.context as SearchContextValues;

    if (searchType === "definedArea") {
      switchLayer(`forestLP-${LATEST_PERIOD}`);
    }

    this.flpController
      .getForestLPData(
        areaId,
        geofenceId,
        LATEST_PERIOD,
        searchType,
        polygon?.geojson ?? null
      )
      .then((data) => {
        if (this.mounted) {
          this.setState({
            forestLP: data.forestLP,
            forestPersistenceValue: data.forestPersistenceValue,
            message: null,
          });
        }
        if (searchType === "drawPolygon") {
          const latestId = data.forestLP[data.forestLP.length - 1].id;
          setPolygonValues(data.forestLPArea ?? 0);
          switchLayer(`forestLP-${latestId}`);
        }
      })
      .catch(() => {
        this.setState({ message: "no-data" });
        switchLayer(`drawPolygon`);
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
    const { areaId, geofenceId, searchType, handlerClickOnGraph } = this
      .context as SearchContextValues;

    const graphData = this.flpController.getGraphData(forestLP);

    const selectedIndex =
      searchType === "drawPolygon" && forestLP.length > 0
        ? forestLP[forestLP.length - 1].id
        : LATEST_PERIOD;

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
            description={`<p>${texts.forestLP.info}</p>`}
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
            data={graphData.transformedData}
            keys={graphData.keys}
            tooltips={graphData.tooltips}
            message={message}
            margin={{
              bottom: 50,
            }}
            axisY={{
              enabled: true,
              legend: "Periodo",
            }}
            axisX={{
              enabled: true,
              legend: "Hectáreas",
              format: ".2s",
            }}
            colors={matchColor("forestLP")}
            onClickHandler={(period, key) => {
              handlerClickOnGraph({
                chartType: "forestLP",
                chartSection: period,
                selectedKey: key,
              });
            }}
            selectedIndexValue={selectedIndex}
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
