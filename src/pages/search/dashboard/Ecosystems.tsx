import { useEffect, useContext, useReducer, useState } from "react";

import InfoIcon from "@mui/icons-material/Info";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";

import { useSearchLegacyCTX } from "pages/search/hooks/SearchContext";

import BackendAPI from "pages/search/api/backendAPI";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { EcosystemsController } from "pages/search/dashboard/EcosystemsController";
import { RasterLayer } from "pages/search/types/layers";

import { Coverage } from "pages/search/dashboard/ecosystems/Coverage";
import { ProtectedAreas } from "pages/search/dashboard/ecosystems/ProtectedAreas";
import { StrategicEcosystems } from "pages/search/dashboard/ecosystems/StrategicEcosystems";
import { SmallStackedBarData } from "@composites/charts/SmallStackedBar";

type TextsContent = { info: string; cons: string; meto: string; quote: string };

type EcosystemsState = {
  showInfoMain: boolean;
  infoShown: Set<string>;

  coverageData: SmallStackedBarData[];

  PAAreas: Array<{
    area: number;
    label: string;
    key: string;
    percentage: number;
  }>;
  PATotalArea: number;
  PADivergentData: boolean;

  layers: RasterLayer[];

  messages: {
    cov: MessageWrapperType;
    pa: MessageWrapperType;
    se: MessageWrapperType;
  };

  texts: {
    ecosystems: TextsContent;
    coverage: TextsContent;
    pa: TextsContent;
    se: TextsContent;
  };
};

type TextSection = keyof EcosystemsState["texts"];

const initialState: EcosystemsState = {
  showInfoMain: false,
  infoShown: new Set(),

  coverageData: [],

  PAAreas: [],
  PATotalArea: 0,
  PADivergentData: false,

  layers: [],

  messages: {
    cov: "loading",
    pa: "loading",
    se: "loading",
  },

  texts: {
    ecosystems: { info: "", cons: "", meto: "", quote: "" },
    coverage: { info: "", cons: "", meto: "", quote: "" },
    pa: { info: "", cons: "", meto: "", quote: "" },
    se: { info: "", cons: "", meto: "", quote: "" },
  },
};

type EcosystemsAction =
  | { type: "TOGGLE_MAIN_INFO" }
  | { type: "TOGGLE_SECTION_INFO"; payload: string }
  | { type: "COVERAGE_VALUES_SUCCEEDED"; payload: SmallStackedBarData[] }
  | { type: "COVERAGE_LAYERS_SUCCEEDED"; payload: RasterLayer[] }
  | { type: "COVERAGE_VALUES_FAILED" }
  | { type: "PROTECTED_AREAS_VALUES_SUCCEEDED"; payload: SmallStackedBarData[] }
  | { type: "PROTECTED_AREAS_VALUES_FAILED" }
  | {
      type: "SET_TEXTS";
      payload: { section: keyof EcosystemsState["texts"]; value: TextsContent };
    };

const isNoProtected = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s|_/g, "") === "noprotegida";

function ecosystemsReducer(
  state: EcosystemsState,
  action: EcosystemsAction,
): EcosystemsState {
  switch (action.type) {
    case "TOGGLE_MAIN_INFO":
      return { ...state, showInfoMain: !state.showInfoMain };

    case "TOGGLE_SECTION_INFO": {
      const newSet = new Set(state.infoShown);
      newSet.has(action.payload)
        ? newSet.delete(action.payload)
        : newSet.add(action.payload);

      return { ...state, infoShown: newSet };
    }

    case "COVERAGE_VALUES_SUCCEEDED":
      return {
        ...state,
        coverageData: action.payload,
        messages: {
          ...state.messages,
          cov: null,
        },
      };

    case "COVERAGE_LAYERS_SUCCEEDED":
      return { ...state, layers: action.payload };

    case "COVERAGE_VALUES_FAILED":
      return {
        ...state,
        messages: {
          ...state.messages,
          cov: "no-data",
        },
      };

    case "PROTECTED_AREAS_VALUES_SUCCEEDED":
      return {
        ...state,
        PAAreas: action.payload,
        PATotalArea: action.payload.reduce(
          (acc, item) => (isNoProtected(item.key) ? acc : acc + item.area),
          0,
        ),
        PADivergentData: action.payload.some(
          (item) => item.percentage > 0 && item.percentage < 0.01,
        ),
        messages: {
          ...state.messages,
          pa: null,
        },
      };

    case "PROTECTED_AREAS_VALUES_FAILED":
      return {
        ...state,
        messages: {
          ...state.messages,
          pa: "no-data",
        },
      };

    case "SET_TEXTS":
      return {
        ...state,
        texts: {
          ...state.texts,
          [action.payload.section]: action.payload.value,
        },
      };

    default:
      return state;
  }
}

const controller = new EcosystemsController();

