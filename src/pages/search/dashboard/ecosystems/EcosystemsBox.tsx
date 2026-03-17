import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { formatNumber } from "@utils/format";
import { matchColor } from "pages/search/utils/matchColor";

import { transformSEValues } from "pages/search/dashboard/ecosystems/transformData";
import { SEDataExtended, SE_LABELS } from "pages/search/types/ecosystems";
import SmallStackedBar from "@composites/charts/SmallStackedBar";
import colorPalettes from "pages/search/utils/colorPalettes";

interface Props {
  SETotalArea: number;
  SEAreas: Array<SEDataExtended>;
  setActiveSE: (type: string) => void;
  activeSE: string;
}

export default function EcosystemsBox({
  SETotalArea,
  SEAreas,
  setActiveSE,
  activeSE,
}: Props) {
  if (!SETotalArea) return null;

  return (
    <div className="ecosystems" role="presentation">
      {SEAreas.map((SEValues) => {
        const hasArea = SEValues.area > 0;
        const SEData = transformSEValues(SEValues, SETotalArea);

        return (
          <div className="mb10" key={SEValues.type}>
            <div className="singleeco">{SE_LABELS[SEValues.type]}</div>

            <div className="singleeco2">
              {`${formatNumber(SEValues.area, 0)} ha`}
            </div>

            {hasArea && (
              <button
                className={`icongraph2 ${
                  activeSE === SEValues.type ? "rotate-false" : "rotate-true"
                }`}
                type="button"
                onClick={() => setActiveSE(SEValues.type)}
                title="Ampliar información"
              >
                <ExpandMoreIcon />
              </button>
            )}

            {hasArea && (
              <SmallStackedBar
                loadStatus={null}
                data={SEData}
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
  );
}
