import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import React, { Component } from "react";
import SearchContext from "pages/search/SearchContext";

import EcosystemDetails from "pages/search/drawer/strategicEcosystems/ecosystemsBox/EcosystemDetails";
import GraphLoader from "components/charts/GraphLoader";
import formatNumber from "utils/format";
import matchColor from "utils/matchColor";
import { transformSEValues } from "pages/search/utils/transformData";
import { SEValues } from "pages/search/types/ecosystems";

interface EcosystemsBoxProps {
  SETotalArea: number;
  SEAreas: Array<SEValues>;
  setActiveSE: (type: string) => {};
  activeSE: string;
}

interface ecosystemsBoxState {
  stopLoad: boolean;
}

class EcosystemsBox extends React.Component<
  EcosystemsBoxProps,
  ecosystemsBoxState
> {
  constructor(props: EcosystemsBoxProps) {
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
                <GraphLoader
                  graphType="SmallBarStackGraph"
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
EcosystemsBox.contextType = SearchContext;
