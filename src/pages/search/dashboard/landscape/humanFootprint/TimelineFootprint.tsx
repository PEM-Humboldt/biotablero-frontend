import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import formatNumber from "utils/format";
import matchColor from "utils/matchColor";
import processDataCsv from "utils/processDataCsv";
import BackendAPI from "pages/search/utils/backendAPI";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import { hfTimeline } from "pages/search/types/humanFootprint";
import { seDetails } from "pages/search/types/ecosystems";
import { textsObject } from "pages/search/types/texts";
import Lines from "pages/search/shared_components/charts/Lines";
import { wrapperMessage } from "pages/search/types/charts";
import { CartesianMarkerProps } from "@nivo/core";
import { TimelineFootprintController } from "pages/search/dashboard/landscape/humanFootprint/TimelineFootprintController";
import { shapeLayer } from "pages/search/types/layers";

type SEKeys = Record<"paramo" | "dryForest" | "wetland" | "aTotal", string>;

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

interface Props {}

interface State {
  showInfoGraph: boolean;
  hfTimeline: Array<hfTimelineExt>;
  message: wrapperMessage;
  selectedEcosystem: seDetailsExt | null;
  texts: {
    hfTimeline: textsObject;
  };
  layers: Array<shapeLayer>;
}

interface hfTimelineExt extends hfTimeline {
  label: string;
}

interface seDetailsExt extends seDetails {
  type: string;
}

class TimelineFootprint extends React.Component<Props, State> {
  mounted = false;
  TimelineHFController;

  constructor(props: Props) {
    super(props);
    this.TimelineHFController = new TimelineFootprintController();
    this.state = {
      showInfoGraph: true,
      hfTimeline: [],
      message: "loading",
      selectedEcosystem: null,
      texts: {
        hfTimeline: { info: "", cons: "", meto: "", quote: "" },
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
      setLayerError,
      setMapTitle,
    } = this.context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.TimelineHFController.setArea(areaTypeId, areaIdId.toString());

    Promise.all([
      BackendAPI.requestSEHFTimeline(areaTypeId, areaIdId, "Páramo"),
      BackendAPI.requestSEHFTimeline(areaTypeId, areaIdId, "Humedal"),
      BackendAPI.requestSEHFTimeline(
        areaTypeId,
        areaIdId,
        "Bosque Seco Tropical"
      ),
      BackendAPI.requestTotalHFTimeline(areaTypeId, areaIdId),
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

    BackendAPI.requestSectionTexts("hfTimeline")
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

    setLoadingLayer(true);

    this.TimelineHFController.getLayer()
      .then((hfPersistence) => {
        if (this.mounted) {
          this.setState(
            () => ({ layers: [hfPersistence] }),
            () => setLoadingLayer(false)
          );
          setShapeLayers(this.state.layers);
          setMapTitle({
            name: "HH - Persistencia y Ecosistemas estratégicos (EE)",
          });
        }
      })
      .catch((error) => setLayerError(error));
  }

  componentWillUnmount() {
    this.mounted = false;
    this.TimelineHFController.cancelActiveRequests();
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
    const { areaType, areaId } = this.context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    if (seType !== "aTotal") {
      BackendAPI.requestSEDetailInArea(
        areaTypeId,
        areaIdId,
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
  getLabel = (type: string): string => {
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
    const { areaType, areaId } = this.context as SearchContextValues;
    const { showInfoGraph, hfTimeline, selectedEcosystem, message, texts } =
      this.state;

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
            description={`<p>${texts.hfTimeline.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <h6>Huella humana comparada con EE</h6>
        <p>Haz clic en un ecosistema para ver su comportamiento</p>
        <div>
          <Lines
            colors={matchColor("hfTimeline")}
            data={hfTimeline}
            message={message}
            markers={changeValues}
            onClickGraphHandler={(selectedKey) => {
              this.setSelectedEcosystem(selectedKey);
              this.clickOnGraph(selectedKey);
            }}
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
            downloadName={`hf_timeline_${areaTypeId}_${areaIdId}.csv`}
            isInfoOpen={showInfoGraph}
            toggleInfo={this.toggleInfoGraph}
          />
        </div>
      </div>
    );
  }

  clickOnGraph = async (selectedKey: string) => {
    const { setShapeLayers, setLoadingLayer, setLayerError, setMapTitle } = this
      .context as SearchContextValues;

    let layerDescription = "";

    const seTitle: SEKeys = {
      paramo: "Páramos",
      dryForest: "Bosque seco tropical",
      wetland: "Humedales",
      aTotal: "Total",
    };

    if (selectedKey === "aTotal") {
      setShapeLayers(
        this.state.layers.filter((layer) =>
          ["hfPersistence"].includes(layer.id)
        )
      );
      setMapTitle({
        name: "HH - Persistencia y Ecosistemas estratégicos (EE)",
      });
    } else {
      layerDescription = `HH - Persistencia - ${
        seTitle[selectedKey as keyof SEKeys]
      }`;

      if (!this.state.layers.find((layer) => layer.id === selectedKey)) {
        setLoadingLayer(true);
        try {
          const SELayer = await this.TimelineHFController.getSELayer(
            selectedKey as keyof Omit<SEKeys, "aTotal">
          );
          this.setState(
            (prevState) => ({
              layers: [...prevState.layers, SELayer],
            }),
            () => {
              setLoadingLayer(false);
              const activeLayers = this.state.layers.filter((layer) =>
                ["hfPersistence", selectedKey].includes(layer.id)
              );
              setShapeLayers(activeLayers);
            }
          );
        } catch (error) {
          setLayerError(error instanceof Error ? error.message : String(error));
        } finally {
          setLoadingLayer(false);
        }
      } else {
        const activeLayers = this.state.layers.filter((layer) =>
          ["hfPersistence", selectedKey].includes(layer.id)
        );
        setShapeLayers(activeLayers);
      }

      setMapTitle({ name: layerDescription });
    }
  };
}

export default TimelineFootprint;

TimelineFootprint.contextType = SearchContext;
