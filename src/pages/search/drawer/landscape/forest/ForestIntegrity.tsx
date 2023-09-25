import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import {
  PointFilledLegend,
  SquareBorderLegend,
} from "pages/search/shared_components/CssLegends";
import DownloadCSV from "pages/search/shared_components/DownloadCSV";
import ShortInfo from "components/ShortInfo";
import TextBoxes from "pages/search/shared_components/TextBoxes";
import { IconTooltip } from "pages/search/shared_components/Tooltips";

import matchColor from "utils/matchColor";
import SearchAPI from "utils/searchAPI";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import { SCICats, HFCats, SCIHF } from "pages/search/types/forest";
import { textsObject } from "pages/search/types/texts";
import Pie from "pages/search/shared_components/charts/Pie";
import SmallStackedBar from "pages/search/shared_components/charts/SmallStackedBar";
import { wrapperMessage } from "pages/search/types/charts";

type SCIHFCats = `${typeof SCICats[number]}-${typeof HFCats[number]}`;
/**
 * Get all combinations of SCI and HF categories to be used instead of Obejct.keys
 * @returns Array with all combinations of SCI and HF categories
 */
const getSCIHFVals = (): SCIHFCats[] => {
  const data: SCIHFCats[] = [];
  SCICats.forEach((sci) => {
    HFCats.forEach((hf) => {
      data.push(`${sci}-${hf}`);
    });
  });
  return data;
};

interface PA {
  key: string;
  label: string;
  area: number;
  percentage: number;
}

interface Props {}

interface FIState {
  showInfoGraph: boolean;
  SciHfCats: {
    [Property in SCIHFCats]: {
      id: SCIHFCats;
      label: string;
      value: number;
      per: number;
    };
  };
  texts: {
    forestSCIHF: textsObject;
  };
  ProtectedAreas: {
    [Property in SCIHFCats]: Array<PA>;
  };
  selectedCategory: SCIHFCats | null;
  loading: wrapperMessage;
}

class ForestIntegrity extends React.Component<Props, FIState> {
  static contextType = SearchContext;

  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      SciHfCats: {
        "alta-estable_natural": {
          id: "alta-estable_natural",
          label: "ICE Alto - IHEH Natural",
          value: 0,
          per: 0,
        },
        "alta-dinamica": {
          id: "alta-dinamica",
          label: "ICE Alto - IHEH Dinámica",
          value: 0,
          per: 0,
        },
        "alta-estable_alta": {
          id: "alta-estable_alta",
          label: "ICE Alto - IHEH Alta",
          value: 0,
          per: 0,
        },
        "baja_moderada-estable_natural": {
          id: "baja_moderada-estable_natural",
          label: "ICE Bajo Moderado - IHEH Natural",
          value: 0,
          per: 0,
        },
        "baja_moderada-dinamica": {
          id: "baja_moderada-dinamica",
          label: "ICE Bajo Moderado - IHEH Dinámica",
          value: 0,
          per: 0,
        },
        "baja_moderada-estable_alta": {
          id: "baja_moderada-estable_alta",
          label: "ICE Bajo Moderado - IHEH Alta",
          value: 0,
          per: 0,
        },
      },
      texts: {
        forestSCIHF: { info: "", cons: "", meto: "", quote: "" },
      },
      ProtectedAreas: {
        "alta-estable_alta": [],
        "alta-dinamica": [],
        "alta-estable_natural": [],
        "baja_moderada-estable_alta": [],
        "baja_moderada-dinamica": [],
        "baja_moderada-estable_natural": [],
      },
      selectedCategory: null,
      loading: "loading",
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    switchLayer("forestIntegrity");

    SearchAPI.requestSCIHF(areaId, geofenceId)
      .then((res: Array<SCIHF>) => {
        if (this.mounted) {
          if (res.length <= 0) {
            this.setState({
              loading: "no-data",
            });
          } else {
            this.setState((prevState) => {
              const { SciHfCats: cats, ProtectedAreas: PAs } = prevState;
              res.forEach((elem) => {
                const idx: SCIHFCats = `${elem.sci_cat}-${elem.hf_pers}`;
                cats[idx].value += elem.area;
                if (elem.pa === "No Protegida") {
                  PAs[idx].push({
                    key: elem.pa,
                    label: elem.pa,
                    area: elem.area,
                    percentage: 0,
                  });
                } else {
                  PAs[idx].unshift({
                    key: elem.pa,
                    label: elem.pa,
                    area: elem.area,
                    percentage: 0,
                  });
                }
              });
              const addTotalArea =
                cats["alta-dinamica"].value +
                cats["alta-estable_alta"].value +
                cats["alta-estable_natural"].value +
                cats["baja_moderada-dinamica"].value +
                cats["baja_moderada-estable_alta"].value +
                cats["baja_moderada-estable_natural"].value;

              getSCIHFVals().forEach((sciHfCat) => {
                cats[sciHfCat].per =
                  (cats[sciHfCat].value * 100) / addTotalArea;
                PAs[sciHfCat] = PAs[sciHfCat].map((areas) => ({
                  ...areas,
                  percentage: areas.area / cats[sciHfCat].value,
                }));
              });
              return { SciHfCats: cats, ProtectedAreas: PAs, loading: null };
            });
          }
        }
      })
      .catch(() => {
        this.setState({ loading: "no-data" });
      });

    SearchAPI.requestSectionTexts("forestSCIHF")
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { forestSCIHF: res } });
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

  render() {
    const {
      showInfoGraph,
      SciHfCats,
      ProtectedAreas,
      selectedCategory,
      loading,
      texts,
    } = this.state;
    const { areaId, geofenceId, handlerClickOnGraph } = this
      .context as SearchContextValues;
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
            description={`<p>${texts.forestSCIHF.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <h3 className="inlineb">
          Haz clic en la gráfica para visualizar las áreas protegidas
        </h3>
        <SquareBorderLegend color={matchColor("border")()}>
          Límite de áreas protegidas
        </SquareBorderLegend>
        <div>
          <Pie
            message={loading}
            data={Object.values(SciHfCats)}
            units="ha"
            colors={matchColor("SciHf")}
            onClickHandler={(sectionId: string) => {
              this.setState({ selectedCategory: sectionId as SCIHFCats });
              handlerClickOnGraph({
                chartType: "SciHf",
                selectedKey: sectionId,
              });
            }}
          />
          <div className="fiLegend">
            {getSCIHFVals().map((cat) => (
              <PointFilledLegend
                color={matchColor("SciHf")(cat)}
                orientation="column"
                key={cat}
              >
                {SciHfCats[cat].label}
              </PointFilledLegend>
            ))}
          </div>
        </div>
        <TextBoxes
          consText={texts.forestSCIHF.cons}
          metoText={texts.forestSCIHF.meto}
          quoteText={texts.forestSCIHF.quote}
          downloadData={Object.values(SciHfCats)}
          downloadName={`forest_integrity_${areaId}_${geofenceId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
        {selectedCategory && (
          <>
            <h6>Distribución en áreas protegidas</h6>
            <DownloadCSV
              data={Object.values(ProtectedAreas[selectedCategory])}
              filename={`bt_fi_areas_${selectedCategory}_${areaId}_${geofenceId}.csv`}
            />
            <div style={{ padding: "0 12px" }}>
              <SmallStackedBar
                message={loading}
                data={ProtectedAreas[selectedCategory]}
                units="ha"
                colors={matchColor("pa", true)}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default ForestIntegrity;
