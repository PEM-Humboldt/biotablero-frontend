import { useEffect, useReducer } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";

import { IconTooltip } from "@ui/Tooltips";
import { ShortInfo } from "@composites/ShortInfo";
import TextBoxes from "@ui/TextBoxes";

import { StrategicEcosystemsController } from "pages/search/dashboard/ecosystems/StrategicEcosystemsController";
import SmallStackedBar from "@composites/charts/SmallStackedBar";

import { SEData, SELabels } from "pages/search/types/ecosystems";
import { formatNumber } from "@utils/format";

import {
  transformSEAreas,
  transformSEValues,
} from "pages/search/dashboard/ecosystems/transformData";

import { matchColor } from "pages/search/utils/matchColor";
import colorPalettes from "pages/search/utils/colorPalettes";

type State = {
  SEAreas: SEData[];
  SETotalArea: number;
  loading: boolean;
  noData: boolean;
  toggleInfo: () => void;
  showInfoGraph: boolean;
};

const initialState: State = {
  SEAreas: [],
  SETotalArea: 0,
  loading: true,
  noData: false,
  toggleInfo: () => {},
  showInfoGraph: false,
};

type Action =
  | { type: "LOAD_SUCCESS"; payload: SEData[] }
  | { type: "LOAD_FAIL" }
  | { type: "SET_ACTIVE"; payload: string }
  | { type: "TOGGLE_INFO_GRAPH" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_SUCCESS":
      return {
        ...state,
        SEAreas: action.payload,
        SETotalArea: action.payload.reduce((acc, i) => acc + i.area, 0),
        loading: false,
      };

    case "LOAD_FAIL":
      return { ...state, loading: false, noData: true };

    case "TOGGLE_INFO_GRAPH":
      return {
        ...state,
        showInfoGraph: !state.showInfoGraph,
      };

    default:
      return state;
  }
}

interface Props {
  areaTypeId: string;
  areaIdId: number;
  areaHa: number;
  texts: { info: string; cons: string; meto: string; quote: string };
}

export function StrategicEcosystems({
  areaTypeId,
  areaIdId,
  areaHa,
  texts,
}: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { SEAreas, SETotalArea, loading, noData, showInfoGraph } = state;

  const controller = new StrategicEcosystemsController();

  useEffect(() => {
    controller.setArea(areaTypeId, areaIdId);

    controller
      .getStrategicEcosystemsValues(areaHa)
      .then((res) => {
        dispatch({ type: "LOAD_SUCCESS", payload: res });
      })
      .catch(() => {
        dispatch({ type: "LOAD_FAIL" });
      });
  }, [areaTypeId, areaIdId]);

  const percentage = Number(((SETotalArea * 100) / areaHa).toFixed(2));

  const areas = transformSEAreas(SEAreas, areaHa);

  /**
   * Toggles the display of a specific help section.
   *
   * @param {TextSection} value - Section id
   */
  const toggleInfo = () => {
    dispatch({ type: "TOGGLE_INFO_GRAPH" });
  };
  return (
    <div className="ecoest">
      <div className="ecoest-header">
        <h4>
          Ecosistemas estratégicos <b>{formatNumber(SETotalArea, 0)} ha</b>
        </h4>

        <IconTooltip title="Interpretación">
          <span className="iconWrapper">
            <InfoIcon
              fontSize="medium"
              className={`ecoest-info-icon${showInfoGraph ? " activeBox" : ""}`}
              onClick={toggleInfo}
            />
          </span>
        </IconTooltip>
      </div>

      <h5 className="minusperc">{`${percentage} %`}</h5>

      {percentage > 100 && (
        <h3 className="warningNote">
          La superposición de ecosistemas estratégicos puede resultar en un
          valor mayor al área total.
        </h3>
      )}

      {showInfoGraph && (
        <ShortInfo
          description={`<p>${texts.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}

      {loading && "Cargando..."}

      {!loading && noData && "No hay información"}

      {!loading && !noData && (
        <div className="ecosystems">
          {areas.map((SEValues) => {
            const hasArea = SEValues.area > 0;
            const SEChartData = transformSEValues(SEValues, SETotalArea);

            return (
              <div className="mb10" key={SEValues.type}>
                <div className="singleeco">{SELabels[SEValues.type]}</div>

                <div className="singleeco2">
                  {formatNumber(SEValues.area, 0)} ha
                </div>

                {hasArea && (
                  <button className="rotate-false" type="button">
                    <ExpandMoreIcon />
                  </button>
                )}

                {hasArea && (
                  <SmallStackedBar
                    loadStatus={null}
                    data={SEChartData}
                    units="ha"
                    colors={(key) =>
                      matchColor("se")(key) || colorPalettes.default[0]
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <TextBoxes
        downloadData={SEAreas}
        downloadName={`eco_strategic_ecosystems_${areaIdId}.csv`}
        quoteText={texts.quote}
        metoText={texts.meto}
        consText={texts.cons}
        toggleInfo={toggleInfo}
        isInfoOpen={showInfoGraph}
      />
    </div>
  );
}
