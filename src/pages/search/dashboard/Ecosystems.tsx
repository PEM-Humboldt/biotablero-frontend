import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";

import InfoIcon from "@mui/icons-material/Info";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import TextBoxes from "@ui/TextBoxes";

import {
  transformPAValues,
  transformCoverageValues,
  transformSEAreas,
} from "pages/search/dashboard/ecosystems/transformData";

import {
  SearchLegacyCTX,
  LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { formatNumber } from "@utils/format";

import BackendAPI from "pages/search/api/backendAPI";
import SearchAPI from "pages/search/api/searchAPI";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { SEPAData } from "pages/search/types/ecosystems";
import { EcosystemsController } from "pages/search/dashboard/EcosystemsController";
import { RasterLayer } from "pages/search/types/layers";

import { Coverage } from "pages/search/dashboard/ecosystems/Coverage";
import { ProtectedAreas } from "pages/search/dashboard/ecosystems/ProtectedAreas";
import { StrategicEcosystems } from "pages/search/dashboard/ecosystems/StrategicEcosystems";
import { SmallStackedBarData } from "@composites/charts/SmallStackedBar";

export default function Ecosystems() {
  const context = useContext(SearchLegacyCTX) as LegacyContextValues;
  const { areaType, areaId, areaHa } = context;

  const controller = useMemo(() => new EcosystemsController(), []);
  const isMounted = useRef(true);

  const [showInfoMain, setShowInfoMain] = useState(false);
  const [infoShown, setInfoShown] = useState<Set<string>>(new Set());

  const [period, setPeriod] = useState<string>("");

  const [coverageData, setCoverageData] = useState<SmallStackedBarData[]>([]);
  const [PAAreas, setPAAreas] = useState([]);
  const [PATotalArea, setPATotalArea] = useState(0);
  const [PADivergentData, setPADivergentData] = useState(false);

  const [SEAreas, setSEAreas] = useState<SEPAData[]>([]);
  const [SETotalArea, setSETotalArea] = useState(0);
  const [activeSE, setActiveSE] = useState("");

  const [layers, setLayers] = useState<RasterLayer[]>([]);

  const [messages, setMessages] = useState({
    cov: "loading" as MessageWrapperType,
    pa: "loading" as MessageWrapperType,
    se: "loading" as MessageWrapperType,
  });

  const [texts, setTexts] = useState({
    ecosystems: { info: "", cons: "", meto: "", quote: "" },
    coverage: { info: "", cons: "", meto: "", quote: "" },
    pa: { info: "", cons: "", meto: "", quote: "" },
    se: { info: "", cons: "", meto: "", quote: "" },
  });

  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id.toString();
  const areaIdStr = areaIdId ?? "";
  const periodRef = useRef(period);

  useEffect(() => {
    periodRef.current = period;
  }, [period]);

  const contextRef = useRef(context);
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const switchLayer = useCallback((periodArg?: string) => {
    const contextRefCurrent = contextRef.current;

    contextRefCurrent.setLoadingLayer(true);
    contextRefCurrent.setMapTitle({ name: "Coberturas" });

    const p = periodArg ?? periodRef.current;
    if (!p) {
      contextRefCurrent.setRasterLayers([]);
      return;
    }

    controller
      .getCoveragesLayers(p)
      .then((layersRes) => {
        if (!isMounted.current) return;
        setLayers(layersRes);
        contextRefCurrent.setRasterLayers(layersRes);
        contextRefCurrent.setLoadingLayer(false);
        contextRefCurrent.setMapTitle({ name: "Coberturas" });
      })
      .catch((e) => {
        if (!isMounted.current) return;
        contextRefCurrent.setLoadingLayer(false);
        if (!e.toString().includes("request canceled")) {
          contextRefCurrent.setLayerError?.(e.toString());
        }
      });
  }, []);

  useEffect(() => {
    isMounted.current = true;
    if (!areaTypeId || !areaIdId) return;

    controller.setArea(areaTypeId, areaIdId);

    switchLayer();

    SearchAPI.requestMetricsValues<"Coverage">("Coverage", Number(areaIdId))
      .then((res) => {
        if (!isMounted.current) return;

        const obtainedPeriod = res[0]?.ano ?? "";
        setPeriod(obtainedPeriod);

        setCoverageData(transformCoverageValues(res));
        setMessages((m) => ({ ...m, cov: null }));

        switchLayer(obtainedPeriod);
      })
      .catch(() => {
        if (!isMounted.current) return;
        setMessages((m) => ({ ...m, cov: "no-data" }));
        contextRef.current.setLoadingLayer(false);
      });

    // TEXTS
    ["ecosystems", "coverage", "pa", "se"].forEach((section) =>
      BackendAPI.requestSectionTexts(section)
        .then((res) => {
          if (!isMounted.current) return;
          setTexts((t) => ({ ...t, [section]: res }));
        })
        .catch(() => {
          if (!isMounted.current) return;
          setTexts((t) => ({ ...t, [section]: {} }));
        }),
    );

    return () => {
      isMounted.current = false;
      context.clearLayers();
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId]);

  /**
   * Toggles the visibility state of the main tooltip.
   */
  const toggleInfoGeneral = () => setShowInfoMain((v) => !v);

  /**
   * Toggles the display of a specific help section.
   *
   * @param {string} value - Section id
   */
  const toggleInfo = (value: string) => {
    setInfoShown((prev) => {
      const newSet = new Set(prev);
      newSet.has(value) ? newSet.delete(value) : newSet.add(value);
      return newSet;
    });
  };

  /**
   * Set active strategic ecosystem graph
   *
   * @param {String} se selected strategic ecosystem
   */
  const switchActiveSEHandler = (se: string) => {
    setActiveSE((prev) => {
      const newVal = prev !== se && se !== "" ? se : "";
      if (newVal === "") switchLayer();
      return newVal;
    });
  };

  /**
   * Set the selected layer to highlight
   *  @param {string} selectedKey Special Ecosystem type
   */
  const clickOnGraph = (selectedKey: string) => {
    context.setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      })),
    );
  };

  const resetActiveSE = () => {
    if (activeSE) setActiveSE("");
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
        {/* COVERAGE */}
        <Coverage
          coverage={coverageData}
          infoOpen={infoShown.has("coverage")}
          toggleInfo={() => toggleInfo("coverage")}
          texts={texts.coverage}
          messages={messages.cov}
          areaIdStr={areaIdStr}
          onClickGraph={clickOnGraph}
          resetActiveSE={resetActiveSE}
        />

        {/* PROTECTED AREAS */}
        {/*}
        <ProtectedAreas
          PAAreas={PAAreas}
          PATotalArea={PATotalArea}
          PADivergentData={PADivergentData}
          areaHa={areaHa!}
          infoOpen={infoShown.has("pa")}
          toggleInfo={() => toggleInfo("pa")}
          texts={texts.pa}
          messages={messages.pa}
          areaIdStr={areaIdStr}
        />
        {*/}

        {/* STRATEGIC ECOSYSTEMS */}
        {/*}
        <StrategicEcosystems
          SEAreas={SEAreas}
          SETotalArea={SETotalArea}
          areaHa={areaHa!}
          activeSE={activeSE}
          infoOpen={infoShown.has("se")}
          toggleInfo={() => toggleInfo("se")}
          texts={texts.se}
          messages={messages.se}
          areaIdStr={areaIdStr}
          setActiveSE={setActiveSE}
          isLoading={messages.se === "loading"}
          noData={messages.se === "no-data"}
        />
        {*/}
      </div>
    </div>
  );
}
