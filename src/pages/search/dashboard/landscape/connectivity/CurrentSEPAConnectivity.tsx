import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import DownloadCSV from "pages/search/shared_components/DownloadCSV";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import formatNumber from "pages/search/utils/format";
import matchColor from "pages/search/utils/matchColor";
import BackendAPI from "pages/search/utils/backendAPI";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import {
  currentSEPAConn,
  SEPAEcosystems,
} from "pages/search/types/connectivity";
import { CurrentSEPAConnectivityController } from "pages/search/dashboard/landscape/connectivity/CurrentSEPAConnectivityController";
import { textsObject } from "pages/search/types/texts";
import LargeStackedBar from "pages/search/shared_components/charts/LargeStackedBar";
import { wrapperMessage } from "pages/search/types/charts";
import { shapeLayer } from "pages/search/types/layers";

const getLabel = {
  unprot: "No protegida",
  prot_conn: "Protegida conectada",
  prot_unconn: "Protegida no conectada",
};

interface Props {}

interface State {
  showInfoGraph: boolean;
  currentPAConnParamo: Array<currentSEPAConn>;
  currentPAConnDryForest: Array<currentSEPAConn>;
  currentPAConnWetland: Array<currentSEPAConn>;
  selectedEcosystem: typeof SEPAEcosystems[number] | null;
  protParamo: number;
  protDryForest: number;
  protWetland: number;
  messages: {
    paramo: wrapperMessage;
    dryForest: wrapperMessage;
    wetland: wrapperMessage;
  };
  texts: {
    paConnSE: textsObject;
  };
  layers: Array<shapeLayer>;
}

class CurrentSEPAConnectivity extends React.Component<Props, State> {
  static contextType = SearchContext;
  mounted = false;
  componentName = "currentSEPAConn";
  CurrentSEPACController;

