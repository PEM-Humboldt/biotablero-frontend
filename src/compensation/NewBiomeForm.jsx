/** eslint verified */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Select from 'react-select';
import CloseIcon from '@material-ui/icons/Close';
import AddProjectIcon from '@material-ui/icons/Check';

class NewBiomeForm extends Component {
  constructor(props) {
    super(props);
    // const { controlValues } = props;
    this.state = {
      biomeSelected: null,
    };
  }

  /**
   * Event handler when a biomes option is selected
   */
  handleChangeBiomes = (biomeSelected) => {
    // const { controlValues,  handlers } = this.props;
    this.setState({
      // biomeSelected: biomeSelected && controlValues[1]? biomeSelected.value : '',
      biomeSelected: biomeSelected ? biomeSelected.value : '',
    });
  }

  /**
   * Return the biomes selector and its current value
   */
  listBiomes = () => {
    const { biomeSelected } = this.state;
    // const { biomes } = this.props;
    return (
      <Select
        value={biomeSelected}
        onChange={this.handleChangeBiomes}
        placeholder="Biomas disponibles"
        // options={biomes.map(element => element.value)}
        // options={biomes}
      />
    );
  }

  render() {
    const { biomeSelected } = this.state;
    return (
      <div className="newBiome">
        <div className="newProjectTitle">
          <h2>Agregar bioma</h2>
          <button
            type="button"
            className="closebtn"
            onClick={() => {}}
            data-tooltip
            title="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="npcontent">
          {this.listBiomes()}
          <br />
          {biomeSelected && (
            <button
              type="button"
              className="addprjbtn"
              onClick={() => {}}
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

// NewBiomeForm.propTypes = {
//   biomes: PropTypes.array,
// };
//
// NewBiomeForm.defaultProps = {
//   biomes: [],
// };

export default NewBiomeForm;
