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

  firstLevelChange = panel => (event, expanded) => {
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
    const { children, description, iconClass } = this.props;
    const { expanded, selected } = this.state;
    const data = dataPaisajes;
    return (
      <div>
        {(Object.keys(data).length > 0)
          && data.map(counter => (
            <ExpansionPanel
              className={counter.className}
              id={counter.id}
              disabled={false}
        // onChange={this.firstLevelChange(id)}
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
  handlers: PropTypes.arrayOf(PropTypes.func),
  description: PropTypes.object,
};

Accordion.defaultProps = {
  children: null,
  handlers: [],
  description: {},
};

export default Accordion;
