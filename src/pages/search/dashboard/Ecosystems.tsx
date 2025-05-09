import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import TextBoxes from "pages/search/shared_components/TextBoxes";
import {
  transformPAValues,
  transformCoverageValues,
  transformSEAreas,
} from "pages/search/dashboard/ecosystems/transformData";
import EcosystemsBox from "pages/search/dashboard/ecosystems/EcosystemsBox";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import formatNumber from "utils/format";
import matchColor from "utils/matchColor";
import RestAPI from "utils/restAPI";
import BackendAPI from "utils/backendAPI";
import SmallStackedBar from "pages/search/shared_components/charts/SmallStackedBar";
import { textsObject } from "pages/search/types/texts";
import { wrapperMessage } from "pages/search/types/charts";
import {
  Coverage,
  coverageType,
  SEPAData,
} from "pages/search/types/ecosystems";
import { EcosystemsController } from "pages/search/dashboard/EcosystemsController";
import { rasterLayer } from "pages/search/types/layers";

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

interface State {
  showInfoMain: boolean;
  infoShown: {
    has: (arg0: string) => any;
    delete: (arg0: string) => void;
    add: (arg0: string) => void;
  };
  coverage: Array<
    Omit<Coverage, "type"> & {
      key: coverageType;
    }
  >;
  PAAreas: Array<{
    area: number;
    label: string;
    key: string;
    percentage: number;
  }>;
  PATotalArea: number;
  PADivergentData: boolean;
  SEAreas: Array<SEPAData>;
  SETotalArea: number;
  activeSE: string;
  messages: {
    cov: wrapperMessage;
    pa: wrapperMessage;
    se: wrapperMessage;
  };
  texts: {
    ecosystems: textsObject;
    coverage: textsObject;
    pa: textsObject;
    se: textsObject;
  };
  layers: Array<rasterLayer>;
}

