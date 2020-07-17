import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class LandscapeAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
    };
  }

  componentDidMount() {
    const { componentsArray } = this.props;
    if (componentsArray.length > 0) {
      const defaultTab = componentsArray.find(
        item => item.label.disabled === false,
      ).label.id;
      this.setState({ expanded: defaultTab });
    }
  }

  render() {
    const {
      componentsArray,
      classNameSelected,
      classNameDefault,
      handlerAccordionGeometry,
      level,
    } = this.props;
    const { expanded } = this.state;
    return (
      <div>
        {(componentsArray.length > 0) && componentsArray.map(item => (
          (!item.label.disabled) && (
            <ExpansionPanel
              className={expanded !== item.label.id ? classNameDefault : classNameSelected}
              expanded={expanded === item.label.id}
              id={item.label.id}
              key={item.label.id}
              onChange={() => {
                const newTabExpanded = expanded !== item.label.id;
                const expandedTab = newTabExpanded ? item.label.id : null;
                this.setState({ expanded: expandedTab });
                handlerAccordionGeometry(level, expandedTab);
              }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
              >
                {item.label.name}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>{item.component}</ExpansionPanelDetails>
            </ExpansionPanel>
          )))}
      </div>
    );
  }
}

LandscapeAccordion.propTypes = {
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
  handlerAccordionGeometry: PropTypes.func,
  level: PropTypes.string,
};

LandscapeAccordion.defaultProps = {
  classNameDefault: 'm0b',
  classNameSelected: 'm0b selector-expanded',
  handlerAccordionGeometry: () => {},
  level: '1',
};

export default LandscapeAccordion;
