import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import { IconTooltip } from "pages/search/shared_components/Tooltips";
import {
  LegendColor,
  LineLegend,
  TextLegend,
  ThickLineLegend,
} from "pages/search/shared_components/CssLegends";
import Icon from "pages/search/shared_components/CssIcons";
import matchColor from "utils/matchColor";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import ShortInfo from "components/ShortInfo";

import biomodelos from "images/biomodelos.png";
import mappoint from "images/mappoint.png";
import biomodelos2 from "images/biomodelos2.png";
import mappoint2 from "images/mappoint2.png";
import biomodeloslink from "images/biomodeloslink.png";
import biomodeloslink2 from "images/biomodeloslink2.png";
import fullview from "images/fullview.png";
import TextBoxes from "pages/search/shared_components/TextBoxes";
import SingleBulletGraph from "pages/search/shared_components/charts/SingleBulletGraph";
import { wrapperMessage } from "pages/search/types/charts";
import {
  helperText,
  textResponse,
  textsObject,
} from "pages/search/types/texts";
import { NOSGroups, NOSNational } from "pages/search/types/richness";
import SearchAPI from "utils/searchAPI";

const NOSTexts = {
  inferred: { info: "", cons: "", meto: "", quote: "" },
  observed: { info: "", cons: "", meto: "", quote: "" },
};

const getLabel = (key: string, area: string = "", region: string = "") => {
  let areaLbl = "cerca";
  switch (area) {
    case "states":
      areaLbl = "departamentos";
      break;
    case "ea":
      areaLbl = "jurisdicciones ambientales";
      break;
    case "basinSubzones":
      areaLbl = "subzonas hidrográficas";
      break;
    default:
      break;
  }

  return {
    total: "TOTAL",
    endemic: "ENDÉMICAS",
    invasive: "INVASORAS",
    threatened: "AMENAZADAS",
    inferred: "Inferido (BioModelos)",
    observed: "Observado (visor I2D)",
    min_inferred: `Min. inferido ${areaLbl} de la región ${region}`,
    min_observed: `Min. observado ${areaLbl} de la región ${region}`,
    max_inferred: `Max. inferido ${areaLbl} de la región ${region}`,
    max_observed: `Max. observado ${areaLbl} de la región ${region}`,
    region_observed: `Observado región ${region}`,
    region_inferred: `Inferido región ${region}`,
    area: `${areaLbl.replace(/^\w/, (l) =>
      l.toUpperCase()
    )} de la región ${region}`,
    region: `Región ${region}`,
    inferred2: "Inferido en el área de consulta",
    observed2: "Observado en el área de consulta",
    national_inferred: `Max. inferido en ${areaLbl} a nivel nacional: `,
    national_observed: `Max. observado en ${areaLbl} a nivel nacional: `,
  }[key];
};

interface Props {}

interface State {
  showInfoGraph: boolean;
  data: Array<selectedData>;
  allData: Array<completeData>;
  filter: string;
  message: wrapperMessage;
  selected: string;
  bioticRegion: string;
  texts: textsObject;
  helperText: helperText;
  maximumValues: Array<NOSNational>;
  showErrorMessage: boolean;
}

const allDataAreas = ["max", "max_inferred", "max_observed"] as const;
const allDataRegions = ["max", "region_inferred", "region_observed"] as const;
interface completeData {
  id: NOSGroups;
  ranges: {
    area: {
      [Property in typeof allDataAreas[number]]: number;
    };
    region: {
      [Property in typeof allDataRegions[number]]: number;
    };
  };
  markers: {
    inferred: number;
    observed: number;
  };
  measures: {
    [key: string]: number;
    region_inferred: number;
    region_observed: number;
  };
  title: string;
}

interface selectedData extends Pick<completeData, "id" | "title"> {
  ranges: {
    area: number;
    region: number;
  };
  markers: {
    [key: string]: number;
  };
  measures: {
    [key: string]: number;
  };
}
class NumberOfSpecies extends React.Component<Props, State> {
  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      data: [],
      allData: [],
      filter: "all",
      message: "loading",
      selected: "total",
      bioticRegion: "Región Biótica",
      texts: { info: "", cons: "", meto: "", quote: "" },
      helperText: { helper: "" },
      maximumValues: [],
      showErrorMessage: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    switchLayer("numberOfSpecies-total");

