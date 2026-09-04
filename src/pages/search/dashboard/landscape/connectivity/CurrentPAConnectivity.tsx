import { useContext, useEffect, useReducer, useRef } from "react";
import InfoIcon from "@mui/icons-material/Info";

import { PointFilledLegend } from "@ui/CssLegends";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import { Button } from "@ui/shadCN/component/button";
import {
  LegacyContextValues,
  SearchLegacyCTX,
} from "pages/search/hooks/SearchContext";

import { matchColor } from "pages/search/utils/matchColor";
import TextBoxes from "@ui/TextBoxes";

import { DPC } from "pages/search/types/connectivity";
import { TextsObject } from "pages/search/types/texts";
import { getMetricTexts } from "pages/search/utils/texts";
import {
  SmallBars,
  SmallBarsData,
  type SmallBarTooltip,
} from "@composites/charts/SmallBars";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { CurrentPAConnectivityController } from "pages/search/dashboard/landscape/connectivity/CurrentPAConnectivityController";
import colorPalettes from "pages/search/utils/colorPalettes";
import { RasterLayer } from "pages/search/types/layers";

const legendDPCCategories = {
  muy_bajo: "Muy bajo",
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
  muy_alto: "Muy Alto",
};
const DPCCats = (
  Object.keys(legendDPCCategories) as Array<keyof typeof legendDPCCategories>
).reverse();

interface Props {}

interface CurrentPAConnState {
  infoShown: Set<string>;
  dpcData: Array<DPC>;
  showLowestDpc: boolean;
  messages: {
    dpc: MessageWrapperType;
  };
  graphData: {
    transformedData: Array<SmallBarsData>;
    keys: Array<string>;
    tooltips: Array<SmallBarTooltip>;
  };
  texts: {
    paConnDPC: TextsObject;
  };
  layers: RasterLayer[];
}

type DpcPayload = {
  dpcData: Array<DPC>;
  graphData: {
    transformedData: Array<SmallBarsData>;
    keys: Array<string>;
    tooltips: Array<SmallBarTooltip>;
  };
};

type Action =
  | { type: "TOGGLE_INFO"; payload: string }
  | { type: "SET_SHOW_LOWEST"; payload: boolean }
  | { type: "DPC_SUCCEEDED"; payload: DpcPayload }
  | { type: "DPC_FAILED" }
  | { type: "SET_TEXTS"; payload: TextsObject }
  | { type: "PA_LAYERS_SUCCEEDED"; payload: RasterLayer[] };

const initialState: CurrentPAConnState = {
  infoShown: new Set(["dpc"]),
  dpcData: [],
  showLowestDpc: false,
  messages: {
    dpc: "loading",
  },
  graphData: {
    transformedData: [],
    keys: [],
    tooltips: [],
  },
  texts: {
    paConnDPC: { info: "", cons: "", meto: "", quote: "" },
  },
  layers: [],
};

function reducer(
  state: CurrentPAConnState,
  action: Action,
): CurrentPAConnState {
  switch (action.type) {
    case "TOGGLE_INFO": {
      const infoShown = new Set(state.infoShown);
      if (infoShown.has(action.payload)) infoShown.delete(action.payload);
      else infoShown.add(action.payload);
      return { ...state, infoShown };
    }
    case "SET_SHOW_LOWEST":
      return {
        ...state,
        showLowestDpc: action.payload,
        messages: { ...state.messages, dpc: "loading" },
      };
    case "DPC_SUCCEEDED":
      return {
        ...state,
        dpcData: action.payload.dpcData,
        graphData: action.payload.graphData,
        messages: { ...state.messages, dpc: null },
      };
    case "DPC_FAILED":
      return {
        ...state,
        messages: { ...state.messages, dpc: "no-data" },
      };
    case "SET_TEXTS":
      return { ...state, texts: { paConnDPC: action.payload } };
    case "PA_LAYERS_SUCCEEDED":
      return {
        ...state,
        layers: action.payload,
      };
    default:
      return state;
  }
}

