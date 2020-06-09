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
    const { componentsArray, handlersGeometry } = this.props;
    // This will force to open the first level in accordion when it is loaded by first time
    if (componentsArray.length > 0 && componentsArray[0].label.id === 'FC y Biomas') {
      const defaultTab = componentsArray[0].label.id;
      this.setState({
        expanded: defaultTab,
      });
      handlersGeometry[1]('fc', { id: 'CAM', name: 'Corporacion Autonoma Regional del Alto Magdalena' });
    }
  }

  /**
   * Load layer based on expanded tab
   *
   * @param {String} layerType Layer type
   */
  loadLayer = (layerType) => {
    const { handlersGeometry } = this.props;
    switch (layerType) {
      case 'Actual':
        return (
          handlersGeometry[1]('currentHFP', { id: 'CARDER', name: 'Corporacion Autonoma Regional de Risaralda' })
        );
      case 'FC y Biomas':
        return (
          handlersGeometry[1]('fc', { id: 'CAM', name: 'Corporacion Autonoma Regional del Alto Magdalena' })
        );
      default:
        return handlersGeometry[0]();
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
          && componentsArray.map(counter => (
            <ExpansionPanel
              className={expanded !== counter.label.id ? classNameDefault : classNameSelected}
              disabled={false}
              expanded={expanded === counter.label.id}
              id={counter.label.id}
              key={counter.label.id}
              onChange={() => {
                const newTab = expanded !== counter.label.id;
                this.setState({
                  expanded: newTab ? counter.label.id : null,
                });

                if (newTab) {
                  return this.loadLayer(counter.label.id);
                }
                return handlersGeometry[0]();
              }}
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
  handlersGeometry: PropTypes.arrayOf(PropTypes.func),
};

Accordion.defaultProps = {
  classNameDefault: 'm0b',
  classNameSelected: 'm0b selector-expanded',
  handlersGeometry: [],
};

export default Accordion;
