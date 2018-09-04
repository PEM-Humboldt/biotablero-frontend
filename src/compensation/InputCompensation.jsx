/** eslint verified */
import PropTypes from 'prop-types';
import React from 'react';

class InputCompensation extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      add: true,
      inputError: false,
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
    }));
    if (action === '-') {
      this.inputRef.current.value = null;
    }
  }

  render() {
    const {
      name, maxValue, operateArea, reportError,
    } = this.props;
    const { add, inputError } = this.state;
    return (
      <div>
        <input
          name={name}
          ref={this.inputRef}
          type="text"
          placeholder="0"
          readOnly={!add}
          className={inputError ? 'inputError' : ''}
        />
        <button
          className={`${add ? 'addbioma' : 'subbioma'} smbtn`}
          type="button"
          onClick={() => {
            const value = Number(this.inputRef.current.value);
            const action = add ? '+' : '-';
            if (value <= maxValue) {
              operateArea(value, action);
              this.switchAction(action);
            } else {
              if (add) reportError(`No puede agregar más de ${maxValue}`);
              else operateArea(0, '-');
              this.switchAction(action, add);
            }
          }}
        />
      </div>
    );
  }
}

InputCompensation.propTypes = {
  name: PropTypes.string.isRequired,
  maxValue: PropTypes.number.isRequired,
  operateArea: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
};

export default InputCompensation;
