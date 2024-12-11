import React, { Component, createRef } from "react";
import InfoIcon from "@mui/icons-material/Info";

import { PointFilledLegend } from "pages/search/shared_components/CssLegends";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import matchColor from "utils/matchColor";
import BackendAPI from "utils/backendAPI";
import formatNumber from "utils/format";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import { currentPAConn, DPCKeys, DPC } from "pages/search/types/connectivity";
import { textsObject } from "pages/search/types/texts";
import SmallBars from "pages/search/shared_components/charts/SmallBars";
import { wrapperMessage } from "pages/search/types/charts";
import LargeStackedBar from "pages/search/shared_components/charts/LargeStackedBar";
import { PAConnectivityController } from "pages/search/drawer/landscape/connectivity/PAConnectivityController";
import { shapeLayer } from "pages/search/types/layers";

const getLabel = {
  unprot: "No protegida",
  prot_conn: "Protegida conectada",
  prot_unconn: "Protegida no conectada",
};

const legendDPCCategories = {
  muy_bajo: "Muy bajo",
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
  muy_alto: "Muy Alto",
};

interface currentPAConnExt extends currentPAConn {
  label: string;
}

interface Props {}

interface currentPAConnState {
  infoShown: Set<string>;
  currentPAConnData: Array<currentPAConnExt>;
  dpcData: Array<DPC>;
  prot: number;
  messages: {
    conn: wrapperMessage;
    dpc: wrapperMessage;
  };
  texts: {
    paConnCurrent: textsObject;
    paConnDPC: textsObject;
  };
  layers: Array<shapeLayer>;
  activeLayer: string;
}

class CurrentPAConnectivity extends React.Component<Props, currentPAConnState> {
  mounted = false;
  PACController;

