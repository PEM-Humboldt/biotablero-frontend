import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { CheckCircle, HighlightOff } from '@material-ui/icons';

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

  firstLevelChange = (panel) => (event, expanded) => {
    const { handlers } = this.props;
    const expandedPanel = expanded ? panel : false;
    handlers[0](expandedPanel);
    handlers[3]('Disable polygon');
    if (panel === 'addProject') {
      this.setState({
        expanded: null,
      });
    } if (panel === 'draw-polygon') {
      if (expandedPanel) handlers[3]('Create polygon');
      this.setState((prevState) => ({
        expanded: expandedPanel,
        selected: expanded ? panel : prevState.expanded,
        subExpanded: null,
      }));
    } else {
      handlers[3]('Disable polygon');
      this.setState((prevState) => ({
        expanded: expandedPanel,
        selected: expanded ? panel : prevState.expanded,
        subExpanded: null,
      }));
    }
    return null;
  };

  secondLevelChange = (subPanel) => (event, expanded) => {
    const { handlers } = this.props;
    if (subPanel === 'Confirm polygon') {
      this.setState({
        expanded: null,
      });
      handlers[3]('Confirm polygon');
    } if (subPanel === 'Delete polygon') {
      this.setState({
        expanded: null,
      });
      handlers[3]('Delete polygon');
    } else {
      this.setState({
        subExpanded: expanded ? subPanel : false,
      });
      handlers[1](subPanel, expanded);
    }
  };

  renderInnerElement = (parent, listSize, data) => (obj, index) => {
    const {
      type, label, name, id_project: projectId,
    } = obj;
    const { handlers } = this.props;
    switch (listSize) {
      case 'large':
        return (
          <Autocomplete
            id="autocomplete-selector"
            options={data}
            getOptionLabel={(option) => option.name}
            onChange={(event, values) => {
              handlers[2](parent, values);
            }}
            style={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                InputProps={params.InputProps}
                inputProps={params.inputProps}
                fullWidth={params.fullWidth}
                label="Escriba el nombre a buscar"
                placeholder="Seleccionar..."
                variant="standard"
                InputLabelProps={{ shrink: true }}
              />
            )}
            key={`${type}-${label || name}-${index}`}
            autoHighlight
            ListboxProps={
              {
                style: {
                  maxHeight: '100px',
                  border: '0px',
                },
              }
            }
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
        { (data.length > 0) && (data.map((firstLevel) => {
          const {
            id, label, disabled, iconOption, detailId, idLabel, text,
          } = firstLevel;
          const options = firstLevel.options || firstLevel.projectsStates || [];
          return (
            <Accordion
              className={`m0 ${selected === id ? 'selector-expanded' : ''}`}
              id={idLabel}
              expanded={expanded === id}
              disabled={disabled}
              onChange={this.firstLevelChange(id)}
              key={id}
            >
              <AccordionSummary
                expandIcon={
                  (((iconOption === 'add') && <AddIcon />)
                  || ((iconOption === 'upload') && <CloudUploadIcon />)
                  || ((iconOption === 'edit') && <EditIcon />)
                  || (<ExpandMoreIcon />))
                }
              >
                {label}
              </AccordionSummary>
              <AccordionDetails
                id={detailId}
              >
                {text || ''}
                {options.map((secondLevel) => {
                  const {
                    id: subId,
                    label: subLabel,
                    disabled: subDisabled,
                    iconOption: subIconOption,
                  } = secondLevel;
                  const subOptions = secondLevel.options || secondLevel.projects || [];
                  return (
                    <Accordion
                      className="m0"
                      id={subId}
                      expanded={subExpanded === subId}
                      disabled={subDisabled}
                      onChange={this.secondLevelChange(subId)}
                      key={subId}
                    >
                      <AccordionSummary
                        expandIcon={
                          (((subIconOption === 'add') && <AddIcon />)
                          || ((subIconOption === 'upload') && <CloudUploadIcon />)
                          || ((subIconOption === 'edit') && <EditIcon />)
                          || ((subIconOption === 'confirm') && <CheckCircle />)
                          || ((subIconOption === 'remove') && <HighlightOff />)
                          || (<ExpandMoreIcon />))
                        }
                      >
                        {subLabel}
                      </AccordionSummary>
                      <AccordionDetails className={subOptions.length < 7 ? 'inlineb' : ''}>
                        {subOptions.length < 7
                          ? subOptions.map(this.renderInnerElement(subId, subOptions.length))
                          : [{ subOptions }].map(this.renderInnerElement(subId, 'large', subOptions))}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </AccordionDetails>
            </Accordion>
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
    propagation: PropTypes.bool,
    text: PropTypes.string,
  })),
  handlers: PropTypes.arrayOf(PropTypes.func),
  description: PropTypes.object,
  iconClass: PropTypes.string,
  expandedId: PropTypes.number,
};

Selector.defaultProps = {
  data: [],
  handlers: [],
  description: {},
  iconClass: '',
  expandedId: 0,
};

export default Selector;
