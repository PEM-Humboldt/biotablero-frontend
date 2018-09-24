/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EraseIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableStylized from '../TableStylized';
import InputCompensation from './InputCompensation';

class SelectedBiome extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      data,
      strategies: [],
      strategiesSelected: [],
      selectedArea: 0,
      tableError: '',
    };
  }

  showStrategies = (data) => {
    console.log('data', data)
    const strategies = data.map(({ _source: obj }) => ({
      key: obj.GROUPS,
      values: [
        obj.ESTRATEGIA,
        Number(obj.HA_ES_EJ).toFixed(2),
        <InputCompensation
          name={obj.GROUPS}
          maxValue={Number(obj.HA_ES_EJ)}
          operateArea={this.operateArea}
          reportError={this.reportTableError}
        />,
      ],
    }));
    this.setState(prevState => ({
      strategies,
      showGraphs: {
        ...prevState.showGraphs,
        DotsWhere: false,
      },
    }));
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
   * Function to include an strategy at the strategiesSelected state
   */
  saveStrategy = (strategies) => {
    this.setState(prevState => ({
      strategiesSelected: {
        ...prevState.strategiesSelected,
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
    const { data, selectedArea, tableError } = this.state;
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
            <h3>
              {`Estrategia sugerida: ${strategySuggested || 'Restauración en áreas SINAP'}` /** TODO: Define value by default */}
            </h3>
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
            rows={this.showStrategies(data)}
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
  data: PropTypes.array.isRequired,
  strategySuggested: PropTypes.string,
  szh: PropTypes.string.isRequired,
};

SelectedBiome.defaultProps = {
  strategySuggested: '',
};

export default SelectedBiome;