  constructor(props: Props) {
    super(props);
    this.PACController = new PAConnectivityController();
    this.mounted = false;
    this.state = {
      infoShown: new Set(["current"]),
      currentPAConnData: [],
      dpcData: [],
      prot: 0,
      messages: {
        conn: "loading",
        dpc: "loading",
      },
      texts: {
        paConnCurrent: { info: "", cons: "", meto: "", quote: "" },
        paConnDPC: { info: "", cons: "", meto: "", quote: "" },
      },
      layers: [],
      activeLayer: "",
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId } = this.context as SearchContextValues;
    this.PACController.setArea(areaId, geofenceId.toString());
    this.switchLayer();

    BackendAPI.requestCurrentPAConnectivity(areaId, geofenceId)
      .then((res: Array<currentPAConn>) => {
        if (this.mounted) {
          const protConn = res.find((item) => item.key === "prot_conn");
          const protUnconn = res.find((item) => item.key === "prot_unconn");
          this.setState((prev) => ({
            currentPAConnData: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            prot:
              protConn && protUnconn
                ? (protConn.percentage + protUnconn.percentage) * 100
                : 0,
            messages: {
              ...prev.messages,
              conn: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            conn: "no-data",
          },
        }));
      });

    BackendAPI.requestDPC(areaId, geofenceId, 5)
      .then((res: Array<DPC>) => {
        if (this.mounted) {
          this.setState((prev) => ({
            dpcData: res.reverse(),
            messages: {
              ...prev.messages,
              dpc: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            dpc: "no-data",
          },
        }));
      });

    ["paConnCurrent", "paConnDPC"].forEach((item) => {
      BackendAPI.requestSectionTexts(item)
        .then((res) => {
          if (this.mounted) {
            this.setState((prevState) => ({
              texts: { ...prevState.texts, [item]: res },
            }));
          }
        })
        .catch(() => {
          this.setState((prevState) => ({
            texts: {
              ...prevState.texts,
              [item]: { info: "", cons: "", meto: "", quote: "" },
            },
          }));
        });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    const { setShapeLayers, setLoadingLayer } = this
      .context as SearchContextValues;
    this.PACController.cancelActiveRequests();
    setShapeLayers([]);
  }

  toggleInfo = (value: string) => {
    this.setState((prev) => {
      const newState = prev;
      if (prev.infoShown.has(value)) {
        newState.infoShown.delete(value);
        return newState;
      }
      newState.infoShown.add(value);
      return newState;
    });
  };

  render() {
    const { areaId, geofenceId } = this.context as SearchContextValues;
    const {
      currentPAConnData,
      dpcData,
      prot,
      infoShown,
      messages: { conn, dpc: dpcMess },
      texts,
    } = this.state;
    const graphData = this.PACController.getCPAGraphData(dpcData);

    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`graphinfo${
                infoShown.has("current") ? " activeBox" : ""
              }`}
              onClick={() => this.toggleInfo("current")}
            />
          </IconTooltip>
        </h2>
        {infoShown.has("current") && (
          <ShortInfo
            description={`<p>${texts.paConnCurrent.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h6>Conectividad áreas protegidas</h6>
          <div>
            <LargeStackedBar
              data={currentPAConnData}
              message={conn}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas"
              units="ha"
              colors={matchColor("currentPAConn")}
              padding={0.25}
            />
            <TextBoxes
              consText={texts.paConnCurrent.cons}
              metoText={texts.paConnCurrent.meto}
              quoteText={texts.paConnCurrent.quote}
              downloadData={currentPAConnData}
              downloadName={`conn_current_${areaId}_${geofenceId}.csv`}
              toggleInfo={() => this.toggleInfo("current")}
              isInfoOpen={infoShown.has("current")}
            />
          </div>
          {currentPAConnData.length > 0 && (
            <div>
              <h6 className="innerInfo">Porcentaje de área protegida</h6>
              <h5
                className="innerInfoH5"
                style={{
                  backgroundColor: matchColor("timelinePAConn")("prot"),
                }}
              >
                {`${formatNumber(prot, 2)}%`}
              </h5>
            </div>
          )}
          <h6>Aporte de las áreas protegidas a la conectividad</h6>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${
                infoShown.has("dpc") ? " activeBox" : ""
              }`}
              onClick={() => this.toggleInfo("dpc")}
            />
          </IconTooltip>
          {infoShown.has("dpc") && (
            <ShortInfo
              description={`<p>${texts.paConnDPC.info}</p>`}
              className="graphinfo2"
              collapseButton={false}
            />
          )}
          <h3 className="innerInfoH3">
            Haz clic en un área protegida para visualizarla
          </h3>
          <div>
            <SmallBars
              data={graphData.transformedData}
              keys={graphData.keys}
              tooltips={graphData.tooltips}
              message={dpcMess}
              colors={matchColor("dpc")}
              onClickHandler={(selected: string) =>
                this.highlightFeature(selected)
              }
              margin={{
                bottom: 50,
                left: 40,
              }}
              axisX={{
                enabled: true,
                legend: "dPC",
                format: ".2f",
              }}
              enableLabel={true}
            />
          </div>
          <div className="dpcLegend">
            {DPCKeys.map((cat) => (
              <PointFilledLegend color={matchColor("dpc")(cat)} key={cat}>
                {legendDPCCategories[cat]}
              </PointFilledLegend>
            ))}
          </div>
          <TextBoxes
            consText={texts.paConnDPC.cons}
            metoText={texts.paConnDPC.meto}
            quoteText={texts.paConnDPC.quote}
            downloadData={dpcData}
            downloadName={`conn_dpc_${areaId}_${geofenceId}.csv`}
            isInfoOpen={infoShown.has("dpc")}
            toggleInfo={() => this.toggleInfo("dpc")}
          />
        </div>
      </div>
    );
  }

  switchLayer = async () => {
    const { setShapeLayers, setLoadingLayer, setActiveLayer } = this
      .context as SearchContextValues;
    setLoadingLayer(true, false);

    const layerName = "currentPAConn";
    const newActiveLayer = {
      id: layerName,
      name: "Conectividad de áreas protegidas",
    };

    Promise.all([
      this.PACController.getGeofenceLayer(true),
      this.PACController.getLayers(layerName),
    ]).then(([geofenceLayer, currentPAConn]) => {
      if (this.mounted) {
        this.setState(
          (prevState) => ({
            layers: [...prevState.layers, geofenceLayer, currentPAConn],
          }),
          () => setLoadingLayer(false, false, false)
        );
        setShapeLayers(this.state.layers);
        setActiveLayer(newActiveLayer);
      }
    });
  };

  /**
   * Highlight an specific feature of the current active layer
   *
   * @param {object} selectedKey Id of the feature
   */
  highlightFeature = (selectedKey: string) => {
    const { setShapeLayers } = this.context as SearchContextValues;

    this.setState(
      (prevState) => {
        const newLayers = [...prevState.layers];
        const activeLayer = newLayers.find(
          (layer) => layer.id === "currentPAConn"
        );

        if (activeLayer) {
          activeLayer.layerStyle = (feature: { properties: any }) => {
            if (
              feature.properties.key === selectedKey ||
              feature.properties.id === selectedKey
            ) {
              return {
                weight: 1,
                fillOpacity: 1,
              };
            }
            return this.PACController.featureStyle("dpc")(feature);
          };
        }

        return { layers: newLayers };
      },
      () => setShapeLayers(this.state.layers)
    );
  };
}

export default CurrentPAConnectivity;

CurrentPAConnectivity.contextType = SearchContext;
