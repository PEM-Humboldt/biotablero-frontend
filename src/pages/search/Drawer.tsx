import React from "react";
import withStyles from "@mui/styles/withStyles";
import BackIcon from "@mui/icons-material/FirstPage";
import Ecosistemas from "@mui/icons-material/Nature";
import Especies from "@mui/icons-material/FilterVintage";
import Paisaje from "@mui/icons-material/FilterHdr";
import Portafolios from "@mui/icons-material/DashboardCustomize";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import Landscape from "pages/search/drawer/Landscape";
import Species from "pages/search/drawer/Species";
import Ecosystems from "pages/search/drawer/Ecosystems";
import Portfolios from "pages/search/drawer/Portfolios";
import formatNumber from "utils/format";
import searchAPI from "utils/searchAPI";
import TabContainer from "pages/search/shared_components/TabContainer";
import { geofenceDetails } from "pages/search/types/drawer";

interface Props {
  handlerBackButton: () => {};
}

interface State {
  geofenceArea: number;
}

const styles = () => ({
  root: {
    width: "100%",
    backgroundColor: "transparent",
  },
});

class Drawer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      geofenceArea: 0,
    };
  }

  componentDidMount() {
    const { areaId, geofenceId, searchType } = this
      .context as SearchContextValues;

    if (searchType === "drawPolygon") {
      this.setState({ geofenceArea: Math.random() * 100 });
    } else {
      searchAPI
        .requestGeofenceDetails(areaId, geofenceId)
        .then((res: geofenceDetails) => {
          this.setState({ geofenceArea: Number(res.total_area) });
        })
        .catch(() => {});
    }
  }

  render() {
    const { handlerBackButton } = this.props;

    const { geofenceArea } = this.state;
    const { searchType } = this.context as SearchContextValues;

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
              <b>{`${formatNumber(geofenceArea, 0)} ha`}</b>
            </h4>
          </div>
        </div>
        <TabContainer
          initialSelectedIndex={initialSelectedIndex}
          titles={[
            { label: "Ecosistemas", icon: <Ecosistemas /> },
            { label: "Paisaje", icon: <Paisaje /> },
            { label: "Especies", icon: <Especies /> },
            { label: "Portafolios", icon: <Portafolios /> },
          ]}
        >
          {(geofenceArea !== 0 || searchType === "drawPolygon") && (
            <div>
              <Ecosystems generalArea={Number(geofenceArea)} />
            </div>
          )}
          <div>
            <Landscape />
          </div>
          <div>
            <Species />
          </div>
          <div>
            <Portfolios />
          </div>
        </TabContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Drawer);

Drawer.contextType = SearchContext;
