/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import AddProjectIcon from '@material-ui/icons/Check';

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
  handleChangeBiomes = (biomeSelected) => {
    this.setState({ biomeSelected });
  }

  /**
   * Return the biomes selector and its current value
   */
  listBiomes = () => {
    const { biomeSelected } = this.state;
    const { biomes } = this.props;
    return (
      <Select
        ref={this.selectRef}
        value={biomeSelected}
        onChange={this.handleChangeBiomes}
        placeholder="Biomas disponibles"
        options={biomes.map(biome => ({ ...biome, label: biome.name }))}
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
              data-tooltip
              title="Agregar bioma"
            >
              <AddProjectIcon />
            </button>)
          }
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
