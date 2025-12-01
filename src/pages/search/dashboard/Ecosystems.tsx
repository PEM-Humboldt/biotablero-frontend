import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
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

  const [showInfoMain, setShowInfoMain] = useState(false);
  const [infoShown, setInfoShown] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    if (!areaTypeId || !areaIdId) return;

    controller.setArea(areaTypeId, areaIdId);

    switchLayer();

    // COVERAGE
    SearchAPI.requestMetricsValues<"Coverage">(
      "Coverage",
      Number(areaIdId),
    ).then((res) => {
        setCoverageData(transformCoverageValues(res));
        setMessages((m) => ({ ...m, cov: null }));
      })
      .catch(() => {
        setMessages((m) => ({ ...m, cov: "no-data" }));
      });

    //TODO: Habilitar las secciones comentadas cuando se esten listos los endpoints del nuevo backend

    // PROTECTED AREAS

    /*
    BackendAPI.requestProtectedAreas(areaTypeId, areaIdId)
      .then((res) => {
        if (!Array.isArray(res) || !res[0]) return;

        const total = res.reduce((acc, i) => acc + i.area, 0);
        const paAreas = transformPAValues(res, areaHa!);

        const noProt = paAreas.find((i) => i.key === "No Protegida");
        setPADivergentData(Boolean(noProt?.percentage && noProt.percentage >= 0.97));

        setPAAreas(paAreas);
        setPATotalArea(total);
        setMessages((m) => ({ ...m, pa: null }));
      })
      .catch(() => {
        setMessages((m) => ({ ...m, pa: "no-data" }));
      });
    */

    // STRATEGIC ECOSYSTEMS
    /*
    BackendAPI.requestStrategicEcosystems(areaTypeId, areaIdId)
      .then((res) => {
        if (!Array.isArray(res)) return;

        const totalObj = res.find((o) => o.type === "Total");
        const total = totalObj ? totalObj.area : 0;

        setSEAreas(res.slice(1));
        setSETotalArea(total);
        setMessages((m) => ({ ...m, se: null }));
      })
      .catch(() => {
        setMessages((m) => ({ ...m, se: "no-data" }));
      });
    */

    // TEXTS
    ["ecosystems", "coverage", "pa", "se"].forEach((section) =>
      BackendAPI.requestSectionTexts(section)
        .then((res) => {
          setTexts((t) => ({ ...t, [section]: res }));
        })
        .catch(() => {
          setTexts((t) => ({ ...t, [section]: {} }));
        }),
    );

    return () => {
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
   * Requests and updates raster layers corresponding to coverages.
   */

  const switchLayer = useCallback(() => {
    const { setRasterLayers, setLoadingLayer, setLayerError, setMapTitle } =
      context;

    setLoadingLayer(true);

    controller
      .getCoveragesLayers()
      .then((layers) => {
        setLayers(layers);
        setRasterLayers(layers);
        setLoadingLayer(false);
        setMapTitle({ name: "Coberturas" });
      })
      .catch((e) => {
        if (!e.toString().includes("request canceled")) {
          setLayerError(e.toString());
        }
      });
  }, [context]);

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
