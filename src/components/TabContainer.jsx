import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

class TabContainer extends React.Component {
  constructor(props) {
    const { initialSelectedIndex } = props;
    super(props);
    this.state = {
      value: initialSelectedIndex,
    };
  }

  /**
   * Function to change visible content on tabs click
   */
  changeTab = (event, value) => {
    const { handlerSwitchLayer } = this.props;
    this.setState({ value });
    if (value === 0) {
      handlerSwitchLayer('coverage');
    }
  };

  render() {
    const {
      children, titles, tabClasses,
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.changeTab}
            indicatorColor="secondary"
            textColor="secondary"
            centered
          >
            {titles.map(({
              label, icon, disabled, selected,
            }, i) => (
              <Tab
                className={`tabs ${tabClasses}`}
                label={label}
                icon={icon}
                key={i}
                disabled={disabled}
                selected={selected}
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

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  initialSelectedIndex: PropTypes.number,
  titles: PropTypes.array.isRequired,
  tabClasses: PropTypes.string,
  handlerSwitchLayer: PropTypes.func,
};

TabContainer.defaultProps = {
  tabClasses: '',
  initialSelectedIndex: 1,
  handlerSwitchLayer: () => {},
};

export default TabContainer;
