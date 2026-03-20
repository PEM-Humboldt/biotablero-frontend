import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import { PointFilledLegend } from "@ui/CssLegends";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { matchColor } from "pages/search/utils/matchColor";
import BackendAPI from "pages/search/api/backendAPI";
import { formatNumber } from "@utils/format";
import TextBoxes from "@ui/TextBoxes";

import { currentPAConn, DPCKeys, DPC } from "pages/search/types/connectivity";
import { textsObject } from "pages/search/types/texts";
import { SmallBars } from "@composites/charts/SmallBars";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import LargeStackedBar from "@composites/charts/LargeStackedBar";
import { CurrentPAConnectivityController } from "pages/search/dashboard/landscape/connectivity/CurrentPAConnectivityController";
import { ShapeLayer } from "pages/search/types/layers";
import colorPalettes from "pages/search/utils/colorPalettes";

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
    conn: MessageWrapperType;
    dpc: MessageWrapperType;
  };
  texts: {
    paConnCurrent: textsObject;
    paConnDPC: textsObject;
  };
  layers: Array<ShapeLayer>;
}

class CurrentPAConnectivity extends React.Component<Props, currentPAConnState> {
  static contextType = SearchLegacyCTX;
  mounted = false;
  componentName = "currentPAConn";
  CPACController;

  constructor(props: Props) {
    super(props);
    this.CPACController = new CurrentPAConnectivityController();
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
    } = this.context as LegacyContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.CPACController.setArea(areaTypeId, areaIdId);

    BackendAPI.requestCurrentPAConnectivity(areaTypeId, areaIdId)
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

    BackendAPI.requestDPC(areaTypeId, areaIdId, 5)
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

    setLoadingLayer(true);

    this.CPACController.getLayer()
      .then((currentPAConn) => {
        if (this.mounted) {
          this.setState(
            () => ({ layers: [currentPAConn] }),
            () => setLoadingLayer(false),
          );
          setShowAreaLayer(true);
          setShapeLayers(this.state.layers);
          setMapTitle({ name: "Conectividad de áreas protegidas" });
        }
      })
      .catch((error) => setLayerError(error));
  }

  componentWillUnmount() {
    this.mounted = false;
    this.CPACController.cancelActiveRequests();
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
    const { areaType, areaId } = this.context as LegacyContextValues;
    const {
      currentPAConnData,
      dpcData,
      prot,
      infoShown,
      messages: { conn, dpc: dpcMess },
      texts,
    } = this.state;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    const graphData = this.CPACController.getGraphData(dpcData);

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
              loadStatus={conn}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas"
              units="ha"
              colors={(key: string | number) =>
                matchColor("currentPAConn")(key) || colorPalettes.default[0]
              }
              padding={0.25}
            />
            <TextBoxes
              consText={texts.paConnCurrent.cons}
              metoText={texts.paConnCurrent.meto}
              quoteText={texts.paConnCurrent.quote}
              downloadData={currentPAConnData}
              downloadName={`conn_current_${areaTypeId}_${areaIdId}.csv`}
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
                  backgroundColor:
                    matchColor("timelinePAConn")("prot") ||
                    colorPalettes.default[0],
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
              loadStatus={dpcMess}
              colors={(key: string | number) =>
                matchColor("dpc")(key) || colorPalettes.default[0]
              }
              onClickHandler={(selected: string) => {
                this.highlightFeature(selected);
              }}
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
            downloadName={`conn_dpc_${areaTypeId}_${areaIdId}.csv`}
            isInfoOpen={infoShown.has("dpc")}
            toggleInfo={() => this.toggleInfo("dpc")}
          />
        </div>
      </div>
    );
  }

  /**
   * Highlight an specific feature of the Currenta PA layer
   *
   * @param {string} selectedKey Id of the feature
   */
  highlightFeature = (selectedKey: string) => {
    const { setShapeLayers } = this.context as LegacyContextValues;
    const { layers } = this.state;
    const highlightedLayers = layers.map((layer) => {
      if (layer.id === "currentPAConn") {
        layer.layerStyle = this.CPACController.setLayerStyle(selectedKey);
      }
      return layer;
    });
    setShapeLayers(highlightedLayers);
  };
}

export default CurrentPAConnectivity;
