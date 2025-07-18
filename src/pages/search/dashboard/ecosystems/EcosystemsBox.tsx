import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

import EcosystemDetails from "pages/search/dashboard/ecosystems/ecosystemsBox/EcosystemDetails";
import formatNumber from "utils/format";
import matchColor from "pages/search/utils/matchColor";

import { transformSEValues } from "pages/search/dashboard/ecosystems/transformData";
import { SEPADataExt } from "pages/search/types/ecosystems";
import SmallStackedBar from "pages/search/shared_components/charts/SmallStackedBar";

interface Props {
  SETotalArea: number;
  SEAreas: Array<SEPADataExt>;
  setActiveSE: (type: string) => void;
  activeSE: string;
}

interface State {
  stopLoad: boolean;
}

class EcosystemsBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stopLoad: false,
    };
  }

  componentWillUnmount() {
    this.setState({ stopLoad: true });
  }

  render() {
    const { SETotalArea, SEAreas, setActiveSE, activeSE } = this.props;
    const { stopLoad } = this.state;
    return (
      <div className="ecosystems" role="presentation">
        {!stopLoad &&
          SETotalArea !== 0 &&
          SEAreas.map((SEValues) => (
            <div className="mb10" key={SEValues.type}>
              <div className="singleeco">{SEValues.type}</div>
              <div className="singleeco2">
                {`${formatNumber(SEValues.area, 0)} ha`}
              </div>
              {Number(SEValues.area) !== 0 && (
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
              {!stopLoad && Number(SEValues.area) !== 0 && (
                <SmallStackedBar
                  message={null}
                  customMessage="Sin áreas protegidas"
                  data={transformSEValues(SEValues, SETotalArea)}
                  units="ha"
                  colors={matchColor("se")}
                />
              )}
              {!stopLoad && activeSE === SEValues.type && (
                <div className="graficaeco2">
                  <EcosystemDetails SEValues={SEValues} />
                </div>
              )}
            </div>
          ))}
      </div>
    );
  }
}
export default EcosystemsBox;
