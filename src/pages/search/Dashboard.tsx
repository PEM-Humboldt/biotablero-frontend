import React from "react";
import withStyles from "@mui/styles/withStyles";
import BackIcon from "@mui/icons-material/FirstPage";
import Ecosistemas from "@mui/icons-material/Nature";
import Especies from "@mui/icons-material/FilterVintage";
import Paisaje from "@mui/icons-material/FilterHdr";
import Portafolios from "@mui/icons-material/DashboardCustomize";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import Landscape from "pages/search/dashboard/Landscape";
import Species from "pages/search/dashboard/Species";
import Ecosystems from "pages/search/dashboard/Ecosystems";
import Portfolios from "pages/search/dashboard/Portfolios";
import formatNumber from "utils/format";
import TabContainer from "pages/search/shared_components/TabContainer";

import isFlagEnabled from "utils/isFlagEnabled";

interface Props {
  handlerBackButton(): void;
}

interface State {
  showPortfolios: boolean;
}

const styles = () => ({
  root: {
    width: "100%",
    backgroundColor: "transparent",
  },
});

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showPortfolios: false,
    };
  }

  componentDidMount() {
    isFlagEnabled("portfolios").then((value) =>
      this.setState({ showPortfolios: value })
    );
  }

  render() {
    const { searchType, areaHa } = this.context as SearchContextValues;

    const { handlerBackButton } = this.props;

    let initialSelectedIndex = 0;
    if (searchType === "drawPolygon") initialSelectedIndex = 1;

    return (
      <div className="informer">
        <div className="drawer_header">
          <button className="geobtn" type="button" onClick={handlerBackButton}>
            <BackIcon />
          </button>
          <div className="HAgen">
            <h4>
              hectáreas totales
              <b>{`${formatNumber(areaHa || 0, 0)}`}</b>
            </h4>
          </div>
        </div>
        <TabContainer
          initialSelectedIndex={initialSelectedIndex}
          titles={[
            { label: "Ecosistemas", icon: <Ecosistemas /> },
            { label: "Paisaje", icon: <Paisaje /> },
            // { label: "Especies", icon: <Especies />, showTab: false },
            {
              label: "Portafolios",
              icon: <Portafolios />,
              showTab: this.state.showPortfolios,
            },
          ]}
        >
          <div>
            <Ecosystems />
          </div>
          <div>
            <Landscape />
          </div>
          <div>
            <Species />
          </div>
          {/* <div>
            <Portfolios />
          </div> */}
        </TabContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);

Dashboard.contextType = SearchContext;