export function Ecosystems() {
  const {
    areaType,
    areaId,
    areaHa,
    setLoadingLayer,
    setRasterLayers,
    setMapTitle,
    setLayerError,
    clearLayers,
  } = useSearchLegacyCTX();
  const [hasActiveSE, setHasActiveSE] = useState(false);

  const [state, dispatch] = useReducer(ecosystemsReducer, initialState);

  const {
    showInfoMain,
    infoShown,
    coverageData,
    PAAreas,
    PATotalArea,
    PADivergentData,
    layers,
    messages,
    texts,
  } = state;

  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id;

  useEffect(() => {
    if (!areaTypeId || !areaIdId) {
      setLoadingLayer(false);
      return;
    }

    controller.setArea(areaTypeId, areaIdId);

    setLoadingLayer(true);

    controller
      .getCoverageValues()
      .then((coverageDataRes) => {
        controller
          .getCoveragesLayers()
          .then((layersRes) => {
            dispatch({ type: "COVERAGE_LAYERS_SUCCEEDED", payload: layersRes });
            setRasterLayers(layersRes);
            setLoadingLayer(false);
            setMapTitle({ name: "Coberturas" });
          })
          .catch((e) => {
            setLoadingLayer(false);
            if (!e.toString().includes("request canceled")) {
              setLayerError?.(e.toString());
            }
          });
        dispatch({
          type: "COVERAGE_VALUES_SUCCEEDED",
          payload: coverageDataRes,
        });
      })
      .catch(() => {
        dispatch({ type: "COVERAGE_VALUES_FAILED" });
        setLoadingLayer(false);
      });

    controller
      .getProtectedAreasValues(areaHa ?? 0)
      .then((PAAreas) => {
        dispatch({
          type: "PROTECTED_AREAS_VALUES_SUCCEEDED",
          payload: PAAreas,
        });
      })
      .catch(() => {
        dispatch({ type: "PROTECTED_AREAS_VALUES_FAILED" });
      });

    const TEXT_SECTIONS: TextSection[] = ["ecosystems", "coverage", "pa", "se"];

    TEXT_SECTIONS.forEach((section) => {
      BackendAPI.requestSectionTexts(section)
        .then((res) => {
          dispatch({
            type: "SET_TEXTS",
            payload: { section, value: res },
          });
        })
        .catch(() => {
          dispatch({
            type: "SET_TEXTS",
            payload: {
              section,
              value: { info: "", cons: "", meto: "", quote: "" },
            },
          });
        });
    });

    return () => {
      clearLayers();
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId, areaHa]);

  if (!areaType || !areaId) {
    return null;
  }

  /**
   * Toggles the visibility state of the main tooltip.
   */
  const toggleInfoGeneral = () => dispatch({ type: "TOGGLE_MAIN_INFO" });

  /**
   * Toggles the display of a specific help section.
   *
   * @param {TextSection} value - Section id
   */
  const toggleInfo = (value: TextSection) =>
    dispatch({ type: "TOGGLE_SECTION_INFO", payload: value });

  /**
   * Set the selected layer to highlight
   *  @param {string} selectedKey Special Ecosystem type
   */
  const clickOnGraph = (selectedKey: string) => {
    setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      })),
    );
  };

  const restoreCoverageLayers = () => {
    setRasterLayers(layers);
    setMapTitle({ name: "Coberturas" });
  };

  return (
    <div className="graphcard">
      <h2>
        <IconTooltip title="¿Cómo interpretar las gráficas?">
          <InfoIcon className="graphinfo" onClick={toggleInfoGeneral} />
        </IconTooltip>
      </h2>

      {showInfoMain && (
        <ShortInfo
          description={`<p>${texts.ecosystems.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}

      <div className="graphcontainer pt5">
        <Coverage
          coverage={coverageData}
          infoOpen={infoShown.has("coverage")}
          disableGraphClick={hasActiveSE}
          toggleInfo={() => toggleInfo("coverage")}
          texts={texts.coverage}
          messages={messages.cov}
          areaIdStr={`${areaIdId}`}
          onClickGraph={clickOnGraph}
        />

        <ProtectedAreas
          PAAreas={PAAreas}
          PATotalArea={PATotalArea}
          PADivergentData={PADivergentData}
          areaHa={areaHa!}
          infoOpen={infoShown.has("pa")}
          toggleInfo={() => toggleInfo("pa")}
          texts={texts.pa}
          messages={messages.pa}
          areaIdStr={`${areaIdId}`}
        />

        <StrategicEcosystems
          areaTypeId={areaTypeId!}
          areaIdId={areaIdId!}
          areaHa={areaHa!}
          texts={texts.se}
          onActiveSEChange={setHasActiveSE}
          onSEDetailClose={restoreCoverageLayers}
        />
      </div>
    </div>
  );
}
