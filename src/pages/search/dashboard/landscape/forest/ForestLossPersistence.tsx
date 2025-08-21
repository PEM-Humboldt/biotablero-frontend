import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import matchColor from "pages/search/utils/matchColor";
import formatNumber from "pages/search/utils/format";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import { ForestLPExt } from "pages/search/types/forest";
import SmallBars from "pages/search/shared_components/charts/SmallBars";
import { textsObject } from "pages/search/types/texts";
import { wrapperMessage } from "pages/search/types/charts";
import { ForestLossPersistenceController } from "pages/search/dashboard/landscape/forest/ForestLossPersistenceController";
import { RasterLayer } from "pages/search/types/layers";

interface Props {}
interface State {
  showInfoGraph: boolean;
  forestLP: Array<ForestLPExt>;
  message: wrapperMessage;
  forestPersistenceValue: number;
  texts: {
    forestLP: textsObject;
  };
  layers: Array<RasterLayer>;
}

class ForestLossPersistence extends React.Component<Props, State> {
  mounted = false;
  componentName = "forestLP";
  flpController;
  currentPeriod = "2016-2021";

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
      layers: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaType, areaId, searchType } = this
      .context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.flpController.setArea(areaTypeId, areaIdId);

    this.switchLayer(this.currentPeriod);

    this.flpController
      .getForestLPData(this.currentPeriod)
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
    this.flpController.cancelActiveRequests();
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
      forestLP,
      forestPersistenceValue,
      showInfoGraph,
      message,
      texts,
      layers,
    } = this.state;
    const { areaType, areaId, setRasterLayers } = this
      .context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    const graphData = this.flpController.getGraphData(forestLP);

    const selectedIndex = this.currentPeriod;

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
            onClickHandler={(period, category) => {
              if (period === this.currentPeriod) {
                setRasterLayers(
                  layers.map((layer) => ({
                    ...layer,
                    selected: layer.id === category,
                  }))
                );
              } else {
                this.currentPeriod = period;
                this.switchLayer(period);
              }
            }}
            selectedIndexValue={selectedIndex}
          />
        </div>
        <TextBoxes
          consText={texts.forestLP.cons}
          metoText={texts.forestLP.meto}
          quoteText={texts.forestLP.quote}
          downloadData={this.flpController.getDownloadData(forestLP)}
          downloadName={`forest_loss_persistence_${areaTypeId}_${areaIdId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
      </div>
    );
  }

  switchLayer = (period: string) => {
    const { setRasterLayers, setLoadingLayer, setLayerError, setMapTitle } =
      this.context as SearchContextValues;

    setLoadingLayer(true);
    this.flpController
      .getLayers(period)
      .then((layers) => {
        this.setState({ layers: layers });

        if (this.mounted) {
          setRasterLayers(this.state.layers);
          setLoadingLayer(false);
          setMapTitle({
            name: `Pérdida y persistencia de bosque (${this.currentPeriod})`,
          });
        }
      })
      .catch((e) => {
        if (e.toString() != "Error: request canceled") {
          setLayerError(e.toString());
        }
      });
  };
}

export default ForestLossPersistence;

ForestLossPersistence.contextType = SearchContext;
