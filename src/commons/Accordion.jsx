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

  render() {
    const {
      accordionLabelsData, // Titles and data required for the accordion label
      // Template in file, use this one: import { dataPaisajes } from '../search/assets/selectorData';
      /* Template: [{
        id: 'Huella humana',
        name: 'Huella humana',
        disabled: false,
        expandIcon: <AddIcon />,
        detailId: 'Huella humana en el área',
        description: 'Representa diferentes análisis de huella humana en esta área de consulta',
      }]
      */
      children, // any component to show inside this array item from accordionLabelsData
      classNameSelected, // className defined in CSS file to selected item this accordion
      classNameDefault, // className defined in CSS file to default item for this accordion
    } = this.props;
    const { expanded } = this.state;
    return (
      <div>
        {(Object.keys(accordionLabelsData).length > 0)
          && accordionLabelsData.map(counter => (
            <ExpansionPanel
              className={expanded !== counter.id ? classNameDefault : classNameSelected}
              disabled={false}
              expanded={expanded === counter.id}
              id={counter.id}
              key={counter.id}
              onClick={() => (this.setState({ expanded: expanded !== counter.id ? counter.id : null }))}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
              >
                {counter.id}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
      </div>
    );
  }
}

Accordion.propTypes = {
  accordionLabelsData: PropTypes.array,
  children: PropTypes.any,
  classNameDefault: PropTypes.string,
  classNameSelected: PropTypes.string,
};

Accordion.defaultProps = {
  accordionLabelsData: [],
  children: null,
  classNameDefault: 'm0',
  classNameSelected: 'm0 selector-expanded',
};

export default Accordion;
