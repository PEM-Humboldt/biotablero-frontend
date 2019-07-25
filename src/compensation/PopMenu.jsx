/** eslint verified */
import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/AddLocation';
import BackGraphIcon from '@material-ui/icons/Timeline';
import PropTypes from 'prop-types';
import Select from 'react-select';

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
      ea: null,
    };
  }

  /**
   * Event handler when a sub-basin option is selected
   */
  handleSubBasinChange = (obj) => {
    const { subBasin } = this.state;
    const subBasinSelected = obj ? obj.value : null;
    const { loadStrategies, showDotsGraph } = this.props;
    if (!subBasinSelected || subBasinSelected !== subBasin) {
      showDotsGraph(true);
      loadStrategies(null);
    }
    this.setState({
      subBasin: subBasinSelected,
      ea: null,
    });
  }

  /**
   * Event handler when a CAR option is selected
   */
  handleEAChange = (obj) => {
    const { loadStrategies, showDotsGraph } = this.props;
    const ea = obj ? obj.value : null;
    this.setState({ ea });
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
    const { biome, subBasin, ea } = this.state;
    const { data: { [biome]: { [subBasin]: easObject } } } = this.props;

    let options = [];
    if (easObject) {
      options = Object.keys(easObject).map(element => ({ value: element, label: element }));
    }
    return (
      <Select
        value={ea}
        onChange={this.handleEAChange}
        placeholder="Seleccione CAR"
        options={options}
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

    const { subBasin } = this.state;
    let options = [];
    if (subBasinsObj) {
      options = Object.keys(subBasinsObj).map(element => ({ value: element, label: element }));
    }
    return (
      <Select
        value={subBasin}
        onChange={this.handleSubBasinChange}
        placeholder="SubZona Hidrográfica"
        options={options}
      />
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
            {'Gráfico Biomas'}
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
