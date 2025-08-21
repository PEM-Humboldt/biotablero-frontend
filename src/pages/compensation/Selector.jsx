import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@mui/material/TextField";

class Selector extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.new && nextProps.data.length > 0) {
      const { data } = nextProps;
      const expandedId = nextProps.expandedId || 0;
      const expandedByDefault = data[expandedId] || { id: null, label: null };
      return {
        expanded: expandedByDefault.id,
        selected: expandedByDefault.id,
        new: false,
      };
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
    if (panel === "addProject") {
      this.setState({
        expanded: null,
      });
    } else {
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
    this.setState({
      subExpanded: expanded ? subPanel : false,
    });
    handlers[1](subPanel, expanded);
  };

  renderInnerElement = (parent, listSize, data) => (obj, index) => {
    const { type, label, name, id_project: projectId } = obj;
    const { handlers } = this.props;
    switch (listSize) {
      case "large":
        return (
          <Autocomplete
            id="autocomplete-selector"
            options={data}
            getOptionLabel={(option) => option.name}
            onChange={(event, values) => {
              handlers[2](parent, values);
            }}
            style={{ width: "100%" }}
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
            ListboxProps={{
              style: {
                maxHeight: "100px",
                border: "0px",
              },
            }}
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
  };

  render() {
    const { description, iconClass } = this.props;
    let { data } = this.props;
    data = data || [];
    const { expanded, selected, subExpanded } = this.state;
    return (
      <div className="selector">
        <div className={iconClass} />
        <div className="description">{description}</div>
        {data.length > 0 &&
          data.map((firstLevel) => {
            const { id, label, disabled, iconOption, detailId, idLabel } =
              firstLevel;
            const options =
              firstLevel.options || firstLevel.projectsStates || [];
            return (
              <Accordion
                className={`m0 ${selected === id ? "selector-expanded" : ""}`}
                id={idLabel}
                expanded={expanded === id}
                disabled={disabled}
                onChange={this.firstLevelChange(id)}
                key={id}
              >
                <AccordionSummary
                  expandIcon={
                    (iconOption === "add" && <AddIcon />) ||
                    (iconOption === "upload" && <CloudUploadIcon />) ||
                    (iconOption === "edit" && <EditIcon />) || (
                      <ExpandMoreIcon />
                    )
                  }
                >
                  {label}
                </AccordionSummary>
                <AccordionDetails id={detailId}>
                  {options.map((secondLevel) => {
                    const {
                      id: subId,
                      label: subLabel,
                      disabled: subDisabled,
                    } = secondLevel;
                    const subOptions =
                      secondLevel.options || secondLevel.projects || [];
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
                            (iconOption === "add" && <AddIcon />) ||
                            (iconOption === "upload" && <CloudUploadIcon />) ||
                            (iconOption === "edit" && <EditIcon />) || (
                              <ExpandMoreIcon />
                            )
                          }
                        >
                          {subLabel}
                        </AccordionSummary>
                        <AccordionDetails
                          className={subOptions.length < 7 ? "inlineb" : ""}
                        >
                          {subOptions.length < 7
                            ? subOptions.map(
                                this.renderInnerElement(
                                  subId,
                                  subOptions.length
                                )
                              )
                            : [{ subOptions }].map(
                                this.renderInnerElement(
                                  subId,
                                  "large",
                                  subOptions
                                )
                              )}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })}
      </div>
    );
  }
}

Selector.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      disabled: PropTypes.bool,
      expandIcon: PropTypes.node,
      detailId: PropTypes.string,
      options: PropTypes.array,
    })
  ),
  handlers: PropTypes.arrayOf(PropTypes.func),
  description: PropTypes.object,
  iconClass: PropTypes.string,
  expandedId: PropTypes.number,
};

Selector.defaultProps = {
  data: [],
  handlers: [],
  description: {},
  iconClass: "",
  expandedId: 0,
};

export default Selector;