  constructor(props: Props) {
    super(props);
    this.CurrentSEPACController = new CurrentSEPAConnectivityController();
    this.state = {
      showInfoGraph: true,
      currentPAConnParamo: [],
      currentPAConnDryForest: [],
      currentPAConnWetland: [],
      selectedEcosystem: null,
      protParamo: 0,
      protDryForest: 0,
      protWetland: 0,
      messages: {
        paramo: "loading",
        dryForest: "loading",
        wetland: "loading",
      },
      texts: {
        paConnSE: { info: "", cons: "", meto: "", quote: "" },
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
      setShowAreaLayer,
    } = this.context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.CurrentSEPACController.setArea(areaTypeId, areaIdId);

    BackendAPI.requestCurrentSEPAConnectivity(areaTypeId, areaIdId, "Páramo")
      .then((res: Array<currentSEPAConn>) => {
        if (this.mounted) {
          let protParamo = 0;
          const protConn = res.find((item) => item.key === "prot_conn");
          const protUnconn = res.find((item) => item.key === "prot_unconn");
          if (protConn && protUnconn) {
            protParamo = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState((prev) => ({
            currentPAConnParamo: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protParamo,
            messages: {
              ...prev.messages,
              paramo: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            paramo: "no-data",
          },
        }));
      });

    BackendAPI.requestCurrentSEPAConnectivity(
      areaTypeId,
      areaIdId,
      "Bosque Seco Tropical"
    )
      .then((res: Array<currentSEPAConn>) => {
        if (this.mounted) {
          let protDryForest = 0;
          const protConn = res.find((item) => item.key === "prot_conn");
          const protUnconn = res.find((item) => item.key === "prot_unconn");
          if (protConn && protUnconn) {
            protDryForest = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState((prev) => ({
            currentPAConnDryForest: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protDryForest,
            messages: {
              ...prev.messages,
              dryForest: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            dryForest: "no-data",
          },
        }));
      });

    BackendAPI.requestCurrentSEPAConnectivity(areaTypeId, areaIdId, "Humedal")
      .then((res: Array<currentSEPAConn>) => {
        if (this.mounted) {
          let protWetland = 0;
          const protConn = res.find((item) => item.key === "prot_conn");
          const protUnconn = res.find((item) => item.key === "prot_unconn");
          if (protConn && protUnconn) {
            protWetland = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState((prev) => ({
            currentPAConnWetland: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protWetland,
            messages: {
              ...prev.messages,
              wetland: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            wetland: "no-data",
          },
        }));
      });

    BackendAPI.requestSectionTexts("paConnSE")
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { paConnSE: res } });
        }
      })
      .catch(() => {});

    setLoadingLayer(true);
    setMapTitle({ name: "" });

    this.CurrentSEPACController.getLayer()
      .then((currentSEPAConn) => {
        if (this.mounted) {
          this.setState(
            () => ({ layers: [currentSEPAConn] }),
            () => setLoadingLayer(false)
          );
          setShowAreaLayer(true);
          setShapeLayers(this.state.layers);
          setMapTitle({
            name: "Conectividad de áreas protegidas y Ecosistemas estratégicos (EE)",
          });
        }
      })
      .catch((error) => setLayerError(error));
  }

  componentWillUnmount() {
    this.mounted = false;
    this.CurrentSEPACController.cancelActiveRequests();
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
      currentPAConnParamo,
      currentPAConnDryForest,
      currentPAConnWetland,
      showInfoGraph,
      selectedEcosystem,
      protParamo,
      protDryForest,
      protWetland,
      messages: { paramo, dryForest, wetland },
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
            description={`<p>${texts.paConnSE.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h3>Haz clic en la gráfica para seleccionar un EE</h3>
          <h6
            className={
              selectedEcosystem === "paramo" ? "h6Selected" : undefined
            }
          >
            Páramo
          </h6>
          {currentPAConnParamo && currentPAConnParamo.length > 0 && (
            <DownloadCSV
              data={currentPAConnParamo}
              filename={`bt_conn_paramo_${areaTypeId}_${areaIdId}.csv`}
            />
          )}
          <div className="svgPointer">
            <LargeStackedBar
              data={currentPAConnParamo}
              message={paramo}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas Páramo"
              units="ha"
              colors={matchColor("currentPAConn")}
              padding={0.25}
              onClickGraphHandler={() => {
                this.setState({ selectedEcosystem: "paramo" });
                this.clickOnGraph("paramoPAConn");
              }}
            />
          </div>
          {currentPAConnParamo.length > 0 && (
            <div>
              <h6 className="innerInfo">Porcentaje de área protegida</h6>
              <h5
                className="innerInfoH5"
                style={{
                  backgroundColor: matchColor("timelinePAConn")("prot"),
                }}
              >
                {`${formatNumber(protParamo, 2)}%`}
              </h5>
            </div>
          )}
          <h6
            className={
              selectedEcosystem === "dryForest" ? "h6Selected" : undefined
            }
          >
            Bosque Seco Tropical
          </h6>
          {currentPAConnDryForest && currentPAConnDryForest.length > 0 && (
            <DownloadCSV
              data={currentPAConnDryForest}
              filename={`bt_conn_dryforest_${areaTypeId}_${areaIdId}.csv`}
            />
          )}
          <div className="svgPointer">
            <LargeStackedBar
              data={currentPAConnDryForest}
              message={dryForest}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas Bosque Seco Tropical"
              units="ha"
              colors={matchColor("currentPAConn")}
              padding={0.25}
              onClickGraphHandler={() => {
                this.setState({ selectedEcosystem: "dryForest" });
                this.clickOnGraph("dryForestPAConn");
              }}
            />
          </div>
          {currentPAConnDryForest.length > 0 && (
            <div>
              <h6 className="innerInfo">Porcentaje de área protegida</h6>
              <h5
                className="innerInfoH5"
                style={{
                  backgroundColor: matchColor("timelinePAConn")("prot"),
                }}
              >
                {`${formatNumber(protDryForest, 2)}%`}
              </h5>
            </div>
          )}
          <h6
            className={
              selectedEcosystem === "wetland" ? "h6Selected" : undefined
            }
          >
            Humedal
          </h6>
          {currentPAConnWetland && currentPAConnWetland.length > 0 && (
            <DownloadCSV
              data={currentPAConnWetland}
              filename={`bt_conn_wetland_${areaTypeId}_${areaIdId}.csv`}
            />
          )}
          <div className="svgPointer">
            <LargeStackedBar
              data={currentPAConnWetland}
              message={wetland}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas Humedal"
              units="ha"
              colors={matchColor("currentPAConn")}
              padding={0.25}
              onClickGraphHandler={() => {
                this.setState({ selectedEcosystem: "wetland" });
                this.clickOnGraph("wetlandPAConn");
              }}
            />
          </div>
          {currentPAConnWetland.length > 0 && (
            <div>
              <h6 className="innerInfo">Porcentaje de área protegida</h6>
              <h5
                className="innerInfoH5"
                style={{
                  backgroundColor: matchColor("timelinePAConn")("prot"),
                }}
              >
                {`${formatNumber(protWetland, 2)}%`}
              </h5>
            </div>
          )}
          <TextBoxes
            consText={texts.paConnSE.cons}
            metoText={texts.paConnSE.meto}
            quoteText={texts.paConnSE.quote}
            isInfoOpen={showInfoGraph}
            toggleInfo={this.toggleInfoGraph}
            downloadData={[]}
            downloadName={""}
          />
        </div>
      </div>
    );
  }

  clickOnGraph = async (layerId: string) => {
    const { setShapeLayers, setLoadingLayer, setLayerError, setMapTitle } = this
      .context as SearchContextValues;

    let layerName: string = "";
    let layerDescription: string = "";

    switch (layerId) {
      case "paramoPAConn":
        layerName = "Páramo";
        layerDescription = "Conectividad de áreas protegidas - Páramo";
        break;
      case "dryForestPAConn":
        layerName = "Bosque Seco Tropical";
        layerDescription =
          "Conectividad de áreas protegidas - Bosque Seco Tropical";
        break;
      case "wetlandPAConn":
        layerName = "Humedal";
        layerDescription = "Conectividad de áreas protegidas - Humedales";
        break;
    }

    if (!this.state.layers.find((layer) => layer.id === layerId)) {
      setLoadingLayer(true);
      try {
        const SELayer = await this.CurrentSEPACController.getSELayer(
          layerId,
          layerName
        );

        this.setState(
          (prevState) => ({
            layers: [...prevState.layers, SELayer],
          }),
          () => {
            setLoadingLayer(false);
          }
        );
      } catch (error) {
        setLayerError(error instanceof Error ? error.message : String(error));
      }
    }

    const activeLayers = this.state.layers.filter((layer) =>
      ["currentSEPAConn", layerId].includes(layer.id)
    );
    setShapeLayers(activeLayers);
    setMapTitle({ name: layerDescription });
  };
}

export default CurrentSEPAConnectivity;

CurrentSEPAConnectivity.contextType = SearchContext;
