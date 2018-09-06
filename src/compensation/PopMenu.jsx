/** eslint verified */
import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/AddLocation';
import PropTypes from 'prop-types';
import Select from 'react-select';

class PopMenu extends Component {
  constructor(props) {
    super(props);
    const { layerName } = props;
    this.state = {
      szhSelected: null,
      carSelected: null,
      showButton: false,
      layerName,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { layerName } = nextProps;
    const { layerName: oldSubArea } = prevState;
    if (oldSubArea !== layerName) {
      return {
        szhSelected: null,
        carSelected: null,
        showButton: false,
        layerName,
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
    loadStrategies(szhSelected.value);
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
    this.setState({
      carSelected: carSelected ? carSelected.value : '',
      showButton: Boolean(carSelected),
    });
    const { loadStrategies } = this.props;
    loadStrategies();
  }

  /**
   * Print Select element for different car
   *
   * @param {String} nameSZH Name of the szh to list options
   */
  listCAROptions = (nameSZH) => {
    const { data } = this.props;
    if (!data || !data[nameSZH]) return null;

    const { carSelected } = this.state;
    const options = Object.keys(data[nameSZH]).map(car => ({ value: car, label: car }));
    return (
      <Select
        value={carSelected}
        onChange={this.handleChangeCAR}
        placeholder="Seleccione CAR"
        options={options}
      />
    );
  }

  render() {
    const { loadStrategies } = this.props;
    const {
      layerName, szhSelected, carSelected, showButton,
    } = this.state;
    return (
      <div className="complist">
        <AddIcon />
        <div className="Biomatit">
          {layerName || 'Seleccione un bioma del gráfico'}
        </div>
        {layerName ? this.listSZHOptions() : ''}
        {szhSelected ? this.listCAROptions(szhSelected) : ''}
        {showButton ? (
          <button
            className="addbioma"
            type="button"
            onClick={() => {
              this.setState({ showButton: false });
              loadStrategies(szhSelected, carSelected);
            }}
          />
        ) : ''}
      </div>
    );
  }
}

PopMenu.propTypes = {
  layerName: PropTypes.string,
  // Data from elastic result for "donde compensar sogamoso"
  data: PropTypes.object.isRequired,
  loadStrategies: PropTypes.func.isRequired,
};

PopMenu.defaultProps = {
  layerName: '',
};

export default PopMenu;
