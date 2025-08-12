import PropTypes from "prop-types";
import React from "react";

class CustomInputNumber extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
    this.state = {
      add: true,
      inputError: false,
      value: 0,
    };
  }

  componentDidUpdate() {
    const { focus } = this.props;
    if (focus) {
      this.input.focus();
    }
  }

  /**
   * Changes the button appearance and input value according to the action received
   *
   * @param {String} action action performed
   */
  switchAction = (action, error = false) => {
    this.setState((prevState) => ({
      add: !prevState.add,
      inputError: error,
      value: action === "-" ? 0 : Number(prevState.value).toFixed(2),
    }));
  };

  render() {
    const {
      name,
      id,
      maxValue,
      operateArea,
      reportError,
      updateClickedStrategy,
    } = this.props;
    const { add, inputError, value } = this.state;
    return (
      <div>
        <input
          name={id}
          type="text"
          ref={(input) => {
            this.input = input;
          }}
          placeholder="0"
          readOnly={!add}
          className={inputError ? "inputError" : ""}
          value={value}
          onFocus={() => this.setState({ value: value || "" })}
          onClick={() => updateClickedStrategy(id)}
          onChange={({ target }) =>
            this.setState({ value: target.value || "" })
          }
        />
        <button
          className={`${add ? "addbiome" : "subbiome"} smbtn`}
          type="button"
          aria-label="Agregar hectareas"
          disabled={value <= 0}
          onClick={() => {
            const action = add ? "+" : "-";
            if (value <= maxValue) {
              operateArea(Number(value), action, id, name);
              this.switchAction(action);
            } else if (value > maxValue) {
              reportError(`No puede agregar más de ${maxValue}`);
              this.setState({ value: 0 });
            } else if (!Number.isNaN(value)) {
              reportError("Sólo números permitidos");
              this.setState({ value: 0 });
            } else {
              operateArea(0, "-");
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
  id: PropTypes.string.isRequired,
  maxValue: PropTypes.number.isRequired,
  operateArea: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  updateClickedStrategy: PropTypes.func.isRequired,
  focus: PropTypes.bool,
};

CustomInputNumber.defaultProps = {
  focus: false,
};

export default CustomInputNumber;
