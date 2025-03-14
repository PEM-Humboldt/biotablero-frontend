import React from "react";

import InfoIcon from "@mui/icons-material/Info";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import matchColor from "utils/matchColor";
import BackendAPI from "utils/backendAPI";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import {
  currentHFValue,
  currentHFCategories,
} from "pages/search/types/humanFootprint";
import { textsObject } from "pages/search/types/texts";
import LargeStackedBar from "pages/search/shared_components/charts/LargeStackedBar";
import { wrapperMessage } from "pages/search/types/charts";
import { CurrentFootprintController } from "pages/search/dashboard/landscape/humanFootprint/CurrentFootprintController";
import { shapeLayer } from "pages/search/types/layers";

interface currentHFCategoriesExt extends currentHFCategories {
  label: string;
}

interface Props {}
interface currentHFState {
  showInfoGraph: boolean;
  hfCurrent: Array<currentHFCategoriesExt>;
  hfCurrentValue: string;
  hfCurrentCategory: string;
  message: wrapperMessage;
  texts: {
    hfCurrent: textsObject;
  };
  layers: Array<shapeLayer>;
}

class CurrentFootprint extends React.Component<Props, currentHFState> {
  mounted = false;
  componentName = "hfCurrent";
  CurrentHFController;

  constructor(props: Props) {
    super(props);
    this.CurrentHFController = new CurrentFootprintController();
    this.state = {
      showInfoGraph: true,
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
    const {
      areaType,
      areaId,
      setShapeLayers,
      setLoadingLayer,
      setMapTitle,
      setCurrentComponent,
    } = this.context as SearchContextValues;

    setCurrentComponent(this.componentName);

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.CurrentHFController.setArea(areaTypeId, areaIdId);

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

    BackendAPI.requestCurrentHFCategories(areaTypeId, areaIdId)
      .then((res: Array<currentHFCategories>) => {
        if (this.mounted) {
          this.setState({
            hfCurrent: res.map((item) => ({
              ...item,
              label: `${item.key[0].toUpperCase()}${item.key.slice(1)}`,
            })),
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

    setLoadingLayer(true, false);

    this.CurrentHFController.getLayer()
      .then((hfCurrent) => {
        if (this.mounted) {
          this.setState(
            () => ({ layers: [hfCurrent] }),
            () => setLoadingLayer(false, false)
          );
          setShapeLayers(this.state.layers);
          setMapTitle({ name: "HH promedio · 2018" });
        }
      })
      .catch(() => setLoadingLayer(false, true));
  }

  componentWillUnmount() {
    this.mounted = false;
    const { unmountComponent } = this.context as SearchContextValues;
    this.CurrentHFController.cancelActiveRequests();

    unmountComponent(this.componentName);
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
    const { areaType, areaId } = this.context as SearchContextValues;
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
            onClickGraphHandler={(selected: string) => {
              this.highlightFeature(selected);
            }}
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

  /**
   * Highlight an specific feature of the Currenta PA layer
   *
   * @param {string} selectedKey Id of the feature
   */
  highlightFeature = (selectedKey: string) => {
    const { setShapeLayers } = this.context as SearchContextValues;
    const { layers } = this.state;
    const highlightedLayers = layers.map((layer) => {
      if (layer.id === "hfCurrent") {
        layer.layerStyle = this.CurrentHFController.setLayerStyle(selectedKey);
      }
      return layer;
    });
    setShapeLayers(highlightedLayers);
  };
}

export default CurrentFootprint;

CurrentFootprint.contextType = SearchContext;
