// adevia
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
    this.state = {
      expanded: props.data[0].id,
      subExpanded: null,
    };
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
    const { description, data } = this.props;
    const { expanded, subExpanded } = this.state;
    return (
      <div className="selector">
        <div className="iconsection" />
        {description}
        {data.map((firstLevel) => {
          const {
            id, label, disabled, expandIcon, detailId,
          } = firstLevel;
          const options = firstLevel.options || [];
          return (
            <ExpansionPanel
              className="m0"
              id={id}
              expanded={expanded === id}
              disabled={disabled}
              onChange={this.firstLevelChange(id)}
              key={id}
            >
              <ExpansionPanelSummary expandIcon={expandIcon}>
                {label}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails id={detailId}>
                {options.map((secondLevel) => {
                  const {
                    id: subId, label: subLabel, detailClass: subClasses,
                  } = secondLevel;
                  const subOptions = secondLevel.options || [];
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
};

Selector.defaultProps = {
  data: [],
  handlers: [],
  description: {},
};

export default Selector;
