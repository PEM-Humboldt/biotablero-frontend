/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import CloseIcon from '@material-ui/icons/Close';
import AddProjectIcon from '@material-ui/icons/Check';

class NewProjectForm extends Component {
  constructor(props) {
    super(props);
    // const { controlValues } = props;
    this.state = {
      regionSelected: null,
      statusSelected: null,
      newName: null,
    };
  }

  /**
   * Event handler when a region option is selected
   */
  handleChangeRegion = (regionSelected) => {
    // const { controlValues,  handlers } = this.props;
    this.setState({
      // regionSelected: regionSelected && controlValues[1]? regionSelected.value : '',
      regionSelected: regionSelected ? regionSelected.value : '',
      statusSelected: null,
      newName: null,
    });
    // handlers('region', `${regionSelected}`);
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
  handleChangeStatus = (statusSelected) => {
    this.setState({
      // statusSelected: statusSelected && controlValues[2]? statusSelected.value : '',
      statusSelected: statusSelected ? statusSelected.value : '',
      newName: null,
    });
  }

  /**
   * Return the status selector and its current value
   */
  listStatus = () => {
    const { statusSelected } = this.state;
    const { status } = this.props;
    return (
      <Select
        value={statusSelected}
        onChange={this.handleChangeStatus}
        placeholder="Estado del proyecto"
        options={status}
      />
    );
  }

  /**
   * Event handler when the name is selected
   */
  handleChangeName = (event) => {
    this.setState({
      // statusSelected: statusSelected && controlValues[2]? statusSelected.value : '',
      newName: event.target.value ? event.target.value : '',
    });
  }

  render() {
    const { regionSelected, statusSelected, newName } = this.state;
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
          {regionSelected && statusSelected && newName && (
            <button
              type="button"
              className="addprjbtn"
              onClick={() => {
                handlers[0](regionSelected, statusSelected, newName.trim());
              }}
              data-tooltip
              title="Crear proyecto"
            >
              <AddProjectIcon />
            </button>)
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