function CurrentPAConnectivity(_: Props) {
  const context = useContext(SearchLegacyCTX) as LegacyContextValues;
  const {
    areaType,
    areaId,
    setLoadingLayer,
    setShowAreaLayer,
    setRasterLayers,
    setLayerError,
    setMapTitle,
  } = context;

  const controllerRef = useRef(new CurrentPAConnectivityController());
  const controller = controllerRef.current;

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!areaType || !areaId) {
      setLoadingLayer(false);
      return () => {
        controller.cancelActiveRequests();
      };
    }
    controller.setArea(areaType.id, areaId.id);
    setLoadingLayer(true);
    dispatch({ type: "SET_SHOW_LOWEST", payload: showLowestDpc });

    controller
      .loadSortedDpcData(false)
      .then((result) => {
        controller
          .getPALayers()
          .then((layersRes) => {
            dispatch({
              type: "PA_LAYERS_SUCCEEDED",
              payload: layersRes,
            });
            setRasterLayers(layersRes);
            setShowAreaLayer(true);
            setLoadingLayer(false);
            setMapTitle({
              name: "Conectividad de áreas protegidas",
            });
          })
          .catch((e) => {
            if (e.toString() !== "Error: request canceled") {
              setLayerError(e.toString());
            }
            setLoadingLayer(false);
          });
        dispatch({ type: "DPC_SUCCEEDED", payload: result });
      })
      .catch((error) => {
        if (error?.message === "request canceled") return;
        dispatch({ type: "DPC_FAILED" });
      });

    getMetricTexts("dpc")
      .then((res) => {
        dispatch({
          type: "SET_TEXTS",
          payload: res,
        });
      })
      .catch(() => {
        dispatch({
          type: "SET_TEXTS",
          payload: { info: "", cons: "", meto: "", quote: "" },
        });
      });

    return () => {
      controller.cancelActiveRequests();
    };
  }, [areaType, areaId]);

  const toggleInfo = (value: string) => {
    dispatch({ type: "TOGGLE_INFO", payload: value });
  };

  const toggleDpcMode = () => {
    controller
      .loadSortedDpcData(!state.showLowestDpc)
      .then((result) => {
        dispatch({ type: "SET_SHOW_LOWEST", payload: !showLowestDpc });
        dispatch({ type: "DPC_SUCCEEDED", payload: result });
      })
      .catch((error) => {
        if (error?.message === "request canceled") return;
        dispatch({ type: "DPC_FAILED" });
      });
  };

  const clickOnDPCGraph = (dpcId: string, category: string) => {
    const { layers } = state;
    setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === dpcId,
      })),
    );
  };

  const { dpcData, showLowestDpc, infoShown, messages, texts, graphData } =
    state;
  const areaTypeId = areaType!.id;
  const areaIdId = areaId!.id.toString();

  return (
    <div className="graphcontainer pt6">
      <div>
        <h6>Aporte de las áreas protegidas a la conectividad</h6>
        <IconTooltip title="Interpretación">
          <span className="iconWrapper">
            <InfoIcon
              fontSize="medium"
              className={`metrics-info-icon${infoShown.has("dpc") ? " activeBox" : ""}`}
              onClick={() => toggleInfo("dpc")}
            />
          </span>
        </IconTooltip>
        <div className="mb2 ml-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleDpcMode}
          >
            {showLowestDpc ? "Áreas con mayor dPC" : "Áreas con menor dPC"}
          </Button>
        </div>
        <div className="mb2 ml-6">
          <span className="text-sm text-muted-foreground">
            {showLowestDpc
              ? "Áreas que menos aportan."
              : "Áreas que más aportan."}
          </span>
        </div>
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
          {dpcData.length > 0 && (
            <SmallBars
              data={graphData.transformedData}
              keys={graphData.keys}
              tooltips={graphData.tooltips}
              loadStatus={messages.dpc}
              colors={(key: string) =>
                matchColor("dpc")(key) || colorPalettes.default[0]
              }
              onClickHandler={clickOnDPCGraph}
              animate={false}
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
          )}
        </div>
        <div className="dpcLegend">
          {DPCCats.map((cat) => (
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
          toggleInfo={() => toggleInfo("dpc")}
        />
      </div>
    </div>
  );
}

export default CurrentPAConnectivity;
