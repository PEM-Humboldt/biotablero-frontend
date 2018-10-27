/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import RestAPI from './api/REST';

class Login extends Component {
  constructor(props) {
    super(props);
    this.inputName = React.createRef();
    this.inputPassword = React.createRef();
    this.state = {
      username: '',
      password: '',
    };
  }

  handleCloseModal = () => {
    const { openModalControl } = this.props;
    openModalControl();
  };

  validateForm = () => {
    const { username, password } = this.state;
    return username.length > 0 && password.length > 0;
  }

  recoverPassword = () => {
    // TODO: Implement this functionality
    alert('Acción no disponible');
    return true;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: `${event.target.value}`,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    const { setUser } = this.props;
    const { username, password } = this.state;
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
            type="text"
            placeholder="Usuario"
            id="username"
            ref={this.inputName}
            onChange={this.handleChange}
          />
          <input
            className="loginInput"
            placeholder="Contraseña"
            id="password"
            ref={this.inputPassword}
            onChange={this.handleChange}
            type="password"
          />
          <button
            className={this.validateForm() ? 'loginbtn' : 'loginbtn disabled'}
            data-tooltip
            title="Ingresar"
            disabled={!this.validateForm()}
            type="submit"
            onClick={() => {
              setUser(RestAPI.requestUser(username, password).then(res => res));
            }}
          >
            Ingresar
          </button>
          <button
            className="recoverbtn"
            onClick={() => this.recoverPassword()}
            type="submit"
            data-tooltip
            title="Acción no disponible"
          >
            Recuperar contraseña
          </button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  openModalControl: PropTypes.func,
  setUser: PropTypes.func,
};

Login.defaultProps = {
  openModalControl: () => {},
  setUser: () => {},
};

export default Login;
