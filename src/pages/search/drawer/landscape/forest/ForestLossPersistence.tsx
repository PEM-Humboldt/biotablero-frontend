import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import GraphLoader from "components/charts/GraphLoader";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "components/Tooltips";
import matchColor from "utils/matchColor";
import SearchAPI from "utils/searchAPI";
import formatNumber from "utils/format";
import TextBoxes from "components/TextBoxes";

import { MultiSmallBarStackGraphData } from "components/charts/MultiSmallBarStackGraph";
import { TextObject } from "pages/search/types/texts";
import { ForestLP } from "pages/search/types/forest";

interface Props {}
interface State {
  showInfoGraph: boolean;
  forestLP: Array<MultiSmallBarStackGraphData>;
  message: string | null;
  forestPersistenceValue: number;
  texts: {
    forestLP: TextObject;
  };
}

const LATEST_PERIOD = "2016-2021";

const getLabel = {
  persistencia: "Persistencia",
  perdida: "Pérdida",
  ganancia: "Ganancia",
  no_bosque: "No bosque",
};

class ForestLossPersistence extends React.Component<Props, State> {
  mounted = false;

  constructor(props: Props) {
    super(props);
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

    const getPersistenceValue = (rawData: Array<ForestLP>) => {
      const periodData = rawData.find(
        (item) => item.id === LATEST_PERIOD
      )?.data;
      const persistenceData = periodData
        ? periodData.find((item) => item.key === "persistencia")
        : null;
      return persistenceData ? persistenceData.area : 0;
    };

    switchLayer(`forestLP-${LATEST_PERIOD}`);

    SearchAPI.requestForestLP(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            forestLP: res.map((item) => ({
              ...item,
              data: item.data.map((element) => ({
                ...element,
                label: getLabel[element.key],
              })),
            })),
            forestPersistenceValue: getPersistenceValue(res),
            message: null,
          });
        }
      })
      .catch(() => {
        this.setState({ message: "no-data" });
      });

    SearchAPI.requestSectionTexts("forestLP")
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

  /**
   * Process data to be downloaded as a csv file
   *
   * @param {Array<Object>} data graph data transformed to be downloaded as csv
   */
  processDownload = (data: Array<MultiSmallBarStackGraphData>) => {
    const result: Array<{
      period: string;
      category: string;
      area: number;
      percentage: number;
    }> = [];
    data.forEach((period) =>
      period.data.forEach((obj) => {
        result.push({
          period: period.id,
          category: obj.label,
          area: obj.area,
          percentage: obj.percentage,
        });
      })
    );
    return result;
  };

  render() {
    const { forestLP, forestPersistenceValue, showInfoGraph, message, texts } =
      this.state;
    const { areaId, geofenceId, handlerClickOnGraph } = this
      .context as SearchContextValues;
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
          <GraphLoader
            graphType="MultiSmallBarStackGraph"
            data={forestLP}
            message={message}
            units="ha"
            colors={matchColor("forestLP")}
            onClickGraphHandler={(period, key) => {
              handlerClickOnGraph({
                chartType: "forestLP",
                chartSection: period,
                selectedKey: key,
              });
            }}
            selectedIndexValue="2016-2021"
          />
        </div>
        <TextBoxes
          consText={texts.forestLP.cons}
          metoText={texts.forestLP.meto}
          quoteText={texts.forestLP.quote}
          downloadData={this.processDownload(forestLP)}
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
