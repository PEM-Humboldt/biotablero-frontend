/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableStylized from '../TableStylized';

class SelectedBiome extends Component {
  constructor(props) {
    super(props);
    const { showTable } = props;
    this.state = {
      showTable,
    };
  }

  // /**
  //  * Function to include an strategy at the strategiesSelected state
  //  *
  //  * @param {Number} value hectares indicated to save
  //  * @param {String} idStrategy id of strategies selected
  //  */
  // saveStrategy = (value, idStrategy) => {
  //   const toAddStrategy = {};
  //   toAddStrategy[idStrategy] = value;
  //   this.setState(prevState => ({
  //     strategiesSelected: [
  //       ...prevState.strategiesSelected,
  //       toAddStrategy,
  //     ],
  //   }));
  // }

  /**
   * Update state for hiding strategies table
   *
   */
  switchTable = () => {
    this.setState(prevState => ({
      showTable: !prevState.showTable,
    }));
  }

  // /**
  //  * Add or subtract a value to selectedArea
  //  *
  //  * @param {number} value amount to operate in the selectedArea
  //  * @param {number} operator indicates the operation to realize with the value
  //  */
  // deleteBiome = (area, biome, ea, szh) => {
  //   const { deleteSelectedBiome } = this.props;
  //   this.operateArea(area, '-');
  //   this.switchTable();
  //   deleteSelectedBiome(biome, ea, szh);
  // }

  render() {
    const {
      biome, subBasin, ea, area, strategies, elementSuggested,
    } = this.props;
    const { showTable } = this.state;
    const tableHeaders = ['Estrategia', 'Héctareas', 'Agregar'];
    return (
      <div className="complist">
        <div
          className="titecositema"
          role="presentation"
        >
          <div className="titeco2">
            <div>
              <b className="addedBioma">{biome}</b>
              <br />
              <b>SZH:</b>
              {subBasin}
              <br />
              <b>Jurisdicción:</b>
              {ea}
            </div>
            <div>
              <div className="HasSelected">
                {`${area} Ha`}
              </div>
              <div>
                <button
                  className={`icongraph ${showTable ? 'rotate-false' : 'rotate-true'}`}
                  type="button"
                  onClick={this.switchTable}
                  data-tooltip
                  title="Mostrar / Ocultar estrategias"
                >
                  <ExpandMoreIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
        <TableStylized
          headers={tableHeaders}
          rows={strategies}
          remarkedElement={elementSuggested}
          classTable="special"
          hide={!showTable}
        />
      </div>
    );
  }
}

// headers and rows.values must have the same length
SelectedBiome.propTypes = {
  biome: PropTypes.string.isRequired,
  ea: PropTypes.string.isRequired,
  subBasin: PropTypes.string.isRequired,
  area: PropTypes.number.isRequired,
  strategies: PropTypes.array.isRequired,
  elementSuggested: PropTypes.any,
  showTable: PropTypes.bool,
};

SelectedBiome.defaultProps = {
  elementSuggested: '',
  showTable: true,
};

export default SelectedBiome;
