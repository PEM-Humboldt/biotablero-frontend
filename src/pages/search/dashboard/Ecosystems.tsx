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
import EcosystemsBox from "pages/search/dashboard/ecosystems/EcosystemsBox";
import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { formatNumber } from "@utils/format";
import matchColor from "pages/search/utils/matchColor";
import BackendAPI from "pages/search/api/backendAPI";
import SmallStackedBar, {
  SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import { textsObject } from "pages/search/types/texts";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { SEPAData } from "pages/search/types/ecosystems";
import { EcosystemsController } from "pages/search/dashboard/EcosystemsController";
import { RasterLayer } from "pages/search/types/layers";
/**
 * Calculate percentage for a given value according to total
 *
 * @param {number} part value for the given part
 * @param {number} total value obtained by adding all parts
 *
 * @returns {number} percentage associated to each part
 */
const getPercentage = (part: number, total: number): number =>
  parseFloat(((part * 100) / total).toFixed(2));

interface Props {}

export default function Ecosystems(_: Props) {
  const context = useContext(SearchLegacyCTX) as LegacyContextValues;
  const { areaType, areaId, areaHa } = context;

  const controller = useMemo(() => new EcosystemsController(), []);

  const [showInfoMain, setShowInfoMain] = useState(false);
  const [infoShown, setInfoShown] = useState<Set<string>>(new Set());
  const [coverage, setCoverage] = useState<SmallStackedBarData[]>([]);
  const [PAAreas, setPAAreas] = useState<
    Array<{ area: number; label: string; key: string; percentage: number }>
  >([]);
  const [PATotalArea, setPATotalArea] = useState(0);
  const [PADivergentData, setPADivergentData] = useState(false);
  const [SEAreas, setSEAreas] = useState<SEPAData[]>([]);
  const [SETotalArea, setSETotalArea] = useState(0);
  const [activeSE, setActiveSE] = useState("");
  const [layers, setLayers] = useState<RasterLayer[]>([]);

  const [messages, setMessages] = useState<{
    cov: MessageWrapperType;
    pa: MessageWrapperType;
    se: MessageWrapperType;
  }>({
    cov: "loading",
    pa: "loading",
    se: "loading",
  });

  const [texts, setTexts] = useState<{
    ecosystems: textsObject;
    coverage: textsObject;
    pa: textsObject;
    se: textsObject;
  }>({
    ecosystems: { info: "", cons: "", meto: "", quote: "" },
    coverage: { info: "", cons: "", meto: "", quote: "" },
    pa: { info: "", cons: "", meto: "", quote: "" },
    se: { info: "", cons: "", meto: "", quote: "" },
  });

  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id.toString();

  useEffect(() => {
    if (!areaTypeId || !areaIdId) return;

    controller.setArea(areaTypeId, areaIdId);

    switchLayer();

    /** COVERAGE */
    BackendAPI.requestCoverage(areaTypeId, areaIdId)
      .then((res) => {
        setCoverage(transformCoverageValues(res));
        setMessages((m) => ({ ...m, cov: null }));
      })
      .catch(() => {
        setMessages((m) => ({ ...m, cov: "no-data" }));
      });

    /** PROTECTED AREAS */
    BackendAPI.requestProtectedAreas(areaTypeId, areaIdId)
      .then((res) => {
        if (!Array.isArray(res) || !res[0]) return;

        const total = res.map((i) => i.area).reduce((a, b) => a + b, 0);
        const paAreas = transformPAValues(res, areaHa!);

        const noProt = paAreas.find((i) => i.key === "No Protegida");
        setPADivergentData(!!noProt?.percentage && noProt.percentage >= 0.97);

        setPAAreas(paAreas);
        setPATotalArea(total);
        setMessages((m) => ({ ...m, pa: null }));
      })
      .catch(() => {
        setMessages((m) => ({ ...m, pa: "no-data" }));
      });

    /** STRATEGIC ECOSYSTEMS */
    BackendAPI.requestStrategicEcosystems(areaTypeId, areaIdId)
      .then((res) => {
        if (Array.isArray(res)) {
          const totalObj = res.find((o) => o.type === "Total");
          const total = totalObj ? totalObj.area : 0;
          setSEAreas(res.slice(1));
          setSETotalArea(total);
          setMessages((m) => ({ ...m, se: null }));
        }
      })
      .catch(() => {
        setMessages((m) => ({ ...m, se: "no-data" }));
      });

    /** TEXTS */
    ["ecosystems", "coverage", "pa", "se"].forEach((section) => {
      BackendAPI.requestSectionTexts(section)
        .then((res) => {
          setTexts((t) => ({ ...t, [section]: res }));
        })
        .catch(() => {
          setTexts((t) => ({ ...t, [section]: {} as textsObject }));
        });
    });

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
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
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
      .then((ls) => {
        setLayers(ls);
        setRasterLayers(ls);
        setLoadingLayer(false);
        setMapTitle({ name: "Coberturas" });
      })
      .catch((err) => {
        if (err.toString() !== "Error: request canceled") {
          setLayerError(err.toString());
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
    const { setRasterLayers } = context;
    setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      })),
    );
  };

  /**
   * Returns the component EcosystemsBox that contains the list of strategic ecosystems
   * @param {Array<SEPADataExt>} SEAreas area of each strategic ecosystem
   * @param {Number} SETotalArea total area of all strategic ecosystems
   *
   * @returns {node} Component to be rendered
   */
  const renderEcosystemsBox = () => {
    if (messages.se === "loading") return "Cargando...";
    if (messages.se === "no-data")
      return "No hay información de áreas protegidas en el área de consulta";
    if (areaHa === 0) return null;

    return (
      <EcosystemsBox
        SETotalArea={SETotalArea}
        SEAreas={transformSEAreas(SEAreas, areaHa!)}
        activeSE={activeSE}
        setActiveSE={switchActiveSEHandler}
      />
    );
  };

  const areaIdStr = areaIdId ?? "";

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
        {/** COVERAGE */}
        <button
          onClick={() => activeSE && switchActiveSEHandler("")}
          type="button"
          className="tittlebtn"
        >
          <h4>Cobertura</h4>
        </button>

        <IconTooltip title="Interpretación">
          <InfoIcon
            className={`downSpecial${infoShown.has("coverage") ? " activeBox" : ""}`}
            onClick={() => toggleInfo("coverage")}
          />
        </IconTooltip>

        {infoShown.has("coverage") && (
          <ShortInfo
            description={`<p>${texts.coverage.info}</p>`}
            className="graphinfo3"
            collapseButton={false}
          />
        )}

        <h6>Natural, Secundaria y Transformada:</h6>

        <div className="graficaeco">
          <div className="svgPointer">
            <SmallStackedBar
              loadStatus={messages.cov}
              data={coverage}
              units="ha"
              colors={matchColor("coverage")}
              onClickGraphHandler={clickOnGraph}
            />
          </div>
        </div>

        <TextBoxes
          downloadData={coverage}
          downloadName={`eco_coverages_${areaIdStr}.csv`}
          quoteText={texts.coverage.quote}
          metoText={texts.coverage.meto}
          consText={texts.coverage.cons}
          toggleInfo={() => toggleInfo("coverage")}
          isInfoOpen={infoShown.has("coverage")}
        />

        {/** PROTECTED AREAS */}
        <h4>
          Áreas protegidas <b>{`${formatNumber(PATotalArea, 0)} ha`}</b>
        </h4>

        <IconTooltip title="Interpretación">
          <InfoIcon
            className={`downSpecial${infoShown.has("pa") ? " activeBox" : ""}`}
            onClick={() => toggleInfo("pa")}
          />
        </IconTooltip>

        <h5>{`${getPercentage(PATotalArea, areaHa!)} %`}</h5>

        {infoShown.has("pa") && (
          <ShortInfo
            description={`<p>${texts.pa.info}</p>`}
            className="graphinfo3"
            collapseButton={false}
          />
        )}

        <div className="graficaeco">
          <h6>Distribución por áreas protegidas:</h6>
          <SmallStackedBar
            loadStatus={messages.pa}
            data={PAAreas}
            units="ha"
            colors={matchColor("pa", true)}
            scaleType={PADivergentData ? "symlog" : "linear"}
          />
        </div>

        <TextBoxes
          downloadData={PAAreas}
          downloadName={`eco_protected_areas_${areaIdStr}.csv`}
          quoteText={texts.pa.quote}
          metoText={texts.pa.meto}
          consText={texts.pa.cons}
          toggleInfo={() => toggleInfo("pa")}
          isInfoOpen={infoShown.has("pa")}
        />

        {/** STRATEGIC ECOSYSTEMS */}
        <div className="ecoest">
          <h4 className="minus20">
            Ecosistemas estratégicos
            <b>{`${formatNumber(SETotalArea, 0)} ha`}</b>
          </h4>

          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial2${infoShown.has("se") ? " activeBox" : ""}`}
              onClick={() => toggleInfo("se")}
            />
          </IconTooltip>

          <h5 className="minusperc">
            {`${getPercentage(SETotalArea, areaHa!)} %`}
          </h5>

          {getPercentage(SETotalArea, areaHa!) > 100 && (
            <h3 className="warningNote">
              La superposición de ecosistemas estratégicos puede resultar en un
              valor mayor al área total.
            </h3>
          )}

          {infoShown.has("se") && (
            <ShortInfo
              description={`<p>${texts.se.info}</p>`}
              className="graphinfo3"
              collapseButton={false}
            />
          )}

          {renderEcosystemsBox()}

          <TextBoxes
            downloadData={SEAreas}
            downloadName={`eco_strategic_ecosystems_${areaIdStr}.csv`}
            quoteText={texts.se.quote}
            metoText={texts.se.meto}
            consText={texts.se.cons}
            toggleInfo={() => toggleInfo("se")}
            isInfoOpen={infoShown.has("se")}
          />
        </div>
      </div>
    </div>
  );
}
