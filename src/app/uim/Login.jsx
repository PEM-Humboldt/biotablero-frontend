import { PropTypes } from 'prop-types';
import React, { Component } from 'react';

import RestAPI from 'utils/restAPI';

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

  validateForm = () => {
    const { username, password } = this.state;
    return username.length > 0 && password.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: `${event.target.value}`,
    });
  }

  render() {
    const { username, password } = this.state;
    const { setUser } = this.props;
    return (
      <div className="login">
        <form onSubmit={(event) => event.preventDefault()}>
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
            title="Ingresar"
            disabled={!this.validateForm()}
            type="submit"
            onClick={() => {
              RestAPI.requestUser(username, password)
                .then((res) => setUser(res));
            }}
          >
            Ingresar
          </button>
          <button
            className="recoverbtn"
            type="button"
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
  setUser: PropTypes.func.isRequired,
};

export default Login;