    Promise.all([
      SearchAPI.requestNumberOfSpecies(areaId, geofenceId, "all"),
      SearchAPI.requestNSThresholds(areaId, geofenceId, "all"),
      SearchAPI.requestNSNationalMax(areaId, "all"),
    ])
      .then(([values, thresholds, nationalMax]) => {
        const data: Array<completeData> = [];
        let region: string = "Región Biótica";
        let showErrorMessage = false;
        values.forEach((groupVal) => {
          if (region === "Región Biótica") {
            region = groupVal.region_name || "Región Biótica";
          }
          const {
            id = "",
            max_inferred = 0,
            max_observed = 0,
            ...mins
          } = thresholds.find((e) => e.id === groupVal.id) || {};
          showErrorMessage = groupVal.inferred > groupVal.region_inferred;
          data.push({
            id: groupVal.id,
            ranges: {
              area: {
                max: Math.max(max_inferred, max_observed),
                max_inferred: max_inferred,
                max_observed: max_observed,
              },
              region: {
                max: Math.max(
                  groupVal.region_observed,
                  groupVal.region_inferred
                ),
                region_observed: groupVal.region_observed,
                region_inferred: groupVal.region_inferred,
              },
            },
            markers: {
              inferred: groupVal.inferred,
              observed: groupVal.observed,
            },
            measures: {
              ...mins,
              max_inferred,
              max_observed,
              region_inferred: groupVal.region_inferred,
              region_observed: groupVal.region_observed,
            },
            title: "",
          });
        });
        this.setState(
          {
            allData: data,
            maximumValues: nationalMax,
            message: null,
            bioticRegion: region,
            showErrorMessage,
          },
          () => {
            this.filter("inferred")();
          }
        );
      })
      .catch(() => {
        this.setState({ message: "no-data" });
      });

    SearchAPI.requestSectionTexts("nosInferred")
      .then((res) => {
        if (this.mounted) {
          NOSTexts.inferred = res as textsObject;
          this.setState({
            texts: NOSTexts.inferred,
          });
        }
      })
      .catch(() => {});

    SearchAPI.requestSectionTexts("nosObserved")
      .then((res) => {
        if (this.mounted) {
          NOSTexts.observed = res;
        }
      })
      .catch(() => {});

    SearchAPI.requestHelperTexts("nos")
      .then((res) => {
        if (this.mounted) {
          this.setState({
            helperText: res,
          });
        }
      })
      .catch(() => {});
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  /**
   * Filter data by the given category
   *
   * @param {String} category category to filter by
   * @returns void
   */
  filter = (category: "inferred" | "observed" | "all") => () => {
    const { allData, selected } = this.state;
    const { handlerClickOnGraph } = this.context as SearchContextValues;
    if (category === "all") {
      this.setState({
        data: allData.map((group) => ({
          ...group,
          ranges: {
            area: group.ranges.area.max,
            region: group.ranges.region.max,
          },
        })),
        filter: "all",
        texts: { info: "", cons: "", meto: "", quote: "" },
        showInfoGraph: false,
      });
      handlerClickOnGraph({
        chartType: "numberOfSpecies",
        chartSection: "all",
        selectedKey: selected,
      });
    } else {
      const newData = allData.map((group) => {
        const regex = new RegExp(`${category}$`);
        const measureKeys = Object.keys(group.measures).filter((key) =>
          regex.test(key)
        );
        const areaKey = allDataAreas.filter((key) => regex.test(key))[0];
        const regionKey = allDataRegions.filter((key) => regex.test(key))[0];
        return {
          id: group.id,
          markers: {
            [category]: group.markers[category],
          },
          measures: measureKeys.reduce(
            (result, key) => ({ ...result, [key]: group.measures[key] }),
            {}
          ),
          ranges: {
            area: group.ranges.area[areaKey],
            region: group.ranges.region[regionKey],
          },
          title: group.title,
        };
      });
      this.setState({
        data: newData,
        filter: category,
        texts: NOSTexts[category],
        showInfoGraph: true,
      });
      handlerClickOnGraph({
        chartType: "numberOfSpecies",
        chartSection: category,
        selectedKey: selected,
      });
    }
  };

  /**
   * Process data to be downloaded as a csv file
   *
   * @param {Object} data data transformed passed to graph
   */
  processDownload = (data: Array<selectedData>): Array<any> => {
    const result: Array<any> = [];
    data.forEach((item) => {
      let obj = {
        type: item.id,
      };
      Object.keys(item.markers).forEach((element) => {
        obj = {
          ...obj,
          [element]: item.markers[element],
        };
      });
      Object.keys(item.measures).forEach((element) => {
        obj = {
          ...obj,
          [element]: item.measures[element],
        };
      });
      result.push(obj);
    });
    return result;
  };

