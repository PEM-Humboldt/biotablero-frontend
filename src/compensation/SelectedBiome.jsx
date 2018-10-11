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
    const { collapseTable, data } = this.props;
    this.state = {
      strategies: this.showStrategies(data),
      strategySuggested: 'Rehabilitación en áreas SINAP', // default value
      strategiesSelected: [],
      selectedArea: 0,
      tableError: '',
      showTable: !collapseTable,
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
            // value={}
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
   * @param {Number} value hectares indicated to save
   * @param {String} idStrategy id of strategies selected
   */
  saveStrategy = (value, idStrategy) => {
    const toAddStrategy = {};
    toAddStrategy[idStrategy] = value;
    this.setState(prevState => ({
      strategiesSelected: [
        ...prevState.strategiesSelected,
        toAddStrategy,
      ],
    }));
  }

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} value amount to operate in the selectedArea
   * @param {number} operator indicates the operation to realize with the value
   */
  operateArea = (value, operator, nameStrategy) => {
    // TODO: Save value for this strategy according with its name
    const { operateSelectedAreas } = this.props;
    if (value > 0) {
      operateSelectedAreas(value, operator);
      this.saveStrategy(value, nameStrategy);
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

  /**
   * Update state for hiding strategies table
   *
   */
  switchTable = () => {
    const { showTable } = this.state;
    this.setState({
      showTable: !showTable,
    });
  }

  /**
   * Add or subtract a value to selectedArea
   *
   * @param {number} value amount to operate in the selectedArea
   * @param {number} operator indicates the operation to realize with the value
   */
  deleteBiome = (area, biome, ea, szh) => {
    const { deleteSelectedBiome } = this.props;
    this.operateArea(area, '-');
    this.switchTable();
    deleteSelectedBiome(biome, ea, szh);
  }

  render() {
    const {
      strategies, selectedArea, tableError, strategySuggested, showTable,
    } = this.state;
    const {
      biome, ea, szh,
    } = this.props;
    const headers = ['Estrategia', 'Héctareas', 'Agregar'];
    return (
      <div>
        <div
          className="titecositema"
          onClick={() => this.switchTable()}
          onKeyDown={this.switchTable}
          role="presentation"
        >
          <div className="titeco2">
            <div>
              <b className="addedBioma">{`${biome}`}</b>
              <br />
              <b>SZH:</b>
              {` ${szh}`}
              <br />
              <b>Jurisdicción:</b>
              {` ${ea}`}
              {// TODO: Create texts, icons and actions for list of biomas in Shopping Cart
              }
            </div>
            <div>
              <div className="HasSelected">
                {`${selectedArea} HAs`}
              </div>
              <div>
                <button
                  className={`icongraph ${showTable ? 'rotate-false' : 'rotate-true'}`}
                  type="button"
                  onClick={() => this.switchTable()}
                  data-tooltip
                  title="Mostrar / Ocultar estrategia"
                >
                  <ExpandMoreIcon />
                </button>
                { (selectedArea > 0) && (
                <button
                  className="icondelete"
                  type="button"
                  data-tooltip
                  title="Eliminar bioma"
                  onClick={() => this.deleteBiome(selectedArea, biome, ea, szh)}
                >
                  <EraseIcon />
                </button>)}
              </div>
            </div>
          </div>
        </div>
        {tableError && (
          <div className="tableError">
            {tableError}
          </div>
        )}
        {showTable && (
          <TableStylized
            headers={headers}
            rows={strategies}
            remarkedElement={strategySuggested}
            classTable="special"
          />
        )}
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
  deleteSelectedBiome: PropTypes.func.isRequired,
  collapseTable: PropTypes.bool,
};

SelectedBiome.defaultProps = {
  collapseTable: false,
};

export default SelectedBiome;
