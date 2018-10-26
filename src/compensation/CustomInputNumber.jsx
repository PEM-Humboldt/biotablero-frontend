/** eslint verified */
import PropTypes from 'prop-types';
import React from 'react';

class CustomInputNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      add: true,
      inputError: false,
      value: 0,
    };
  }

  /**
   * Changes the button appearance and input value according to the action received
   *
   * @param {String} action action performed
   */
  switchAction = (action, error = false) => {
    this.setState(prevState => ({
      add: !prevState.add,
      inputError: error,
      value: action === '-' ? 0 : prevState.value,
    }));
  }

  render() {
    const {
      name, maxValue, operateArea, reportError,
    } = this.props;
    const { add, inputError, value } = this.state;
    return (
      <div>
        <input
          name={name}
          type="text"
          placeholder="0"
          readOnly={!add}
          className={inputError ? 'inputError' : ''}
          value={value}
          onChange={({ target }) => this.setState({ value: Number(target.value) || 0 })}
        />
        <button
          className={`${add ? 'addbiome' : 'subbiome'} smbtn`}
          type="button"
          disabled={value <= 0}
          onClick={() => {
            const action = add ? '+' : '-';
            if (value <= maxValue) {
              operateArea(value, action, name);
              this.switchAction(action);
            } else if (add) {
              reportError(`No puede agregar más de ${maxValue}`);
              this.setState({ value: 0 });
            } else {
              operateArea(0, '-');
              this.switchAction(action, add);
            }
          }}
        />
      </div>
    );
  }
}

CustomInputNumber.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  maxValue: PropTypes.number.isRequired,
  operateArea: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
};

CustomInputNumber.defaultProps = {
  value: null,
};

export default CustomInputNumber;
