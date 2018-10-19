/** eslint verified */
import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/AddLocation';
import BackGraphIcon from '@material-ui/icons/Timeline';
import DownloadIcon from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import Select from 'react-select';

class PopMenu extends Component {
  constructor(props) {
    super(props);
    const { controlValues } = props;
    this.state = {
      szhSelected: null,
      carSelected: null,
      layerName: controlValues[0],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { controlValues } = nextProps;
    const { layerName: oldSubArea } = prevState;
    if (oldSubArea !== controlValues[0]) {
      return {
        szhSelected: null,
        carSelected: null,
        layerName: controlValues[0],
      };
    }
    return null;
  }

  /**
   * Event handler when a SZH option is selected
   */
  handleChangeSZH = (szhSelected) => {
    this.setState({
      szhSelected: szhSelected ? szhSelected.value : '',
      carSelected: null,
    });
    const { loadStrategies } = this.props;
    if (szhSelected) loadStrategies(szhSelected.value);
    else loadStrategies(null, null);
  }

  /**
   * Print Select element with szh options
   */
  listSZHOptions = () => {
    const { data } = this.props;
    if (!data) return null;

    const { szhSelected } = this.state;
    const options = Object.keys(data).map(szh => ({ value: szh, label: szh }));
    return (
      <Select
        value={szhSelected}
        onChange={this.handleChangeSZH}
        placeholder="SubZona Hidrográfica"
        options={options}
      />
    );
  }

  /**
   * Event handler when a CAR option is selected
   */
  handleChangeCAR = (carSelected) => {
    const { szhSelected } = this.state;
    const { controlValues } = this.props;
    this.setState({
      carSelected: carSelected && controlValues[2] ? carSelected.value : '',
    });
    const { loadStrategies } = this.props;
    if (carSelected) loadStrategies(szhSelected, carSelected.value);
    else loadStrategies(szhSelected, null);
  }

  /**
   * Print Select element for different car
   *
   * @param {String} nameSZH Name of the szh to list options
   */
  listCAROptions = (nameSZH) => {
    const { data, controlValues } = this.props;
    if (!data || !data[nameSZH]) return null;

    const { carSelected } = this.state;
    const options = Object.keys(data[nameSZH]).map(car => ({ value: car, label: car }));
    return (
      <Select
        value={!controlValues[2] ? carSelected : ''}
        onChange={this.handleChangeCAR}
        placeholder="Seleccione CAR"
        options={options}
      />
    );
  }

  render() {
    const {
      showDotsGraph, downloadPlan, controlValues,
    } = this.props;
    const {
      layerName, szhSelected,
    } = this.state;
    return (
      <div className="complist">
        <AddIcon />
        <div className="Biomatit">
          {controlValues[0] || 'Seleccione un bioma del gráfico o del mapa'}
        </div>
        {layerName ? this.listSZHOptions() : ''}
        {szhSelected ? this.listCAROptions(szhSelected) : ''}
        <div className="popbtns">
          { !controlValues[2] && (
          <button
            className="backgraph"
            type="button"
            onClick={() => {
              this.setState({
                carSelected: '',
              });
              showDotsGraph(true);
            }}
          >
            <BackGraphIcon />
            {'Gráfico Biomas'}
          </button>)}
          {controlValues[1] && (
          <button
            className="downgraph"
            type="button"
            onClick={() => downloadPlan(true)}
          >
            <DownloadIcon className="icondown" />
            {'Descargar plan'}
          </button>)}
        </div>
      </div>
    );
  }
}

PopMenu.propTypes = {
  controlValues: PropTypes.array,
  // Data from elastic result for "donde compensar sogamoso"
  // TODO: Implement source data changes for RestAPI
  data: PropTypes.object.isRequired,
  loadStrategies: PropTypes.func.isRequired,
  downloadPlan: PropTypes.func.isRequired,
  showDotsGraph: PropTypes.func.isRequired,
};

PopMenu.defaultProps = {
  controlValues: [],
};

export default PopMenu;
