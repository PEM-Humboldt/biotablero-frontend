import React from "react";

import InfoIcon from "@mui/icons-material/Info";

import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import matchColor from "pages/search/utils/matchColor";
import BackendAPI from "pages/search/api/backendAPI";
import SearchAPI from "pages/search/api/searchAPI";
import TextBoxes from "@ui/TextBoxes";

import {
  currentHFValue,
  currentHFCategories,
} from "pages/search/types/humanFootprint";
import { textsObject } from "pages/search/types/texts";
import {
  LargeStackedBar,
  LargeStackedBarData,
} from "@composites/charts/LargeStackedBar";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { CurrentFootprintController } from "pages/search/dashboard/landscape/humanFootprint/CurrentFootprintController";
import { RasterLayer } from "pages/search/types/layers";

interface currentHFCategoriesExt extends currentHFCategories {
  label: string;
}

interface Props {}
interface currentHFState {
  showInfoGraph: boolean;
  period: string;
  hfCurrent: Array<LargeStackedBarData>;
  hfCurrentValue: string;
  hfCurrentCategory: string;
  message: any;
  texts: {
    hfCurrent: textsObject;
  };
  layers: Array<RasterLayer>;
}

class CurrentFootprint extends React.Component<Props, currentHFState> {
  static contextType = SearchLegacyCTX;
  mounted = false;
  componentName = "hfCurrent";
  CurrentHFController;

  constructor(props: Props) {
    super(props);
    this.CurrentHFController = new CurrentFootprintController();
    this.state = {
      showInfoGraph: true,
      period: "",
      hfCurrent: [],
      hfCurrentValue: "0",
      hfCurrentCategory: "",
      message: "loading",
      texts: {
        hfCurrent: { info: "", cons: "", meto: "", quote: "" },
      },
      layers: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaType, areaId } = this.context as LegacyContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.CurrentHFController.setArea(areaTypeId, areaIdId);

    /******** ToDo: Update the request for Avg HF *********/
    /*
    BackendAPI.requestCurrentHFValue(areaTypeId, areaIdId)
      .then((res: currentHFValue) => {
        if (this.mounted) {
          this.setState({
            hfCurrentValue: Number(res.value).toFixed(2),
            hfCurrentCategory: res.category,
          });
        }
      })
      .catch(() => {});
    */

    SearchAPI.requestMetricsValues<"CurrentHF">("CurrentHF", Number(areaIdId))
      .then((res) => {
        if (this.mounted) {
          this.setState({
            hfCurrent: this.CurrentHFController.transformData(res),
            period: res[0]?.ano ?? "",
            message: null,
          });
        }
      })
      .catch(() => {
        this.setState({ message: "no-data" });
      });

    BackendAPI.requestSectionTexts("hfCurrent")
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { hfCurrent: res } });
        }
      })
      .catch(() => {
        this.setState({
          texts: { hfCurrent: { info: "", cons: "", meto: "", quote: "" } },
        });
      });
  }

  componentDidUpdate(prevProps: Props, prevState: currentHFState) {
    if (this.state.period && this.state.period !== prevState.period) {
      this.switchLayer(this.state.period);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.CurrentHFController.cancelActiveRequests();
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
    const { areaType, areaId } = this.context as LegacyContextValues;
    const {
      hfCurrent,
      hfCurrentValue,
      hfCurrentCategory,
      showInfoGraph,
      message,
      texts,
    } = this.state;

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
            description={`<p>${texts.hfCurrent.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h6>Huella humana promedio · 2018</h6>
          <h5
            style={{
              backgroundColor: matchColor("hfCurrent")(hfCurrentCategory),
            }}
          >
            {hfCurrentValue}
          </h5>
        </div>
        <h6>Natural, Baja, Media y Alta</h6>
        <div>
          <LargeStackedBar
            data={hfCurrent}
            message={message}
            labelX="Hectáreas"
            labelY="Huella Humana Actual"
            units="ha"
            colors={matchColor("hfCurrent")}
            padding={0.25}
            onClickGraphHandler={this.clickOnGraph}
          />
        </div>
        <TextBoxes
          consText={texts.hfCurrent.cons}
          metoText={texts.hfCurrent.meto}
          quoteText={texts.hfCurrent.quote}
          downloadData={hfCurrent}
          downloadName={`hf_current_${areaTypeId}_${areaIdId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
      </div>
    );
  }

  clickOnGraph = (selectedKey: string) => {
    const { setRasterLayers } = this.context as LegacyContextValues;
    const { layers } = this.state;

    setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      })),
    );
  };

  switchLayer = (period: string) => {
    const { setRasterLayers, setLoadingLayer, setLayerError, setMapTitle } =
      this.context as LegacyContextValues;

    setLoadingLayer(true);
    this.CurrentHFController.getCurrentHFLayers(period)
      .then((layers) => {
        this.setState({ layers: layers });

        if (this.mounted) {
          setRasterLayers(layers);
          setLoadingLayer(false);
          setMapTitle({
            name: `HH promedio · ${period}`,
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

export default CurrentFootprint;
