import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import AddProjectIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

class NewProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regionSelected: null,
      statusSelected: null,
      newName: null,
      newNameState: null,
    };
  }

  /**
   * Event handler when a region option is selected
   */
  handleChangeRegion = (event, values) => {
    this.setState({
      regionSelected: values ? values.value : '',
      statusSelected: null,
      newName: null,
    });
  }

  /**
   * Return the regions selector and its current value
   */
  listRegions = () => {
    const { regions } = this.props;
    return (
      <Autocomplete
        autoHighlight
        options={regions}
        getOptionLabel={(option) => option.label}
        onChange={this.handleChangeRegion}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        renderInput={(params) => (
          <TextField
            InputProps={params.InputProps}
            inputProps={params.inputProps}
            fullWidth={params.fullWidth}
            placeholder="Región"
            variant="outlined"
            size="small"
          />
        )}
      />
    );
  }

  /**
   * Event handler when a status option is selected
   */
  handleChangeStatus = (event, statusValue) => {
    this.setState({
      statusSelected: statusValue ? statusValue.value : '',
      newNameState: null,
      newName: null,
    });
  }

  /**
   * Return the status selector and its current value
   */
  listStatus = () => {
    const { statusSelected, newNameState } = this.state;
    const { status } = this.props;
    return (
      <div>
        <Autocomplete
          autoHighlight
          options={status}
          getOptionLabel={(option) => option.label}
          ListboxProps={
            {
              style: {
                border: '0px',
              },
            }
          }
          onChange={this.handleChangeStatus}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          renderInput={(params) => (
            <TextField
              InputProps={params.InputProps}
              inputProps={params.inputProps}
              fullWidth={params.fullWidth}
              placeholder="Estado del proyecto"
              variant="outlined"
              size="small"
            />
          )}
          renderOption={(props, option) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
        />
        { // TODO: Handle error for new project if the company doesn' have regions and status
          (statusSelected === 'newState') && (<br />) && (
            <TextField
              value={newNameState || ''}
              placeholder="Nuevo estado"
              onChange={this.handleChangeNameStatus}
              inputProps={{ maxLength: 50 }}
              variant="outlined"
              fullWidth
              size="small"
            />
          )
        }
      </div>
    );
  }

  /**
   * Event handler when the name is selected
   */
  handleChangeName = (event) => {
    this.setState({
      newName: event.target.value ? event.target.value : '',
    });
  }

  /**
   * Event handler when the name is selected
   */
  handleChangeNameStatus = (event) => {
    this.setState({
      newNameState: event.target.value ? event.target.value : '',
    });
  }

  render() {
    const {
      regionSelected, statusSelected, newName, newNameState,
    } = this.state;
    const { handlers } = this.props;
    return (
      <div className="newProjectModal">
        <div className="newProjectTitle">
          <h2>Nuevo proyecto</h2>
          <button
            type="button"
            className="closebtn"
            onClick={handlers[1]}
            title="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="npcontent">
          {this.listRegions()}
          <br />
          {this.listStatus()}
          <br />
          <TextField
            value={newName || ''}
            placeholder="Nombre del proyecto"
            onChange={this.handleChangeName}
            variant="outlined"
            inputProps={{ maxLength: 50 }}
            fullWidth
            size="small"
          />
          { // TODO: Handle error for new project if the company doesn' have regions and status
            regionSelected && (newNameState || statusSelected) && newName && (
            <button
              type="button"
              className="addprjbtn"
              onClick={() => {
                handlers[0](regionSelected, (newNameState || statusSelected), newName.trim());
              }}
              title="Crear proyecto"
            >
              <AddProjectIcon />
            </button>
            )
          }
        </div>
      </div>
    );
  }
}

NewProjectForm.propTypes = {
  regions: PropTypes.array.isRequired,
  status: PropTypes.array.isRequired,
  handlers: PropTypes.array.isRequired,
};

export default NewProjectForm;