class Ecosystems extends React.Component<Props, State> {
  mounted = false;
  EcosystemsController;
  constructor(props: Props) {
    super(props);
    this.EcosystemsController = new EcosystemsController();
    this.state = {
      showInfoMain: false,
      infoShown: new Set(),
      coverage: [],
      PAAreas: [],
      PATotalArea: 0,
      PADivergentData: false,
      SEAreas: [],
      SETotalArea: 0,
      activeSE: "",
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
      layers: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaType, areaId, areaHa } = this.context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.EcosystemsController.setArea(areaTypeId, areaIdId);

    this.switchLayer();

    BackendAPI.requestCoverage(areaTypeId, areaIdId)
      .then((res) => {
        /*res.map(({ type, ...rest }) => ({
          ...rest,
          key: type,
        }));*/
        if (this.mounted) {
          this.setState((prev) => ({
            coverage: transformCoverageValues(res),
            messages: {
              ...prev.messages,
              cov: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            cov: "no-data",
          },
        }));
      });

    BackendAPI.requestProtectedAreas(areaTypeId, areaIdId)
      .then((res) => {
        if (this.mounted) {
          if (Array.isArray(res) && res[0]) {
            const PATotalArea = res
              .map((i) => i.area)
              .reduce((prev, next) => prev + next);
            const PAAreas = transformPAValues(res, areaHa!);
            const noProtectedArea = PAAreas.find(
              (item) => item.key === "No Protegida"
            );

            let PADivergentData = false;
            if (
              noProtectedArea &&
              noProtectedArea.percentage &&
              noProtectedArea.percentage >= 0.97
            ) {
              PADivergentData = true;
            }

            this.setState((prev) => ({
              PAAreas,
              PATotalArea,
              PADivergentData,
              messages: {
                ...prev.messages,
                pa: null,
              },
            }));
          }
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            pa: "no-data",
          },
        }));
      });

    BackendAPI.requestStrategicEcosystems(areaTypeId, areaIdId)
      .then((res) => {
        if (this.mounted) {
          if (Array.isArray(res)) {
            const SETotal = res.find((obj) => obj.type === "Total");
            const SETotalArea = SETotal ? SETotal.area : 0;
            const SEAreas = res.slice(1);
            this.setState((prev) => ({
              SEAreas,
              SETotalArea,
              messages: {
                ...prev.messages,
                se: null,
              },
            }));
          }
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            se: "no-data",
          },
        }));
      });

    ["ecosystems", "coverage", "pa", "se"].forEach((item) => {
      RestAPI.requestSectionTexts(item)
        .then((res) => {
          if (this.mounted) {
            this.setState((prevState) => ({
              texts: { ...prevState.texts, [item]: res },
            }));
          }
        })
        .catch(() => {
          this.setState((prevState) => ({
            texts: { ...prevState.texts, [item]: {} },
          }));
        });
    });
  }

  componentWillUnmount() {
    const { clearLayers } = this.context as SearchContextValues;

    this.mounted = false;
    clearLayers();
    this.EcosystemsController.cancelActiveRequests();
  }

  toggleInfoGeneral = () => {
    this.setState((prevState) => ({
      showInfoMain: !prevState.showInfoMain,
    }));
  };

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

  /**
   * Returns the component EcosystemsBox that contains the list of strategic ecosystems
   * @param {Array<SEPADataExt>} SEAreas area of each strategic ecosystem
   * @param {Number} SETotalArea total area of all strategic ecosystems
   *
   * @returns {node} Component to be rendered
   */
  renderEcosystemsBox = (SEAreas: Array<SEPAData>, SETotalArea: number) => {
    const {
      activeSE,
      messages: { se },
    } = this.state;
    const { areaHa } = this.context as SearchContextValues;

    if (se === "loading") return "Cargando...";
    if (se === "no-data")
      return "No hay información de áreas protegidas en el área de consulta";
    if (areaHa !== 0) {
      return (
        <EcosystemsBox
          SETotalArea={Number(SETotalArea)}
          SEAreas={transformSEAreas(SEAreas, areaHa!)}
          activeSE={activeSE}
          setActiveSE={this.switchActiveSE}
        />
      );
    }
    return null;
  };

  /**
   * Set active strategic ecosystem graph
   *
   * @param {String} se selected strategic ecosystem
   */
  switchActiveSE = (se: string) => {
    this.setState((prevState) => {
      const isNewActiveSE = prevState.activeSE !== se && se !== "";
      const newActiveSE = isNewActiveSE ? se : "";

      if (!isNewActiveSE) {
        this.switchLayer();
      }

      return { activeSE: newActiveSE };
    });
  };

  render() {
    const {
      showInfoMain,
      infoShown,
      coverage,
      PAAreas,
      PATotalArea,
      PADivergentData,
      SEAreas,
      SETotalArea,
      activeSE,
      messages: { cov, pa },
      texts,
    } = this.state;

    const { areaId, areaHa } = this.context as SearchContextValues;

    const areaIdId = areaId!.id.toString();

    return (
      <div className="graphcard">
        <h2>
          <IconTooltip title="¿Cómo interpretar las gráficas?">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGeneral()}
            />
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
          <button
            onClick={() => {
              if (activeSE !== "") {
                this.switchActiveSE("");
              }
            }}
            type="button"
            className="tittlebtn"
          >
            <h4>Cobertura</h4>
          </button>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${
                infoShown.has("coverage") ? " activeBox" : ""
              }`}
              onClick={() => this.toggleInfo("coverage")}
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
                message={cov}
                data={coverage}
                units="ha"
                colors={matchColor("coverage")}
                onClickGraphHandler={(selected) => {
                  this.clickOnGraph(selected);
                }}
              />
            </div>
          </div>
          <TextBoxes
            downloadData={coverage}
            downloadName={`eco_coverages_${areaId}_${areaIdId}.csv`}
            quoteText={texts.coverage.quote}
            metoText={texts.coverage.meto}
            consText={texts.coverage.cons}
            toggleInfo={() => this.toggleInfo("coverage")}
            isInfoOpen={infoShown.has("coverage")}
          />
          <h4>
            Áreas protegidas
            <b>{`${formatNumber(PATotalArea, 0)} ha `}</b>
          </h4>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${
                infoShown.has("pa") ? " activeBox" : ""
              }`}
              onClick={() => this.toggleInfo("pa")}
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
              message={pa}
              data={PAAreas}
              units="ha"
              colors={matchColor("pa", true)}
              scaleType={PADivergentData ? "symlog" : "linear"}
            />
          </div>
          <TextBoxes
            downloadData={PAAreas}
            downloadName={`eco_protected_areas_${areaId}_${areaIdId}.csv`}
            quoteText={texts.pa.quote}
            metoText={texts.pa.meto}
            consText={texts.pa.cons}
            toggleInfo={() => this.toggleInfo("pa")}
            isInfoOpen={infoShown.has("pa")}
          />
          <div className="ecoest">
            <h4 className="minus20">
              Ecosistemas estratégicos
              <b>{`${formatNumber(SETotalArea, 0)} ha`}</b>
            </h4>
            <IconTooltip title="Interpretación">
              <InfoIcon
                className={`downSpecial2${
                  infoShown.has("se") ? " activeBox" : ""
                }`}
                onClick={() => this.toggleInfo("se")}
              />
            </IconTooltip>
            <h5 className="minusperc">
              {`${getPercentage(SETotalArea, areaHa!)} %`}
            </h5>
            <h3 className="warningNote">
              {getPercentage(SETotalArea, areaHa!) > 100
                ? "La superposición de ecosistemas estratégicos puede resultar en que su valor total exceda el área de consulta, al contar múltiples veces zonas donde coexisten."
                : ""}
            </h3>
            {infoShown.has("se") && (
              <ShortInfo
                description={`<p>${texts.se.info}</p>`}
                className="graphinfo3"
                collapseButton={false}
              />
            )}
            {this.renderEcosystemsBox(SEAreas, SETotalArea)}
            <TextBoxes
              downloadData={SEAreas}
              downloadName={`eco_strategic_ecosystems_${areaId}_${areaIdId}.csv`}
              quoteText={texts.se.quote}
              metoText={texts.se.meto}
              consText={texts.se.cons}
              toggleInfo={() => this.toggleInfo("se")}
              isInfoOpen={infoShown.has("se")}
            />
          </div>
        </div>
      </div>
    );
  }

  switchLayer = () => {
    const { setRasterLayers, setLoadingLayer, setLayerError, setMapTitle } =
      this.context as SearchContextValues;

    setLoadingLayer(true);
    this.EcosystemsController.getCoveragesLayers()
      .then((layers) => {
        this.setState({ layers: layers });

        if (this.mounted) {
          setRasterLayers(this.state.layers);
          setLoadingLayer(false);
          setMapTitle({
            name: `Coberturas`,
          });
        }
      })
      .catch((e) => {
        if (e.toString() != "Error: request canceled") {
          setLayerError(e.toString());
        }
      });
  };

  /**
   * Set the selected layer to highlight
   *  @param {string} selectedKey Special Ecosystem type
   */

  clickOnGraph = (selectedKey: string) => {
    const { layers } = this.state;
    const { setRasterLayers } = this.context as SearchContextValues;

    setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      }))
    );
  };
}

export default Ecosystems;

Ecosystems.contextType = SearchContext;
