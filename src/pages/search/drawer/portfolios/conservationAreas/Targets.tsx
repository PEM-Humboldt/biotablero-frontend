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
  portfolioDescription: string;
  shownPortfolio: string | null;
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
      portfolioDescription: "",
      shownPortfolio: null,
    };
  }

  componentDidMount() {
    this.mounted = true;

    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    this.targetsController.loadPortfoliosTexts();
    this.targetsController.loadTargetsTexts();

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
                    this.setTargetTexts(target.target_name);
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
   * Set information texts for a selected target
   */
  setTargetTexts = (targetName: string) => {
    const targetTexts = this.targetsController.getTargetText(targetName);
    if (targetTexts) this.setState({ texts: targetTexts });
  };

  /**
   * Set information text for a selected portfolio
   */
  setInfoPortfolios = (portfolioName: string) => {
    const { shownPortfolio } = this.state;
    const portfolioDescription =
      this.targetsController.getPortfolioDescription(portfolioName);

    if (portfolioDescription)
      this.setState({ portfolioDescription: portfolioDescription });

    if (portfolioName === shownPortfolio) {
      this.setState({ shownPortfolio: null });
    } else {
      this.setState({ shownPortfolio: portfolioName });
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
      portfolioDescription,
      shownPortfolio,
    } = this.state;

    const graphData = this.targetsController.getGraphData(targetsData);

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
            description={texts.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div className="rightTitle">Meta</div>
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
              margin={{
                bottom: 30,
                left: 95,
                right: 95,
              }}
              axisX={{
                enabled: true,
                format: "=-.0~p",
                tickValues: 4,
              }}
              gridXValues={4}
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
                this.setTargetTexts(selected);
              }}
              height={500}
              selectedIndexValue={selectedTarget}
              groupMode="grouped"
              maxValue={1}
            />
          )}
        </div>
        <div className="targetsLegend">
          <FormGroup>
            {availablePortfolios.map((portfolio) => (
              <div style={{ display: "inline-flex" }} key={portfolio.name}>
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
                  title="Este portafolio"
                  className="targetsLegendInfoButton"
                  key={`info${portfolio.name}`}
                >
                  <InfoIcon
                    className={`graphinfo${
                      shownPortfolio === portfolio.name ? " activeBox" : ""
                    }`}
                    key={`infoIcon${portfolio.name}`}
                    sx={{ fontSize: 16 }}
                    onClick={() => this.setInfoPortfolios(portfolio.name)}
                  />
                </IconTooltip>
              </div>
            ))}
          </FormGroup>
        </div>

        {shownPortfolio && (
          <ShortInfo
            description={portfolioDescription}
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
