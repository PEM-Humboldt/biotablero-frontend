/** eslint verified */
import React, { Component } from 'react';

// const Login = children => (
//   <div>
//
//   </div>
// );

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  validateForm = () => {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
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
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          Usuario
          <input
            type="email"
            value={email}
            onChange={this.handleChange}
          />
          Contraseña
          <input
            value={password}
            onChange={this.handleChange}
            type="password"
          />
          <button
            block
            bsSize="large"
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

export default Login;
