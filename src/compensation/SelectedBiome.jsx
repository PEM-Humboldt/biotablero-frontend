/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EraseIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableStylized from '../TableStylized';

class SelectedBiome extends Component {
  constructor(props) {
    super(props);
    const { rows } = this.props;
    this.state = {
      rows,
      strategiesSelectedByArea: [],
      selectedArea: 0,
      tableError: '',
    };
  }

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} value amount to operate in the selectedArea
   * @param {number} operator indicates the operation to realize with the value
   */
  operateArea = (value, operator) => {
    this.setState((prevState) => {
      let { selectedArea } = prevState;
      switch (operator) {
        case '+':
          selectedArea += value;
          break;
        case '-':
          selectedArea -= value;
          break;
        default:
          break;
      }
      return { selectedArea, tableError: '' };
    });
  }

  /** tableError
  * Set an error message above the compensations table
  *
  * @param {String} message message to set
  */
  reportTableError = (message) => {
    this.setState({ tableError: message });
  }

  /**
   * Function to include an strategy at the strategiesSelectedByArea state
   */
  saveStrategy = (strategies) => {
    this.setState(prevState => ({
      strategiesSelectedByArea: {
        ...prevState.strategiesSelectedByArea,
        strategies,
      },
    }));
  }

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} value amount to operate in the selectedArea
   * @param {number} operator indicates the operation to realize with the value
   */
  operateArea = (value, operator) => {
    this.setState((prevState) => {
      let { selectedArea } = prevState;
      switch (operator) {
        case '+':
          selectedArea += value;
          break;
        case '-':
          selectedArea -= value;
          break;
        default:
          break;
      }
      return { selectedArea, tableError: '' };
    });
  }

  render() {
    const { rows, selectedArea, tableError } = this.state;
    const {
      biome, car, strategySuggested, szh,
    } = this.props;
    const headers = ['Estrategia', 'Héctareas', 'Agregar'];
    return (
      <div>
        <div className="titecositema">
          <div>
            <b>Bioma: </b>
            {` ${biome}`}
            <br />
            <b>SZH:</b>
            {` ${szh}`}
            <br />
            <b>Jurisdicción:</b>
            {` ${car}`}
            {// TODO: Create texts, icons and actions for list of biomas in Shopping Cart
            }
          </div>
          <div align="right">
            <b>
              {`${selectedArea} HAs`}
            </b>
            {<ExpandMoreIcon />}
            {<EraseIcon />}
          </div>
          <div>
            <h2>
              {`Estrategia sugerida: ${strategySuggested || 'Restauración'}` /** TODO: Define value by default */}
            </h2>
          </div>
        </div>
        {tableError && (
          <div className="tableError">
            {tableError}
          </div>
        )}
        {(selectedArea < 10)
          && (<TableStylized
            headers={headers}
            rows={rows}
            classTable="special"
            dataSelected={this.saveStrategy}
          />
          )
        }
      </div>
    );
  }
}

// headers and rows.values must have the same length
SelectedBiome.propTypes = {
  biome: PropTypes.string.isRequired,
  car: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  strategySuggested: PropTypes.string,
  szh: PropTypes.string.isRequired,
};

SelectedBiome.defaultProps = {
  strategySuggested: '',
};

export default SelectedBiome;
