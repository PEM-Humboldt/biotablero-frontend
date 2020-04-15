/** eslint verified */
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
    const { componentsArray } = this.props;
    // This will force to open the first level in accordion when it is loaded by first time
    if (componentsArray.length > 0) {
      this.setState({
        expanded: componentsArray[0].label.id,
      });
    }
  }

  render() {
    const {
      componentsArray,
      classNameSelected,
      classNameDefault,
    } = this.props;
    const { expanded } = this.state;
    return (
      <div>
        {(componentsArray.length > 0)
          && componentsArray.map(counter => (
            <ExpansionPanel
              className={expanded !== counter.label.id ? classNameDefault : classNameSelected}
              disabled={false}
              expanded={expanded === counter.label.id}
              id={counter.label.id}
              key={counter.label.id}
              onChange={() => (this.setState({
                expanded: expanded !== counter.label.id ? counter.label.id : null,
              }))}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
              >
                {counter.label.id}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>{counter.component}</ExpansionPanelDetails>
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
};

Accordion.defaultProps = {
  classNameDefault: 'm0',
  classNameSelected: 'm0 selector-expanded',
};

export default Accordion;
