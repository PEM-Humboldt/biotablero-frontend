import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import { IconTooltip } from "pages/search/shared_components/Tooltips";
import {
  LineLegend,
  PointFilledLegend,
} from "pages/search/shared_components/CssLegends";
import matchColor from "utils/matchColor";
import ShortInfo from "components/ShortInfo";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";

import isFlagEnabled from "utils/isFlagEnabled";
import TextBoxes from "pages/search/shared_components/TextBoxes";
import Bullet from "pages/search/shared_components/charts/Bullet";
import { wrapperMessage } from "pages/search/types/charts";
import { textsObject } from "pages/search/types/texts";
import SearchAPI from "utils/searchAPI";
import {
  concentration,
  gapLimitKeys,
  gaps,
  gaps_limits,
  isGaps,
} from "pages/search/types/richness";

const areaTypeName = (areaType: string) => {
  switch (areaType) {
    case "states":
      return "departamentos";
    case "ea":
      return "jurisdicciones ambientales";
    case "basinSubzones":
      return "subzonas hidrográficas";
    default:
      return "cerca";
  }
};

const getLabelFunc = (section: string) => {
  if (section === "gaps") return getLabelGaps;
  else return getLabelConcentration;
};

const getLabelGaps = (
  key: string,
  areaType: string = "",
  region: string = ""
) => {
  switch (key) {
    case "value":
      return "Promedio de vacios en el área de consulta";
    case "min":
      return "Menos vacíos en el área de consulta";
    case "max":
      return "Más vacíos en el área de consulta";
    case "min_region":
      return `Menos vacíos en la región ${region}`;
    case "max_region":
      return `Más vacíos en la región ${region}`;
    case "min_threshold":
      return `Menos vacíos ${areaTypeName(areaType)} de la región ${region}`;
    case "max_threshold":
      return `Más vacíos ${areaTypeName(areaType)} de la región ${region}`;
    default:
      return "";
  }
};

const getLabelConcentration = (key: string) => {
  switch (key) {
    case "min":
      return "Mínimo del área de consulta";
    case "max":
      return "Máximo del área de consulta";
    case "min_region":
      return "Mínimo por región biótica";
    case "max_region":
      return "Máximo por región biótica";
    case "min_threshold":
      return "Mínimo nacional";
    case "max_threshold":
      return "Máximo nacional";
    case "value":
      return "Promedio de representación en el área de consulta";
    default:
      return "";
  }
};

interface Props {}

interface State {
  showInfoGraph: boolean;
  gaps: GapsAndConcentration | null;
  concentration: GapsAndConcentration | null;
  messageGaps: wrapperMessage;
  messageConc: wrapperMessage;
  selected: "gaps" | "concentration";
  bioticRegion: string;
  concentrationFlag: boolean;
  showErrorMessage: boolean;
  csvData: Array<GapsAndConcentration>;
  texts: {
    gaps: textsObject;
  };
}

interface GapsAndConcentration {
  id: string;
  ranges: {
    area: number;
  };
  markers: {
    value: number;
  };
  measures: gaps_limits;
  labels: {
    measures: {
      [key: string]: string;
    };
    markers: {
      [key: string]: string;
    };
  };
  title: string;
}

