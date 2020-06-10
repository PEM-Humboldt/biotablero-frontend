import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Accordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
    };
  }

  componentDidMount() {
    const { componentsArray, handlersGeometry } = this.props;
    // This will force to open the first level in accordion when it is loaded by first time
    if (componentsArray.length > 0) {
      const defaultTab = componentsArray[0].label.id;
      this.setState({
        expanded: defaultTab,
      });
      if (defaultTab === 'fc') handlersGeometry[1](componentsArray[0].label.id);
    }
  }

  render() {
    const {
      componentsArray,
      classNameSelected,
      classNameDefault,
      handlersGeometry,
    } = this.props;
    const { expanded } = this.state;
    return (
      <div style={{ width: '100%' }}>
        {(componentsArray.length > 0)
          && componentsArray.map(item => (
            <ExpansionPanel
              className={expanded !== item.label.id ? classNameDefault : classNameSelected}
              disabled={false}
              expanded={expanded === item.label.id}
              id={item.label.id}
              key={item.label.id}
              onChange={() => {
                const newTabSelected = expanded !== item.label.id;
                this.setState({
                  expanded: newTabSelected ? item.label.id : null,
                });
                if (newTabSelected) return handlersGeometry[1](item.label.id);
                return handlersGeometry[0]();
              }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
              >
                {item.label.name}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>{item.component}</ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
      </div>
    );
  }
}

Accordion.propTypes = {
  componentsArray: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      disable: PropTypes.bool,
      expandIcon: PropTypes.object,
      detailId: PropTypes.string,
      description: PropTypes.string,
    }),
    component: PropTypes.object, // Component to show inside the accordion
  })).isRequired,
  classNameDefault: PropTypes.string, // defined in CSS file to default item for this accordion
  classNameSelected: PropTypes.string, // defined in CSS file to selected item this accordion
  handlersGeometry: PropTypes.arrayOf(PropTypes.func),
};

Accordion.defaultProps = {
  classNameDefault: 'm0b',
  classNameSelected: 'm0b selector-expanded',
  handlersGeometry: [],
};

export default Accordion;
