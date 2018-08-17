/** eslint verified */
import React, { Component } from 'react';
import CarritoIcon from '@material-ui/icons/AddLocation';
import PropTypes from 'prop-types';
import Select from 'react-select';

class PopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      szhSelected: null,
      carSelected: null,
      showButton: true,
    };
  }

  /**
   * Event handler when a SZH option is selected
   */
  handleChangeSZH = (szhSelected) => {
    this.setState({
      szhSelected: szhSelected.value,
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
      carSelected: carSelected.value,
      showButton: true,
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
    const { subArea, loadStrategies } = this.props;
    const { szhSelected, carSelected, showButton } = this.state;
    return (
      <div className="complist">
        <CarritoIcon />
        <div className="Biomatit">
          {subArea || 'Seleccione un bioma del gráfico'}
        </div>
        {subArea ? this.listSZHOptions() : ''}
        {szhSelected ? this.listCAROptions(szhSelected) : ''}
        {(carSelected && showButton) ? (
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
  subArea: PropTypes.string,
  // Data from elastic result for "donde compensar sogamoso"
  data: PropTypes.object.isRequired,
  loadStrategies: PropTypes.func.isRequired,
};

PopMenu.defaultProps = {
  subArea: '',
};

export default PopMenu;
