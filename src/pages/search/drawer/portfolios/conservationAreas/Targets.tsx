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
  selectedTarget: string;
  selectedPortfolios: Set<number>;
  showInfoPortfolios: boolean;
  portfoliosInfoTexts: Array<{ [key: string]: string }>;
  targetsTexts: Array<{ [key: string]: textsObject }>;
  portfoliosDescription: string;
  currentPortfolioInfo: string;
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
      selectedTarget: "",
      selectedPortfolios: new Set(),
      showInfoPortfolios: false,
      portfoliosInfoTexts: [],
      targetsTexts: [],
      portfoliosDescription: "",
      currentPortfolioInfo: "",
    };
  }

  componentDidMount() {
    this.mounted = true;

    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    this.targetsController
      .getData(areaId, geofenceId)
      .then((targetsData) => {
        const data: Array<portfoliosByTarget> = [];
        targetsData.forEach((targetProm, idx) => {
          targetProm.then((target) => {
            if (this.mounted) {
              data[targetsData.length - idx - 1] = target;
              this.setState(
                {
                  targetsData: data.filter((p) => p !== undefined),
                  loading: null,
                },
                () => {
                  if (data.length > 0 && idx === 0) {
                    const portfoliosIds =
                      this.targetsController.getPortfoliosIdsByTarget(
                        target.target_name
                      );
                    if (portfoliosIds && portfoliosIds.size > 0) {
                      switchLayer(
                        `portfoliosCA|${target.target_name}|${[
                          ...portfoliosIds,
                        ].join(",")}`
                      );
                      this.setState({ selectedPortfolios: portfoliosIds });
                    }
                    this.setState({ selectedTarget: target.target_name });
                  }
                }
              );
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

    this.setState({
      portfoliosInfoTexts: this.targetsController.getPortfoliosTexts(),
    });

    this.setState({
      targetsTexts: this.targetsController.getTargetsInfoTexts(),
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

  clickOnLegend = (idPortfolio: number, checked: boolean) => {
    const { handlerClickOnGraph } = this.context as SearchContextValues;
    this.setState(
      ({ selectedPortfolios }) => {
        if (!checked) {
          selectedPortfolios.delete(idPortfolio);
          return {
            selectedPortfolios,
          };
        }
        return {
          selectedPortfolios: selectedPortfolios.add(idPortfolio),
        };
      },
      () => {
        const { selectedPortfolios, selectedTarget } = this.state;
        handlerClickOnGraph({
          chartType: "portfoliosCA",
          chartSection: selectedTarget,
          selectedKey: Array.from(selectedPortfolios),
          source: "legend",
        });
      }
    );
  };

  /**
   * Set information texts for each target
   */
  setGraphTexts = (targetName: string) => {
    const { targetsTexts } = this.state;
    const targetTexts = targetsTexts.find(
      (targetInfo) => Object.keys(targetInfo)[0] === targetName
    );
    if (targetTexts) {
      this.setState({ texts: targetTexts[targetName] });
    }
  };

  /**
   * Set information text for each portfolio
   */
  setInfoPortfolios = (portfolioName: string) => {
    const { portfoliosInfoTexts, currentPortfolioInfo } = this.state;
    const portfolioInfo = portfoliosInfoTexts.find(
      (portfolio) => Object.keys(portfolio)[0] === portfolioName
    );

    if (portfolioInfo) {
      this.setState({ portfoliosDescription: portfolioInfo[portfolioName] });
    }

    if (portfolioName === currentPortfolioInfo) {
      this.setState((prevState) => ({
        showInfoPortfolios: !prevState.showInfoPortfolios,
      }));
    } else {
      this.setState({
        currentPortfolioInfo: portfolioName,
        showInfoPortfolios: true,
      });
    }
  };

  render() {
    const { areaId, geofenceId, handlerClickOnGraph } = this
      .context as SearchContextValues;
    const {
      showInfoGraph,
      loading,
      texts,
      targetsData,
      availablePortfolios,
      selectedTarget,
      selectedPortfolios,
      showInfoPortfolios,
      portfoliosDescription,
    } = this.state;

    const graphData = this.targetsController.getGraphData(targetsData);

    if (texts.info === "" && selectedTarget) {
      this.setGraphTexts(selectedTarget);
    }

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
        <div className="rightTitle">100 % de la meta</div>
        <div className="svgPointer">
          {selectedTarget && (
            <SmallBars
              data={graphData.transformedData}
              keys={graphData.keys}
              tooltips={graphData.tooltips}
              alternateAxisY={{ values: graphData.alternateAxisYValues }}
              message={loading}
              colors={matchColor("caTargets")}
              axisY={{
                enabled: true,
              }}
              onClickHandler={(selected) => {
                const portfoliosIds =
                  this.targetsController.getPortfoliosIdsByTarget(selected);
                this.setState({
                  selectedTarget: selected,
                  selectedPortfolios: portfoliosIds,
                });
                handlerClickOnGraph({
                  chartType: "portfoliosCA",
                  chartSection: selected,
                  selectedKey: Array.from(portfoliosIds),
                });
                this.setGraphTexts(selected);
              }}
              height={450}
              selectedIndexValue={selectedTarget}
              groupMode="grouped"
              maxValue={100}
              margin={{ bottom: 5, left: 95, right: 95 }}
            />
          )}
        </div>
        <div className="targetsLegend">
          <FormGroup>
            {availablePortfolios.map((portfolio) => (
              <div style={{ display: "inline-flex" }}>
                <FormControlLabel
                  key={portfolio.id}
                  label={
                    <SquareFilledLegend
                      color={matchColor("caTargets")(portfolio.name)}
                      orientation="column"
                      key={portfolio.id}
                      disabled={
                        !this.targetsController.isPortfolioInTarget(
                          selectedTarget,
                          portfolio.id
                        )
                      }
                    >
                      {portfolio.name}
                    </SquareFilledLegend>
                  }
                  control={
                    <Checkbox
                      sx={{
                        padding: 0,
                        "&.Mui-disabled": {
                          opacity: 0.4,
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 18,
                        },
                      }}
                      onChange={(event, checked) =>
                        this.clickOnLegend(portfolio.id, checked)
                      }
                      name={portfolio.name}
                      disabled={
                        !this.targetsController.isPortfolioInTarget(
                          selectedTarget,
                          portfolio.id
                        )
                      }
                      checked={selectedPortfolios.has(portfolio.id)}
                    />
                  }
                  sx={{
                    margin: 0,
                  }}
                />
                <IconTooltip
                  title="Interpretación"
                  className="targetsLegendInfoButton"
                  key={`info${portfolio.name}`}
                >
                  <InfoIcon
                    className={`graphinfo ? " activeBox" : ""}`}
                    sx={{ fontSize: 16 }}
                    onClick={() => this.setInfoPortfolios(portfolio.name)}
                  />
                </IconTooltip>
              </div>
            ))}
          </FormGroup>
        </div>

        {showInfoPortfolios && (
          <ShortInfo
            description={portfoliosDescription}
            className="graphinfo2"
            collapseButton={false}
          />
        )}

        <TextBoxes
          downloadData={this.targetsController.getDownloadData(targetsData)}
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
