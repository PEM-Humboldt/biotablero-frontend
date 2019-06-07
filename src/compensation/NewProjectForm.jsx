/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import CloseIcon from '@material-ui/icons/Close';
import AddProjectIcon from '@material-ui/icons/Check';

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
  handleChangeRegion = (regionSelected) => {
    this.setState({
      regionSelected: regionSelected ? regionSelected.value : '',
      statusSelected: null,
      newName: null,
    });
  }

  /**
   * Return the regions selector and its current value
   */
  listRegions = () => {
    const { regionSelected } = this.state;
    const { regions } = this.props;
    return (
      <Select
        value={regionSelected}
        onChange={this.handleChangeRegion}
        placeholder="Región"
        options={regions}
      />
    );
  }

  /**
   * Event handler when a status option is selected
   */
  handleChangeStatus = (statusValue) => {
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
        <Select
          value={statusSelected}
          onChange={this.handleChangeStatus}
          placeholder="Estado del proyecto"
          options={status}
        />
        { // TODO: Handle error for new project if the company doesn' have regions and status
          (statusSelected === 'newState') && (<br />) && (
            <input
              className="projectInput"
              type="text"
              value={newNameState || ''}
              placeholder="Nuevo estado"
              onChange={this.handleChangeNameStatus}
              maxLength="50"
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
            data-tooltip
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
          <input
            className="projectInput"
            type="text"
            value={newName || ''}
            placeholder="Nombre del proyecto"
            onChange={this.handleChangeName}
            maxLength="50"
          />
          { // TODO: Handle error for new project if the company doesn' have regions and status
            regionSelected && (newNameState || statusSelected) && newName && (
            <button
              type="button"
              className="addprjbtn"
              onClick={() => {
                handlers[0](regionSelected, (newNameState || statusSelected), newName.trim());
              }}
              data-tooltip
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
