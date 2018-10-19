/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleCloseModal = () => {
    const { openModalControl } = this.props;
    openModalControl();
  };

  validateForm = () => {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
  }

  recoverPassword = () => {
    // TODO: Implement this functionality
    alert('Acción no disponible');
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="login">
        <button
          type="button"
          className="closebtn"
          onClick={this.handleCloseModal}
          data-tooltip
          title="Cerrar"
        >
          <CloseIcon />
        </button>
        <form onSubmit={this.handleSubmit}>
          <input
            className="loginInput"
            type="email"
            placeholder="Usuario"
            value={email}
            onChange={this.handleChange}
          />
          <input
            className="loginInput"
            placeholder="Contraseña"
            value={password}
            onChange={this.handleChange}
            type="password"
          />
          <button
            className="recoverbtn"
            onClick={() => this.recoverPassword()}
            type="submit"
            data-tooltip
            title="Acción no disponible"
          >
            Recuperar contraseña
          </button>
          <br />
          <button
            className="loginbtn"
            data-tooltip
            title="Ingresar"
            disabled={!this.validateForm()}
            type="submit"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  openModalControl: PropTypes.func,
};

Login.defaultProps = {
  openModalControl: () => {},
};

export default Login;
