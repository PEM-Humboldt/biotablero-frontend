import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import { IconTooltip } from "pages/search/shared_components/Tooltips";
import { LegendColor } from "pages/search/shared_components/CssLegends";
import matchColor from "utils/matchColor";
import ShortInfo from "components/ShortInfo";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import SmallBars from "pages/search/shared_components/charts/SmallBars";

import { portfoliosByTarget, target } from "pages/search/types/portfolios";
import TextBoxes from "pages/search/shared_components/TextBoxes";
import { wrapperMessage } from "pages/search/types/charts";
import { textsObject } from "pages/search/types/texts";
import SearchAPI from "utils/searchAPI";

interface Props {}

interface tagetsData {
  [targetId: number]: portfoliosByTarget;
}

interface State {
  showInfoGraph: boolean;
  loading: wrapperMessage;
  texts: textsObject;
  targetsList: Array<target>;
  targetsData: Array<tagetsData>;
  csvData: Array<object>;
}

class Targets extends React.Component<Props, State> {
  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      loading: "loading",
      targetsList: [],
      targetsData: [],
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

    SearchAPI.requestTargetsList(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            targetsList: res,
            loading: null,
          });

          res.forEach((element) => {
            this.getPortfolioData(element.id);
          });
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

  /**
   * Get data about selected target
   *
   * @param {number} targetId portfolio target id
   */
  getPortfolioData = (targetId: number) => {
    const { areaId, geofenceId } = this.context as SearchContextValues;

    SearchAPI.requestPortfoliosByTarget(areaId, geofenceId, targetId)
      .then((res) => {
        if (this.mounted) {
          this.setState((prevState) => ({
            targetsData: [...prevState.targetsData, { [targetId]: res }],
          }));
        }
      })
      .catch(() => {
        this.setState({ loading: "no-data" });
      });
  };

  render() {
    const { areaId, geofenceId } = this.context as SearchContextValues;
    const { showInfoGraph, loading, texts, csvData } = this.state;

    const chartData = [
      {
        id: "12",
        name: "1234",
        key: "2",
        value: 12.5,
        area: 40.5,
      },
    ];

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
        <div>
          <SmallBars
            data={chartData}
            message={loading}
            colors={matchColor("dpc")}
            labelX="dPC"
            units="ha"
            onClickHandler={() => {}}
          />
        </div>

        <div className="fiLegend">
          <LegendColor color="#e25648" orientation="column" key="wcnc">
            WCNC
          </LegendColor>

          <LegendColor color="#ee8531" orientation="column" key="elsa">
            ELSA
          </LegendColor>

          <LegendColor color="#fdc031" orientation="column" key="eca">
            Especies, Carbono, Agua
          </LegendColor>
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
