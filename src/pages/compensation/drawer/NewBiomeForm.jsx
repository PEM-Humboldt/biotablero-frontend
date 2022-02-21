import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddProjectIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

class NewBiomeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      biomeSelected: null,
    };
  }

  /**
   * Event handler when a biomes option is selected
   */
  handleChangeBiomes = (event, biomeSelected) => {
    this.setState({ biomeSelected });
  }

  /**
   * Return the biomes selector and its current value
   */
  listBiomes = () => {
    const { biomes } = this.props;
    return (
      <Autocomplete
        autoHighlight
        options={biomes}
        getOptionLabel={(biome) => biome.name}
        renderInput={(params) => (
          <TextField
            InputProps={params.InputProps}
            inputProps={params.inputProps}
            fullWidth={params.fullWidth}
            placeholder="Biomas disponibles"
            variant="outlined"
          />
        )}
        ListboxProps={
          {
            style: {
              maxHeight: '150px',
              border: '0px',
            },
          }
        }
        onChange={this.handleChangeBiomes}
        size="small"
      />
    );
  }

  render() {
    const { biomeSelected } = this.state;
    const { addBiomeHandler } = this.props;
    return (
      <div className="newBiome">
        <h2>Agregar bioma</h2>
        <div className="npcontent">
          {this.listBiomes()}
          {biomeSelected && (
            <button
              type="button"
              className="addprjbtn"
              onClick={() => {
                addBiomeHandler(biomeSelected);
                this.setState({ biomeSelected: null });
              }}
              title="Agregar bioma"
            >
              <AddProjectIcon />
            </button>
          )}
        </div>
      </div>
    );
  }
}

NewBiomeForm.propTypes = {
  biomes: PropTypes.array,
  addBiomeHandler: PropTypes.func,
};

NewBiomeForm.defaultProps = {
  biomes: [],
  addBiomeHandler: () => {},
};

export default NewBiomeForm;
