import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
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
        {componentsArray.map(item => (
          <Accordion
            className={expanded !== item.label.id ? classNameDefault : classNameSelected}
            expanded={expanded === item.label.id}
            id={item.label.id}
            key={item.label.id}
            onChange={() => {
              const expandedTab = expanded !== item.label.id ? item.label.id : null;
              this.setState({ expanded: expandedTab });
              handlerAccordionGeometry(level, expandedTab);
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              {item.label.name}
            </AccordionSummary>
            <AccordionDetails>
              <item.component {...item.componentProps} />
            </AccordionDetails>
          </Accordion>
        ))}
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
    }),
    component: PropTypes.func,
    componentProps: PropTypes.object,
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
