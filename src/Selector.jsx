/** eslint verified */
// TODO: Ajustar evento del Autocompletar sobre el mapa
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import PropTypes from 'prop-types';

import Autocomplete from './Autocomplete';

class Selector extends React.Component {
  constructor(props) {
    super(props);
    const data = props.data || [];
    const expandedId = props.expandedId || 0;
    const expandedByDefault = data[expandedId] || { id: null, label: null };
    this.state = {
      expanded: expandedByDefault.id === -1 ? 0 : expandedByDefault.id,
      subExpanded: null,
    };
    props.handlers[0](expandedByDefault.label);
  }

  firstLevelChange = panel => (event, expanded) => {
    const { handlers } = this.props;
    this.setState({
      expanded: expanded ? panel : false,
    });
    handlers[0](panel);
  };

  secondLevelChange = subPanel => (event, expanded) => {
    const { handlers } = this.props;
    this.setState({
      subExpanded: expanded ? subPanel : false,
    });
    handlers[1](subPanel);
  };

  renderInnerElement = parent => ({
    type, label, name, data,
  }) => {
    const { handlers } = this.props;
    switch (type) {
      case 'button':
        return (
          <button
            type="button"
            key={`${type}-${label}`}
            name={name}
            onClick={event => handlers[2](parent, event.target.name)}
          >
            {label}
          </button>
        );
      case 'autocomplete':
        return (
          <Autocomplete
            valueSelected={value => handlers[2](parent, value)}
            name={name}
            data={data}
            key={`${type}-${label}`}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { description, iconClass } = this.props;
    let { data } = this.props;
    data = data || [];
    const { expanded, subExpanded } = this.state;
    return (
      <div className="selector">
        <div className={iconClass} />
        {description}
        {data.map((firstLevel) => {
          const {
            id, label, disabled, expandIcon, detailId, idLabel,
          } = firstLevel;
          const options = firstLevel.options || firstLevel.projectsStates || [];
          return (
            <ExpansionPanel
              className="m0"
              id={idLabel}
              expanded={expanded === id}
              disabled={disabled}
              onChange={this.firstLevelChange(id)}
              key={id}
            >
              <ExpansionPanelSummary expandIcon={expandIcon}>
                {label}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                id={detailId}
              >
                {options.map((secondLevel) => {
                  const {
                    id: subId, label: subLabel, detailClass: subClasses,
                  } = secondLevel;
                  const subOptions = secondLevel.options || secondLevel.projects || [];
                  return (
                    <ExpansionPanel
                      className="m0"
                      id={subId}
                      expanded={subExpanded === subId}
                      onChange={this.secondLevelChange(subId)}
                      key={subId}
                    >
                      <ExpansionPanelSummary expandIcon={expandIcon}>
                        {subLabel}
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails className={subClasses}>
                        {subOptions.map(this.renderInnerElement(subId))}
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                })}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    );
  }
}

Selector.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    expandIcon: PropTypes.Component,
    detailId: PropTypes.string,
    options: PropTypes.array,
  })),
  handlers: PropTypes.arrayOf(PropTypes.func),
  description: PropTypes.object,
  expandedId: PropTypes.number,
  iconClass: PropTypes.string,
};

Selector.defaultProps = {
  data: [],
  handlers: [],
  description: {},
  expandedId: 0,
  iconClass: '',
};

export default Selector;
