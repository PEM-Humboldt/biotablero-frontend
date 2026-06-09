import { useContext, useEffect, useReducer, useRef } from "react";
import InfoIcon from "@mui/icons-material/Info";

import { PointFilledLegend } from "@ui/CssLegends";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import { Button } from "@ui/shadCN/component/button";
import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import BackendAPI from "pages/search/api/backendAPI";
import { matchColor } from "pages/search/utils/matchColor";
import TextBoxes from "@ui/TextBoxes";

import { DPC, DPCKeys } from "pages/search/types/connectivity";
import { textsObject } from "pages/search/types/texts";
import {
  SmallBars,
  SmallBarsData,
  type SmallBarTooltip,
} from "@composites/charts/SmallBars";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { CurrentPAConnectivityController } from "pages/search/dashboard/landscape/connectivity/CurrentPAConnectivityController";

const legendDPCCategories = {
  muy_bajo: "Muy bajo",
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
  muy_alto: "Muy Alto",
};

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
    paConnDPC: textsObject;
  };
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
  | { type: "SET_TEXTS"; payload: textsObject };

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
    default:
      return state;
  }
}

function CurrentPAConnectivity(_: Props) {
  const context = useContext(SearchLegacyCTX) as LegacyContextValues;
  const { areaType, areaId } = context;

  const controllerRef = useRef(new CurrentPAConnectivityController());
  const mountedRef = useRef(false);
  const dpcRequestIdRef = useRef(0);

  const [state, dispatch] = useReducer(reducer, initialState);

  const loadDpcData = (showLowestDpc: boolean) => {
    dispatch({ type: "SET_SHOW_LOWEST", payload: showLowestDpc });

    const requestId = ++dpcRequestIdRef.current;

    controllerRef.current
      .getDpcData(showLowestDpc)
      .then((result) => {
        if (!mountedRef.current || requestId !== dpcRequestIdRef.current)
          return;
        dispatch({ type: "DPC_SUCCEEDED", payload: result });
      })
      .catch(() => {
        if (!mountedRef.current || requestId !== dpcRequestIdRef.current)
          return;
        dispatch({ type: "DPC_FAILED" });
      });
  };

  useEffect(() => {
    if (!areaType || !areaId) {
      return;
    }

    mountedRef.current = true;
    const areaTypeId = areaType.id;
    const areaIdId = areaId.id.toString();

    controllerRef.current.setArea(areaTypeId, areaIdId);
    dpcRequestIdRef.current += 1;

    loadDpcData(false);

    BackendAPI.requestSectionTexts("paConnDPC")
      .then((res) => {
        if (!mountedRef.current) return;
        dispatch({ type: "SET_TEXTS", payload: res });
      })
      .catch(() => {
        if (!mountedRef.current) return;
        dispatch({
          type: "SET_TEXTS",
          payload: { info: "", cons: "", meto: "", quote: "" },
        });
      });

    return () => {
      mountedRef.current = false;
      controllerRef.current.cancelActiveRequests();
    };
  }, [areaType, areaId]);

  const toggleInfo = (value: string) => {
    dispatch({ type: "TOGGLE_INFO", payload: value });
  };

  const toggleDpcMode = () => {
    loadDpcData(!state.showLowestDpc);
  };

  const { dpcData, showLowestDpc, infoShown, messages, texts, graphData } =
    state;
  const areaTypeId = areaType!.id;
  const areaIdId = areaId!.id.toString();

  return (
    <div className="graphcontainer pt6">
      <div>
        <h6>Aporte de las áreas protegidas a la conectividad</h6>
        <div className="mb2 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleDpcMode}
          >
            {showLowestDpc ? "Áreas con mayor dPC" : "Áreas con menor dPC"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {showLowestDpc
              ? "Áreas que menos aportan."
              : "Áreas que más aportan."}
          </span>
        </div>
        <IconTooltip title="Interpretación">
          <InfoIcon
            className={`downSpecial${infoShown.has("dpc") ? " activeBox" : ""}`}
            onClick={() => toggleInfo("dpc")}
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
          {dpcData.length > 0 && (
            <SmallBars
              data={graphData.transformedData}
              keys={graphData.keys}
              tooltips={graphData.tooltips}
              loadStatus={messages.dpc}
              colors={matchColor("dpc")}
              onClickHandler={() => {}}
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
          toggleInfo={() => toggleInfo("dpc")}
        />
      </div>
    </div>
  );
}

export default CurrentPAConnectivity;
