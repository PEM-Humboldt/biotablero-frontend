/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableStylized from '../TableStylized';

class StrategiesBox extends Component {
  constructor(props) {
    super(props);
    const { showTable } = props;
    this.state = {
      showTable,
    };
  }

  /**
   * Update state for hiding strategies table
   *
   */
  switchTable = () => {
    this.setState(prevState => ({
      showTable: !prevState.showTable,
    }));
  }

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
              <b>SZH: </b>
              {subBasin}
              <br />
              <b>Jurisdicción: </b>
              {ea}
            </div>
            <div>
              <div className="HasSelected">
                {`${Number(area).toFixed(2)} Ha`}
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
StrategiesBox.propTypes = {
  biome: PropTypes.string.isRequired,
  ea: PropTypes.string.isRequired,
  subBasin: PropTypes.string.isRequired,
  area: PropTypes.number.isRequired,
  strategies: PropTypes.array.isRequired,
  elementSuggested: PropTypes.any,
  showTable: PropTypes.bool,
};

StrategiesBox.defaultProps = {
  elementSuggested: '',
  showTable: true,
};

export default StrategiesBox;