  render() {
    const { areaId, geofenceId, handlerClickOnGraph } = this
      .context as SearchContextValues;
    const {
      showInfoGraph,
      message,
      data,
      selected,
      maximumValues,
      filter,
      bioticRegion,
      showErrorMessage,
      texts,
      helperText,
    } = this.state;

    let legends = [
      "inferred",
      "min_inferred",
      "max_inferred",
      "region_inferred",
      "observed",
      "min_observed",
      "max_observed",
      "region_observed",
    ];

    if (filter !== "all") {
      legends = legends.filter((leg) => {
        const regex = new RegExp(`${filter}$`);
        return regex.test(leg);
      });
    }

    return (
      <div className="graphcontainer pt6">
        <h2>
          {Object.keys(texts).length > 0 && (
            <IconTooltip title="Interpretación">
              <InfoIcon
                className={`graphinfo${showInfoGraph ? " activeBox" : ""}`}
                onClick={() => this.toggleInfoGraph()}
              />
            </IconTooltip>
          )}
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={texts.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        {showErrorMessage && (
          <div className="disclaimer">
            La riqueza inferida del área de consulta supera la de la región
            biótica en algunos casos pues sus límites intersectan dos o más
            regiones bióticas.
          </div>
        )}
        <h3>{helperText.helper}</h3>
        <div className="nos-title legend">
          <TextLegend
            className={`${filter === "inferred" ? "filtered" : ""}`}
            orientation="row"
            color={matchColor("richnessNos")("inferred")}
            image={biomodelos}
            hoverImage={biomodelos2}
            onClick={this.filter("inferred")}
          >
            {getLabel("inferred", areaId)}
          </TextLegend>
          <TextLegend
            className={`${filter === "observed" ? "filtered" : ""}`}
            orientation="row"
            color={matchColor("richnessNos")("observed")}
            image={mappoint}
            hoverImage={mappoint2}
            onClick={this.filter("observed")}
          >
            {getLabel("observed", areaId)}
          </TextLegend>
          <div
            className={`fullview-container${
              filter === "all" ? " filtered" : ""
            }`}
            onClick={this.filter("all")}
            onKeyPress={this.filter("all")}
            role="button"
            tabIndex={0}
          >
            <img className="fullview" src={fullview} alt="Ver ambos" />
          </div>
        </div>
        <div>
          {data.map((bar) => (
            <div key={bar.id}>
              <div
                className={`nos-title${bar.id === selected ? " selected" : ""}`}
              >
                <div>{getLabel(bar.id)}</div>
                <div className="numberSP">
                  <div>
                    {(filter === "all" || filter === "inferred") && (
                      <>
                        {getLabel("national_inferred", areaId)}
                        <b>
                          {
                            maximumValues.find((e) => e.id === bar.id)
                              ?.max_inferred
                          }
                        </b>
                      </>
                    )}
                    {filter === "all" && <br />}
                    {(filter === "all" || filter === "observed") && (
                      <>
                        {getLabel("national_observed", areaId)}
                        <b>
                          {
                            maximumValues.find((e) => e.id === bar.id)
                              ?.max_observed
                          }
                        </b>
                      </>
                    )}
                  </div>
                  {filter === "inferred" && (
                    <div>
                      <a
                        href="http://biomodelos.humboldt.org.co"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon
                          image={biomodeloslink}
                          hoverImage={biomodeloslink2}
                        />
                      </a>
                      {/* TODO:
                      Add I2D link when it's ready (import mappointlink and mappointlink2 images)
                      */}
                    </div>
                  )}
                </div>
              </div>
              <div className="svgPointer">
                <SingleBulletGraph
                  message={message}
                  data={bar}
                  colors={matchColor("richnessNos")}
                  onClickHandler={() => {
                    this.setState({ selected: bar.id });
                    handlerClickOnGraph({
                      chartType: "numberOfSpecies",
                      chartSection: filter,
                      selectedKey: bar.id,
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="richnessLegend">
          {data[0] &&
            Object.keys(data[0].ranges).map((key) => (
              <ThickLineLegend
                orientation="column"
                color={matchColor("richnessNos")(key)}
                key={key}
              >
                {getLabel(key, areaId, bioticRegion)}
              </ThickLineLegend>
            ))}
          {data[0] &&
            legends.map((key) => {
              if (key === "inferred" || key === "observed") {
                return (
                  <LegendColor
                    orientation="column"
                    color={matchColor("richnessNos")(key)}
                    key={key}
                    marginLeft="2px"
                    marginRight="6px"
                  >
                    {getLabel(`${key}2`, areaId, bioticRegion)}
                  </LegendColor>
                );
              }
              return (
                <LineLegend
                  orientation="column"
                  color={matchColor("richnessNos")(key)}
                  key={key}
                >
                  {getLabel(key, areaId, bioticRegion)}
                </LineLegend>
              );
            })}
        </div>
        <TextBoxes
          downloadData={this.processDownload(data)}
          downloadName={`rich_number_of_species_${areaId}_${geofenceId}.csv`}
          consText={texts.cons}
          quoteText={texts.quote}
          metoText={texts.meto}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
      </div>
    );
  }
}

export default NumberOfSpecies;

NumberOfSpecies.contextType = SearchContext;
