import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import DownloadCSV from "pages/search/shared_components/DownloadCSV";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import formatNumber from "utils/format";
import matchColor from "utils/matchColor";
import BackendAPI from "utils/backendAPI";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import {
  currentSEPAConn,
  SEPAEcosystems,
} from "pages/search/types/connectivity";
import { CurrentSEPAConnectivityController } from "pages/search/drawer/landscape/connectivity/CurrentSEPAConnectivityController";
import { textsObject } from "pages/search/types/texts";
import LargeStackedBar from "pages/search/shared_components/charts/LargeStackedBar";
import { wrapperMessage } from "pages/search/types/charts";

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
  layers: Array<any>;
}

class CurrentSEPAConnectivity extends React.Component<Props, State> {
  static contextType = SearchContext;
  mounted = false;
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
      areaId,
      geofenceId,
      setShapeLayers,
      setLoadingLayer,
      setActiveLayer,
    } = this.context as SearchContextValues;

    this.CurrentSEPACController.setArea(areaId, geofenceId.toString());

    BackendAPI.requestCurrentSEPAConnectivity(areaId, geofenceId, "Páramo")
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
      areaId,
      geofenceId,
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

    BackendAPI.requestCurrentSEPAConnectivity(areaId, geofenceId, "Humedal")
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

    setLoadingLayer(true, false);

    const newActiveLayer = {
      id: "CurrentSEPAConn",
      name: "Conectividad de áreas protegidas y Ecosistemas estratégicos (EE)",
    };

    Promise.all([
      this.CurrentSEPACController.getGeofence(),
      this.CurrentSEPACController.getLayer(),
    ])
      .then(([geofenceLayer, CurrentSEPAConn]) => {
        if (this.mounted) {
          this.setState(
            () => ({ layers: [geofenceLayer, CurrentSEPAConn] }),
            () => setLoadingLayer(false, false)
          );
          setShapeLayers(this.state.layers);
          setActiveLayer(newActiveLayer);
        }
      })
      .catch(() => setLoadingLayer(false, true));
  }

  componentWillUnmount() {
    this.mounted = false;
    const { setShapeLayers } = this.context as SearchContextValues;
    this.CurrentSEPACController.cancelActiveRequests();
    setShapeLayers([]);
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
    const { areaId, geofenceId } = this.context as SearchContextValues;
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
              filename={`bt_conn_paramo_${areaId}_${geofenceId}.csv`}
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
              filename={`bt_conn_dryforest_${areaId}_${geofenceId}.csv`}
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
              filename={`bt_conn_wetland_${areaId}_${geofenceId}.csv`}
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
}

export default CurrentSEPAConnectivity;

CurrentSEPAConnectivity.contextType = SearchContext;
