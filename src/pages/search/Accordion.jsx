import React from 'react';
import AccordionUI from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
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
    if (componentsArray.length > 0) {
      let defaultTab = componentsArray.find(
        (item) => !item.label.collapsed,
      );
      if (defaultTab) {
        defaultTab = defaultTab.label.id;
      } else {
        defaultTab = null;
      }
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
      <>
        {componentsArray.length <= 0 && (
          <div className="graphcard">
            <h2>
              Gráficas en construcción
            </h2>
            <p>
              Pronto más información
            </p>
          </div>
        )}
        {componentsArray.map((item) => (
          <AccordionUI
            className={expanded !== item.label.id ? classNameDefault : classNameSelected}
            expanded={expanded === item.label.id}
            id={item.label.id}
            key={item.label.id}
            onChange={() => {
              const expandedTab = expanded !== item.label.id ? item.label.id : null;
              this.setState({ expanded: expandedTab });
              handlerAccordionGeometry(level, expandedTab);
            }}
            TransitionProps={{ unmountOnExit: true }}
            disabled={item.label.disabled}
          >
            <AccordionSummary
              expandIcon={item.label.icon ? (<item.label.icon />) : (<ExpandMoreIcon />)}
            >
              {item.label.name}
            </AccordionSummary>
            <AccordionDetails>
              {item.component && (
                <item.component {...item.componentProps} />
              )}
            </AccordionDetails>
          </AccordionUI>
        ))}
      </>
    );
  }
}

Accordion.propTypes = {
  componentsArray: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
      disabled: PropTypes.bool,
      collapsed: PropTypes.bool,
      icon: PropTypes.elementType,
    }),
    component: PropTypes.elementType,
    componentProps: PropTypes.object,
  })).isRequired,
  classNameDefault: PropTypes.string,
  classNameSelected: PropTypes.string,
  handlerAccordionGeometry: PropTypes.func,
  level: PropTypes.string,
};

Accordion.defaultProps = {
  classNameDefault: 'm0b',
  classNameSelected: 'm0b selector-expanded',
  handlerAccordionGeometry: () => {},
  level: '1',
};

export default Accordion;
