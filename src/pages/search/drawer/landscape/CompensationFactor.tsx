import InfoIcon from "@mui/icons-material/Info";
import React from "react";

import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";

import matchColor from "utils/matchColor";
import SearchAPI from "utils/searchAPI";
import TextBoxes from "pages/search/shared_components/TextBoxes";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import { cfData } from "pages/search/types/compensationFactor";
import { textsObject } from "pages/search/types/texts";
import LargeBarStackGraph from "pages/search/shared_components/charts/LargeBarStackGraph";
import { wrapperMessage } from "pages/search/types/charts";

interface cfDataExt extends cfData {
  label: string;
}

interface Props {}

interface compensationFactorState {
  infoShown: Set<string>;
  biomes: Array<cfDataExt>;
  fc: Array<cfDataExt>;
  bioticUnits: Array<cfDataExt>;
  messages: {
    fc: wrapperMessage;
    biomes: wrapperMessage;
    bioticUnits: wrapperMessage;
  };
  texts: {
    cf: textsObject;
    biomes: textsObject;
    bioticRegions: textsObject;
  };
}

class CompensationFactor extends React.Component<
  Props,
  compensationFactorState
> {
  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      infoShown: new Set(["cf"]),
      biomes: [],
      fc: [],
      bioticUnits: [],
      messages: {
        fc: "loading",
        biomes: "loading",
        bioticUnits: "loading",
      },
      texts: {
        cf: { info: "", cons: "", meto: "", quote: "" },
        biomes: { info: "", cons: "", meto: "", quote: "" },
        bioticRegions: { info: "", cons: "", meto: "", quote: "" },
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    if (areaId !== "ea") return;

    switchLayer("fc");

    SearchAPI.requestBiomes(areaId, geofenceId)
      .then((res: Array<cfData>) => {
        if (this.mounted) {
          this.setState((prev) => ({
            biomes: res.map((item) => ({
              ...item,
              label: `${item.key}`,
            })),
            messages: {
              ...prev.messages,
              biomes: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            biomes: "no-data",
          },
        }));
      });

    SearchAPI.requestCompensationFactor(areaId, geofenceId)
      .then((res: Array<cfData>) => {
        if (this.mounted) {
          this.setState((prev) => ({
            fc: res.map((item) => ({
              ...item,
              label: `${item.key}`,
            })),
            messages: {
              ...prev.messages,
              fc: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            fc: "no-data",
          },
        }));
      });

    SearchAPI.requestBioticUnits(areaId, geofenceId)
      .then((res: Array<cfData>) => {
        if (this.mounted) {
          this.setState((prev) => ({
            bioticUnits: res.map((item) => ({
              ...item,
              area: Number(item.area),
              label: `${item.key}`,
            })),
            messages: {
              ...prev.messages,
              bioticUnits: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            bioticUnits: "no-data",
          },
        }));
      });

    ["cf", "biomes", "bioticRegions"].forEach((item) => {
      SearchAPI.requestSectionTexts(item)
        .then((res) => {
          if (this.mounted) {
            this.setState((prevState) => ({
              texts: { ...prevState.texts, [item]: res },
            }));
          }
        })
        .catch(() => {
          this.setState((prevState) => ({
            texts: {
              ...prevState.texts,
              [item]: { info: "", cons: "", meto: "", quote: "" },
            },
          }));
        });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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

  render() {
    const {
      infoShown,
      biomes,
      fc,
      bioticUnits,
      messages: {
        fc: fcMess,
        biomes: biomesMess,
        bioticUnits: bioticUnitsMess,
      },
      texts,
    } = this.state;
    const { areaId, geofenceId } = this.context as SearchContextValues;

    return (
      <div style={{ width: "100%" }}>
        <div className="graphcardAcc pt6 ml10">
          <h2>Factor de Compensación</h2>
          <div className="graphinfobox">
            <IconTooltip title="Interpretación">
              <InfoIcon
                className={`graphinfo${
                  infoShown.has("cf") ? " activeBox" : ""
                }`}
                onClick={() => this.toggleInfo("cf")}
              />
            </IconTooltip>
            {infoShown.has("cf") && (
              <ShortInfo
                description={texts.cf.info}
                className="graphinfo2"
                collapseButton={false}
              />
            )}
          </div>
          <LargeBarStackGraph
            data={fc}
            message={fcMess}
            labelX="Hectáreas"
            labelY="Factor de Compensación"
            units="ha"
            colors={matchColor("fc")}
            padding={0.25}
          />
          <TextBoxes
            consText={texts.cf.cons}
            metoText={texts.cf.meto}
            quoteText={texts.cf.quote}
            downloadData={fc}
            downloadName={`compensation_factor_${areaId}_${geofenceId}.csv`}
            isInfoOpen={infoShown.has("cf")}
            toggleInfo={() => this.toggleInfo("cf")}
          />
          <h3>Biomas</h3>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${
                infoShown.has("biomes") ? " activeBox" : ""
              }`}
              onClick={() => this.toggleInfo("biomes")}
            />
          </IconTooltip>
          {infoShown.has("biomes") && (
            <ShortInfo
              description={texts.biomes.info}
              className="graphinfo3"
              collapseButton={false}
            />
          )}
          <LargeBarStackGraph
            data={biomes}
            message={biomesMess}
            labelX="Hectáreas"
            labelY="Biomas"
            units="ha"
            colors={matchColor("biomas")}
            padding={0.3}
          />
          <TextBoxes
            consText={texts.biomes.cons}
            metoText={texts.biomes.meto}
            quoteText={texts.biomes.quote}
            downloadData={biomes}
            downloadName={`biomes_${areaId}_${geofenceId}.csv`}
            isInfoOpen={infoShown.has("biomes")}
            toggleInfo={() => this.toggleInfo("biomes")}
          />
          <h3>Regiones Bióticas</h3>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${
                infoShown.has("bioticReg") ? " activeBox" : ""
              }`}
              onClick={() => this.toggleInfo("bioticReg")}
            />
          </IconTooltip>
          {infoShown.has("bioticReg") && (
            <ShortInfo
              description={texts.bioticRegions.info}
              className="graphinfo3"
              collapseButton={false}
            />
          )}
          <LargeBarStackGraph
            data={bioticUnits}
            message={bioticUnitsMess}
            labelX="Hectáreas"
            labelY="Regiones Bióticas"
            units="ha"
            colors={matchColor("bioticReg")}
            padding={0.3}
          />
          <TextBoxes
            consText={texts.bioticRegions.cons}
            metoText={texts.bioticRegions.meto}
            quoteText={texts.bioticRegions.quote}
            downloadData={bioticUnits}
            downloadName={`biotic_units_${geofenceId}.csv`}
            isInfoOpen={infoShown.has("bioticReg")}
            toggleInfo={() => this.toggleInfo("bioticReg")}
          />
        </div>
      </div>
    );
  }
}

export default CompensationFactor;

CompensationFactor.contextType = SearchContext;