class SpeciesRecordsGaps extends React.Component<Props, State> {
  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      gaps: null,
      concentration: null,
      messageGaps: "loading",
      messageConc: "loading",
      selected: "gaps",
      bioticRegion: "Región Biótica",
      concentrationFlag: false,
      showErrorMessage: false,
      csvData: [],
      texts: {
        gaps: { info: "", cons: "", meto: "", quote: "" },
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    switchLayer("speciesRecordsGaps");

    SearchAPI.requestGaps(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          const showErrorMessage =
            res[0].min < res[0].min_region || res[0].max > res[0].max_region;
          const { region, ...data } = this.transformData(res, "gaps");
          const dataArray = [];
          dataArray.push(data);
          this.setState({
            gaps: data,
            messageGaps: null,
            bioticRegion: region,
            showErrorMessage,
            csvData: dataArray,
          });
        }
      })
      .catch(() => {
        this.setState({ messageGaps: "no-data" });
      });

    SearchAPI.requestConcentration(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          const { region, ...data } = this.transformData(res, "concentration");
          const dataArray = [];
          dataArray.push(data);
          this.setState({
            concentration: data,
            messageConc: null,
          });
        }
      })
      .catch(() => {
        this.setState({ messageConc: "no-data" });
      });

    SearchAPI.requestSectionTexts("gaps")
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { gaps: res } });
        }
      })
      .catch(() => {});

    isFlagEnabled("speciesRecordsConcentrarion").then((value) =>
      this.setState({ concentrationFlag: value })
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Transform data structure to be passed to graph component as a prop
   *
   * @param {Object} rawData raw data from RestAPI
   */
  transformData = (
    rawData: Array<gaps> | Array<concentration>,
    section: string
  ) => {
    const { areaId } = this.context as SearchContextValues;
    let region_name = "";
    let limits: gaps_limits;
    let id = "";
    let avg = 0;
    if (isGaps(rawData[0])) {
      ({ id, avg, region_name, ...limits } = rawData[0]);
    } else {
      ({ id, avg, ...limits } = rawData[0]);
    }
    gapLimitKeys.forEach((key) => {
      Object.defineProperty(limits, key, {
        value: Math.round(limits[key] * 100),
      });
    });
    return {
      region: region_name,
      id,
      ranges: {
        area: Math.max(limits.max, limits.max_threshold, limits.max_region),
      },
      markers: {
        value: avg * 100,
      },
      measures: limits,
      labels: {
        measures: {
          ...[...Object.keys(limits)].reduce(
            (result, key) => ({
              ...result,
              [key]: getLabelFunc(section)(key, areaId, region_name),
            }),
            {}
          ),
        },
        markers: {
          value: getLabelFunc(section)("value"),
        },
      },
      title: "",
    };
  };

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  /**
   * Process data to be downloaded as a csv file
   *
   * @param {Object} data data transformed passed to graph
   */
  processDownload = (data: Array<GapsAndConcentration>) => {
    const result: Array<any> = [];
    data.forEach((item) => {
      const obj: any = {
        value: item.markers.value,
      };
      gapLimitKeys.forEach((element) => {
        obj[element] = item.measures[element];
      });
      result.push({
        type: item.id,
        value: obj.value,
        lower_value: obj.min,
        higher_value: obj.max,
        lower_area_type: obj.min_threshold,
        higher_area_type: obj.max_threshold,
        lower_region: obj.min_region,
        higher_region: obj.max_region,
      });
    });
    return result;
  };

  render() {
    const { areaId, geofenceId } = this.context as SearchContextValues;
    const {
      showInfoGraph,
      messageGaps,
      messageConc,
      gaps,
      concentration,
      selected,
      bioticRegion,
      concentrationFlag,
      showErrorMessage,
      csvData,
      texts,
    } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`graphinfo${showInfoGraph ? " activeBox" : ""}`}
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={texts.gaps.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        {showErrorMessage && (
          <div className="disclaimer">
            Los vacíos en el área de consulta son mayores o menores que los de
            la región biótica ya que sus límites intersectan dos o más regiones
            bióticas.
          </div>
        )}
        <div className={`nos-title${selected === "gaps" ? " selected" : ""}`}>
          Vacios de datos
        </div>
        <div className="svgPointer">
          <Bullet
            message={messageGaps}
            data={gaps}
            colors={matchColor("richnessGaps")}
            onClickHandler={() => {
              this.setState({ selected: "gaps" });
            }}
            labelXLeft="Muchos datos"
            labelXRight="Pocos datos"
          />
        </div>
        <br />
        <div className="richnessLegend">
          {messageGaps === null && (
            <PointFilledLegend
              orientation="column"
              color={matchColor("richnessGaps")("value")}
              key="value"
              marginLeft="2px"
              marginRight="6px"
            >
              {getLabelGaps("value", areaId)}
            </PointFilledLegend>
          )}
          {messageGaps === null &&
            gaps !== null &&
            gaps.measures &&
            Object.keys(gaps.measures).map((key) => (
              <LineLegend
                orientation="column"
                color={matchColor("richnessGaps")(key)}
                key={key}
              >
                {getLabelGaps(key, areaId, bioticRegion)}
              </LineLegend>
            ))}
        </div>
        <TextBoxes
          consText={texts.gaps.cons}
          metoText={texts.gaps.meto}
          quoteText={texts.gaps.quote}
          downloadData={this.processDownload(csvData)}
          downloadName={`rich_gaps_${areaId}_${geofenceId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
        {concentrationFlag && (
          <>
            <br />
            <div
              className={`nos-title${
                selected === "concentration" ? " selected" : ""
              }`}
            >
              Concentración de registros
              <br />
              <b>5 km x 5 km</b>
            </div>
            <div className="svgPointer">
              <Bullet
                message={messageConc}
                data={concentration}
                colors={matchColor("richnessGaps")}
                onClickHandler={() => {
                  this.setState({ selected: "concentration" });
                }}
                labelXLeft="Poco representado"
                labelXRight="Bien representado"
              />
            </div>
            <br />
            <div className="richnessLegend">
              <PointFilledLegend
                orientation="column"
                color={matchColor("richnessGaps")("value")}
                key="value"
                marginLeft="2px"
                marginRight="6px"
              >
                {getLabelConcentration("value")}
              </PointFilledLegend>
              {concentration !== null &&
                concentration.measures &&
                Object.keys(concentration.measures).map((key) => (
                  <LineLegend
                    orientation="column"
                    color={matchColor("richnessGaps")(key)}
                    key={key}
                  >
                    {getLabelConcentration(key)}
                  </LineLegend>
                ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default SpeciesRecordsGaps;

SpeciesRecordsGaps.contextType = SearchContext;
