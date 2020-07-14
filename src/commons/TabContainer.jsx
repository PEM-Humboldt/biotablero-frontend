/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

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
    const { handlerShutOffAllLayers } = this.props;
    this.setState({ value });
    if (value === 0 || value === 2) {
      handlerShutOffAllLayers();
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
  // Array of elements to print in each tab content (order should match titles order)
  children: PropTypes.node.isRequired,
  // Array of objects with info for each tab title (attributes: label, icon)
  initialSelectedIndex: PropTypes.number,
  titles: PropTypes.array.isRequired,
  // Extra clases for 'Tab' component
  tabClasses: PropTypes.string,
  handlerShutOffAllLayers: PropTypes.func,
};

TabContainer.defaultProps = {
  tabClasses: '',
  initialSelectedIndex: 1,
  handlerShutOffAllLayers: () => {},
};

export default TabContainer;
