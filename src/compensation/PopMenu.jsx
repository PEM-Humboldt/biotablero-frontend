import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/AddLocation';
import BackGraphIcon from '@material-ui/icons/Timeline';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class PopMenu extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = { biome: Object.keys(nextProps.data)[0] };
    if (prevState.biome !== newState.biome) {
      newState.subBasin = null;
      newState.ea = null;
    }
    return newState;
  }

  constructor(props) {
    super(props);
    this.state = {
      biome: null,
      subBasin: null,
    };
  }

  /**
   * Event handler when a sub-basin option is selected
   */
  handleSubBasinChange = (event, values) => {
    const { subBasin } = this.state;
    const subBasinSelected = values ? values.value : null;
    const { loadStrategies, showDotsGraph } = this.props;
    if (!subBasinSelected || subBasinSelected !== subBasin) {
      showDotsGraph(true);
      loadStrategies(null);
    }
    this.setState({
      subBasin: subBasinSelected,
    });
  }

  /**
   * Event handler when a CAR option is selected
   */
  handleEAChange = (event, values) => {
    const { loadStrategies, showDotsGraph } = this.props;
    const ea = values ? values.value : null;
    if (!ea) {
      showDotsGraph(true);
      loadStrategies(null);
      return;
    }

    const { biome, subBasin } = this.state;
    const { data: { [biome]: { [subBasin]: { [ea]: valsArray } } } } = this.props;
    const { id_biome: idBiome, id_subzone: idSubzone, id_ea: idEA } = valsArray[0];

    loadStrategies({
      biome: { name: biome, id: idBiome },
      subBasin: { name: subBasin, id: idSubzone },
      ea: { name: ea, id: idEA },
    });
    showDotsGraph(false);
  }

  /**
   * Print Select element for different environmental authorities
   *
   * @param {String} subBasin Name of the basinSubzones to list options
   */
  renderEAs = () => {
    const { biome, subBasin } = this.state;
    const { data: { [biome]: { [subBasin]: easObject } } } = this.props;

    let options = [];
    if (easObject) {
      options = Object.keys(easObject).map(element => ({ value: element, label: element }));
    }
    return (
      <Autocomplete
        autoHighlight
        options={options}
        getOptionLabel={option => option.label}
        style={{ width: '100%' }}
        key={`${biome}-${subBasin}`}
        ListboxProps={
          {
            style: {
              maxHeight: '100px',
              border: '0px',
            },
          }
        }
        onChange={this.handleEAChange}
        getOptionSelected={(option, value) => option.label === value.label}
        renderInput={params => (
          <TextField
            {...params}
            placeholder="Seleccione CAR"
            variant="outlined"
            size="small"
          />
        )}
      />
    );
  }

  /**
   * Print Select element with sub-basin options
   *
   */
  renderSubBasins = () => {
    const { biome } = this.state;
    const { data: { [biome]: subBasinsObj } } = this.props;
    let options = [];
    if (subBasinsObj) {
      options = Object.keys(subBasinsObj).map(element => ({ value: element, label: element }));
    }
    return (
      <div>
        <Autocomplete
          autoHighlight
          options={options}
          getOptionLabel={option => option.label}
          style={{ width: '100%' }}
          key={`${biome}`}
          ListboxProps={
            {
              style: {
                maxHeight: '100px',
                border: '0px',
              },
            }
          }
          onChange={this.handleSubBasinChange}
          getOptionSelected={(option, value) => option.label === value.label}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="SubZona Hidrográfica"
              variant="outlined"
              size="small"
            />
          )}
        />
      </div>
    );
  }

  render() {
    const {
      showDotsGraph, visibleGraph,
    } = this.props;
    const { biome, subBasin } = this.state;
    return (
      <div className="complist-longer">
        <div className="popbtns">
          { !visibleGraph && (
          <button
            className="backgraph"
            type="button"
            onClick={() => {
              showDotsGraph(true);
            }}
          >
            <BackGraphIcon />
            Gráfico Biomas
          </button>
          )
        }
        </div>
        <AddIcon />
        <div className="Biomatit">
          {biome || 'Seleccione un bioma del gráfico o del mapa'}
        </div>
        {biome ? this.renderSubBasins() : ''}
        {subBasin ? this.renderEAs() : ''}
      </div>
    );
  }
}

PopMenu.propTypes = {
  data: PropTypes.object.isRequired,
  loadStrategies: PropTypes.func.isRequired,
  showDotsGraph: PropTypes.func.isRequired,
  visibleGraph: PropTypes.bool,
};

PopMenu.defaultProps = {
  visibleGraph: true,
};

export default PopMenu;
