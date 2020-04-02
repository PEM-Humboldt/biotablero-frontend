/** eslint verified */
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { dataPaisajes } from '../search/assets/selectorData';

class Accordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
      selected: null,
    };
  }

  onChange = panel => (event, expanded) => {
    const { handlers } = this.props;
    const expandedPanel = expanded ? panel : false;
    handlers[0](expandedPanel);
    this.setState(prevState => ({
      expanded: expandedPanel,
      selected: expanded ? panel : prevState.expanded,
    }));
    return null;
  };

  componentWillUnmounted() {
    const { handlers } = this.props;
    handlers[0](false);
  }

  render() {
    const { children, classNameSelected } = this.props;
    // to implement "selected" state to refer current element
    const { expanded } = this.state;
    const data = dataPaisajes;
    return (
      <div>
        {(Object.keys(data).length > 0)
          && data.map(counter => (
            <ExpansionPanel
              className={classNameSelected}
              id={counter.id}
              expanded={expanded === counter.id}
              disabled={false}
              key={counter.id}
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
  children: PropTypes.any,
  classNameSelected: PropTypes.string,
  handlers: PropTypes.arrayOf(PropTypes.func),
  description: PropTypes.string, // to implement as tooltip or another option
};

Accordion.defaultProps = {
  children: null,
  classNameSelected: 'm0 selector-expanded',
  handlers: [],
  description: '',
};

export default Accordion;
