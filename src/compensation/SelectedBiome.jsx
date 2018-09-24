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
      strategies: this.showStrategies(data),
      strategySuggested: 'Rehabilitación en áreas SINAP', // default value
      strategiesSelected: [],
      selectedArea: 0,
      tableError: '',
      show_table: true,
    };
  }

  /**
   * Function to add an input and review if is an strategy suggested for each strategy
   *
   * @param {Array} data input with all strategies information, just one strategy suggested
   */
  showStrategies = (data) => {
    const strategies = data.map(({ _source: obj }) => {
    // TODO: Set strategySuggested inside TableStylized from biome data
      if (obj.SUGERIDA) {
        const name = obj.ESTRATEGIA;
        this.setState(prevState => ({
          strategySuggested: {
            ...prevState.strategySuggested,
            name,
          },
        }));
      }
      return ({
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
      });
    });
    return strategies;
  }

  /**
  * Set an error message above the compensations table
  *
  * @param {String} message message to set
  */
  reportTableError = (message) => {
    this.setState({ tableError: message });
  }

  /**
   * Function to include an strategy at the strategiesSelected state
   *
   * @param {Array} strategies set of strategies selected
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
    const { operateSelectedAreas } = this.props;
    if (value > 0) {
      operateSelectedAreas(value, operator);
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
  }

  switchTable = () => {
    const { show_table: showTable } = this.state;
    this.setState({
      show_table: !showTable,
    });
  }

  render() {
    const {
      strategies, selectedArea, tableError, strategySuggested,
    } = this.state;
    const {
      biome, ea, szh,
    } = this.props;
    const headers = ['Estrategia', 'Héctareas', 'Agregar'];
    return (
      <div>
        <div className="titecositema">
          <div>
            {
              <button
                className="icondelete"
                type="button"
                data-tooltip
                title="Eliminar bioma"
              >
                <EraseIcon />
              </button>
            }
            <b>Bioma: </b>
            {` ${biome}`}
            <br />
            <b>SZH:</b>
            {` ${szh}`}
            <br />
            <b>Jurisdicción:</b>
            {` ${ea}`}
            {// TODO: Create texts, icons and actions for list of biomas in Shopping Cart
            }
          </div>
          <div align="center">
            <b>
              {`${selectedArea} HAs`}
            </b>
            {
              <button
                className="icongraph"
                type="button"
                onClick={() => this.switchTable()}
                onFocus={() => {
                  console.log('Hola1');
                }}
                data-tooltip
                title="Mostrar / Ocultar estrategia"
              >
                <ExpandMoreIcon />
              </button>
            }
          </div>
        </div>
        {tableError && (
          <div className="tableError">
            {tableError}
          </div>
        )}
        {(selectedArea < 1000)
          && (<TableStylized
            headers={headers}
            rows={strategies}
            remarkedElement={strategySuggested}
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
  ea: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  szh: PropTypes.string.isRequired,
  operateSelectedAreas: PropTypes.func.isRequired,
};

export default SelectedBiome;
