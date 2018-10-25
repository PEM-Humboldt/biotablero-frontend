/** eslint verified */
import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/AddLocation';
import BackGraphIcon from '@material-ui/icons/Timeline';
import DownloadIcon from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import Select from 'react-select';

class PopMenu extends Component {
  static getDerivedStateFromProps(nextProps) {
    return { biome: Object.keys(nextProps.data)[0] };
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
    this.setState({
      subBasin: obj.value,
      ea: null,
    });
  }

  /**
   * Event handler when a CAR option is selected
   */
  handleEAChange = (obj) => {
    const ea = obj.value;
    this.setState({ ea });
    const { biome, subBasin } = this.state;
    const { data: { [biome]: { [subBasin]: { [ea]: valsArray } } } } = this.props;
    const { id_biome: idBiome, id_subzone: idSubzone, id_ea: idEA } = valsArray[0];
    const { loadStrategies, showDotsGraph } = this.props;

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
   * @param {String} subBasin Name of the szh to list options
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
      showDotsGraph, downloadPlan, total, visibleGraph,
    } = this.props;
    const { biome, subBasin } = this.state;
    return (
      <div className="complist">
        <AddIcon />
        <div className="Biomatit">
          {biome || 'Seleccione un bioma del gráfico o del mapa'}
        </div>
        {biome ? this.renderSubBasins() : ''}
        {subBasin ? this.renderEAs() : ''}
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
            </button>)
          }
          {total && (
            <button
              className="downgraph"
              type="button"
              onClick={() => downloadPlan()}
            >
              <DownloadIcon className="icondown" />
              {'Descargar plan'}
            </button>)
          }
        </div>
      </div>
    );
  }
}

PopMenu.propTypes = {
  total: PropTypes.number,
  // Data from elastic result for "donde compensar sogamoso"
  // TODO: Implement source data changes for RestAPI
  data: PropTypes.object.isRequired,
  loadStrategies: PropTypes.func.isRequired,
  downloadPlan: PropTypes.func.isRequired,
  showDotsGraph: PropTypes.func.isRequired,
  visibleGraph: PropTypes.bool,
};

PopMenu.defaultProps = {
  total: 0,
  visibleGraph: true,
};

export default PopMenu;
