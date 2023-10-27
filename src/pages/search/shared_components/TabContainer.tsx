import React, { ReactElement } from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";

interface Titles {
  label: string;
  icon: ReactElement;
  disabled?: boolean;
  showTab?: boolean;
}

interface Props {
  children: Array<React.ReactNode>;
  titles: Array<Titles>;
  tabClasses?: string;
  initialSelectedIndex: number;
}

interface State {
  selectedIndex: number;
}

class TabContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    const { initialSelectedIndex } = props;
    super(props);
    this.state = {
      selectedIndex: initialSelectedIndex,
    };
  }

  /**
   * Function to change visible content on tabs click
   */
  changeTab = (event: React.SyntheticEvent, selectedIndex: number) => {
    if (this.context) {
      const { cancelActiveRequests } = this.context as SearchContextValues;
      cancelActiveRequests();
    }
    this.setState({ selectedIndex });
  };

  render() {
    const { children, titles, tabClasses = "" } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={selectedIndex}
            onChange={this.changeTab}
            className="DrawerTab"
            centered
          >
            {titles.map(
              ({ label, icon, disabled, showTab = true }, i) =>
                showTab && (
                  <Tab
                    className={`tabs ${tabClasses}`}
                    label={label}
                    icon={icon}
                    key={i}
                    disabled={disabled}
                  />
                )
            )}
          </Tabs>
        </AppBar>
        {children.map(
          (child, i) =>
            selectedIndex === i && (
              <Typography key={i} component="div" style={{ padding: 4 * 3 }}>
                {child}
              </Typography>
            )
        )}
      </div>
    );
  }
}

export default TabContainer;

TabContainer.contextType = SearchContext;
