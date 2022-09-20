import React, { ReactElement } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import SearchContext, { SearchContextValues } from 'pages/search/SearchContext';

interface Titles{
  label: string;
  icon?: string | ReactElement;
  disabled?: boolean;
  selected?: string;
}

interface Props {
  children: Array<React.ReactNode>;
  titles: Array<Titles>;
  tabClasses?: string;
  initialSelectedIndex: number;
}

interface State {
  value: number;
}

class TabContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    const { initialSelectedIndex } = props;
    super(props);
    this.state = {
      value: initialSelectedIndex,
    };
  }

  /**
   * Function to change visible content on tabs click
   */
  changeTab = (event: React.SyntheticEvent, value: number) => {
    if (this.context) {
      const { cancelActiveRequests } = this.context as SearchContextValues;
      cancelActiveRequests();
    }
    this.setState({ value });
  };

  render() {
    const {
      children, titles, tabClasses = '', initialSelectedIndex = 1
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.changeTab}
            className="DrawerTab"
            centered
          >
            {titles.map(({
              label, icon, disabled
            }, i) => (
              <Tab
                className={`tabs ${tabClasses}`}
                label={label}
                icon={icon}
                key={i}
                disabled={disabled}
              />
            ))}
          </Tabs>
        </AppBar>
        {children.map((child, i) => (
          value === i && (
            <Typography key={i} component="div" style={{ padding: 4 * 3 }}>
              {child}
            </Typography>
          )
        ))}
      </div>
    );
  }
}

export default TabContainer;

TabContainer.contextType = SearchContext;
