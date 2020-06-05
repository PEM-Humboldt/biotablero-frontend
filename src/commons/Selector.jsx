// TODO: Ajustar evento del Autocompletar sobre el mapa
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

import Autocomplete from './Autocomplete';

class Selector extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.new && nextProps.data.length > 0) {
      const { data } = nextProps;
      const expandedId = nextProps.expandedId || 0;
      const expandedByDefault = data[expandedId] || { id: null, label: null };
      return { expanded: expandedByDefault.id, selected: expandedByDefault.id, new: false };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
      subExpanded: null,
      new: true,
    };
  }

  firstLevelChange = panel => (event, expanded) => {
    // console.log('firstLevelChange - expanded', expanded);
    const { handlers } = this.props;
    // console.log('firstLevelChange - handlers', handlers);
    const expandedPanel = expanded ? panel : false;
    // console.log('firstLevelChange - expandedPanel', expandedPanel);
    handlers[0](expandedPanel);
    // console.log('firstLevelChange - handlers[0](expandedPanel)', handlers[0](expandedPanel));
    if (panel === 'addProject') {
      this.setState({
        expanded: null,
      });
    } else {
      this.setState(prevState => ({
        expanded: expandedPanel,
        selected: expanded ? panel : prevState.expanded,
        subExpanded: null,
      }));
    }
    return null;
  };

  secondLevelChange = subPanel => (event, expanded) => {
    const { handlers } = this.props;
    this.setState({
      subExpanded: expanded ? subPanel : false,
    });
    handlers[1](subPanel, expanded);
  };

  renderInnerElement = (parent, listSize, data) => (obj, index) => {
    const {
      type, label, name, id_project: projectId,
    } = obj;
    const { handlers } = this.props;
    if (parent === 'ea') {
      // console.log('************ PARAM ************');
      // console.log('renderInnerElement - parent', parent);
      // console.log('renderInnerElement - listSize', listSize);
      // console.log('renderInnerElement - data', data);
      // console.log('************ => (obj, index) => ************');
      // console.log('renderInnerElement - obj', obj);
      // console.log('renderInnerElement - index', index);
      // console.log('************ HANDLERS => ************');
      // console.log('renderInnerElement - handlers', handlers);
      // console.log('************ OBJ DECONSTRUCT => ************');
      // console.log('renderInnerElement - type', type);
      // console.log('renderInnerElement - label', label);
      // console.log('renderInnerElement - name', name);
      // console.log('renderInnerElement - projectId', projectId);
    }
    switch (listSize) {
      case 'large':
        return (
          <Autocomplete
            valueSelected={(value) => {
              const itemSelected = data.find(item => item.name === value);
              handlers[2](parent, itemSelected);
              // console.log('************ AUTOCOMPLETE VALUE SELECTED ************');
              // console.log('Autocomplete - value', value);
              // console.log('Autocomplete - itemSelected', itemSelected);
              // console.log('Autocomplete - parent', parent);
              // console.log('handlers', handlers);
              // console.log('Autocomplete - handlers[2](parent, itemSelected)', handlers[2](parent, itemSelected));
            }}
            name={label || name}
            data={data}
            key={`${type}-${label || name}-${index}`}
          />
        );
      default:
        return (
          <button
            type="button"
            key={`${type}-${label || name}-${index}`}
            name={name}
            onClick={() => handlers[2](parent, projectId || name)}
          >
            {label || name}
          </button>
        );
    }
  }

  render() {
    const { description, iconClass } = this.props;
    let { data } = this.props;
    data = data || [];
    const { expanded, selected, subExpanded } = this.state;
    return (
      <div className="selector">
        <div className={iconClass} />
        <div className="description">
          {description}
        </div>
        {// console.log('render - data', data)
        }
        { (data.length > 0) && (data.map((firstLevel) => {
          const {
            id, label, disabled, iconOption, detailId, idLabel,
          } = firstLevel;
          // console.log('render - firstLevel', firstLevel);
          const options = firstLevel.options || firstLevel.projectsStates || [];
          // console.log('render - firstLevel.options || firstLevel.projectsStates || []', firstLevel.options || firstLevel.projectsStates || []);
          return (
            <ExpansionPanel
              className={`m0 ${selected === id ? 'selector-expanded' : ''}`}
              id={idLabel}
              expanded={expanded === id}
              disabled={disabled}
              onChange={this.firstLevelChange(id)}
              key={id}
            >
              <ExpansionPanelSummary
                expandIcon={
                  (((iconOption === 'add') && <AddIcon />)
                  || ((iconOption === 'upload') && <CloudUploadIcon />)
                  || ((iconOption === 'edit') && <EditIcon />)
                  || (<ExpandMoreIcon />))
                }
              >
                {label}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                id={detailId}
              >
                {// console.log('ExpansionPanelDetails - detailId', detailId)
                }
                {// console.log('ExpansionPanelDetails - options', options)
                }
                {options.map((secondLevel) => {
                  const {
                    id: subId, label: subLabel, disabled: subDisabled,
                  } = secondLevel;
                  const subOptions = secondLevel.options || secondLevel.projects || [];
                  // console.log('ExpansionPanelDetails - secondLevel', secondLevel);
                  // console.log('ExpansionPanelDetails - subOptions', subOptions);
                  return (
                    <ExpansionPanel
                      className="m0"
                      id={subId}
                      expanded={subExpanded === subId}
                      disabled={subDisabled}
                      onChange={this.secondLevelChange(subId)}
                      key={subId}
                    >
                      <ExpansionPanelSummary
                        expandIcon={
                          (((iconOption === 'add') && <AddIcon />)
                          || ((iconOption === 'upload') && <CloudUploadIcon />)
                          || ((iconOption === 'edit') && <EditIcon />)
                          || (<ExpandMoreIcon />))
                        }
                      >
                        {subLabel}
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails className={subOptions.length < 7 ? 'inlineb' : ''}>
                        {subOptions.length < 7
                          ? subOptions.map(this.renderInnerElement(subId, subOptions.length))
                          : [{ subOptions }].map(this.renderInnerElement(subId, 'large', subOptions))}
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                })}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        }))}
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
  iconClass: PropTypes.string,
};

Selector.defaultProps = {
  data: [],
  handlers: [],
  description: {},
  iconClass: '',
};

export default Selector;
