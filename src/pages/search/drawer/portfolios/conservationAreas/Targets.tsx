import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import { IconTooltip } from "pages/search/shared_components/Tooltips";
import { SquareFilledLegend } from "pages/search/shared_components/CssLegends";
import matchColor from "utils/matchColor";
import ShortInfo from "components/ShortInfo";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import SmallBars from "pages/search/shared_components/charts/SmallBars";
import { TargetsController } from "pages/search/drawer/portfolios/conservationAreas/TargetsController";

import {
  portfoliosByTarget,
  targetOrPortfolio,
} from "pages/search/types/portfolios";
import TextBoxes from "pages/search/shared_components/TextBoxes";
import { wrapperMessage } from "pages/search/types/charts";
import { textsObject } from "pages/search/types/texts";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

interface Props {}

interface State {
  showInfoGraph: boolean;
  loading: wrapperMessage;
  texts: textsObject;
  targetsData: Array<portfoliosByTarget>;
  availablePortfolios: Array<targetOrPortfolio>;
  csvData: Array<object>;
}

class Targets extends React.Component<Props, State> {
  mounted = false;
  targetsController;

  constructor(props: Props) {
    super(props);
    this.targetsController = new TargetsController();
    this.state = {
      showInfoGraph: true,
      loading: "loading",
      targetsData: [],
      availablePortfolios: [],
      texts: { info: "", cons: "", meto: "", quote: "" },
      csvData: [],
    };
  }

  componentDidMount() {
    this.mounted = true;

    const dummyData = {
      texts: {
        info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        cons: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        meto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      },
      csvData: [{ id: 1, name: "hola" }],
    };

    this.setState({ texts: dummyData.texts, csvData: dummyData.csvData });

    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    switchLayer("");

    this.targetsController
      .getData(areaId, geofenceId)
      .then((targetsData) => {
        const data: Array<portfoliosByTarget> = [];
        targetsData.forEach((targetProm, idx) => {
          targetProm.then((target) => {
            if (this.mounted) {
              data[targetsData.length - idx - 1] = target;
              this.setState({
                targetsData: data.filter((p) => p !== undefined),
                loading: null,
              });
            }
          });
        });
      })
      .catch(() => {
        this.setState({ loading: "no-data" });
      });

    this.targetsController
      .getPortolfiosList()
      .then((list) => {
        if (this.mounted) {
          this.setState({ availablePortfolios: list });
        }
      })
      .catch(() => {
        this.setState({ loading: "no-data" });
      });
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

  clickOnLegend = () => {
    // TODO: hide / show portfolio layer
  };

  render() {
    const { areaId, geofenceId } = this.context as SearchContextValues;
    const {
      showInfoGraph,
      loading,
      texts,
      targetsData,
      csvData,
      availablePortfolios,
    } = this.state;

    const graphData = this.targetsController.getGraphData(targetsData);

    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`graphinfo ? " activeBox" : ""}`}
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={texts.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <SmallBars
          data={graphData.transformedData}
          keys={graphData.keys}
          tooltips={graphData.tooltips}
          message={loading}
          colors={matchColor("caTargets")}
          axisY={{
            enabled: true,
          }}
          onClickHandler={() => {}}
          height={450}
          selectedIndexValue="WCMC"
          groupMode="grouped"
          maxValue={100}
          marginLeft={145}
        />

        <div className="targetsLegend">
          <FormGroup>
            {availablePortfolios.map((portfolio) => (
              <FormControlLabel
                label={
                  <SquareFilledLegend
                    color={matchColor("caTargets")(portfolio.name)}
                    orientation="column"
                    key={portfolio.id}
                  >
                    {portfolio.name}
                  </SquareFilledLegend>
                }
                control={
                  <Checkbox
                    sx={{ padding: 0 }}
                    onChange={this.clickOnLegend}
                    name={portfolio.name}
                  />
                }
              />
            ))}
          </FormGroup>
        </div>

        <TextBoxes
          downloadData={csvData}
          downloadName={`portfolios_by_target_${areaId}_${geofenceId}.csv`}
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

export default Targets;

Targets.contextType = SearchContext;
