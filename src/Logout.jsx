/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import RestAPI from './api/REST';

class Logout extends Component {
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

  handleChange = (event) => {
    this.setState({
      [event.target.id]: `${event.target.value}`,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    const { removeUser, user } = this.props;
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
        <h3>
          Empresa:
        </h3>
        <h2>
          {user.name}
        </h2>
        <h3>
          Usuario:
        </h3>
        <h2>
          {user.username}
        </h2>
        <button
          className="loginbtn"
          data-tooltip
          title="Ingresar"
          type="button"
          onClick={() => {
            removeUser(RestAPI.requestUserLogout(username, password));
          }}
        >
          Salir
        </button>
      </div>
    );
  }
}

Logout.propTypes = {
  openModalControl: PropTypes.func,
  removeUser: PropTypes.func,
  user: PropTypes.object,
};

Logout.defaultProps = {
  openModalControl: () => {},
  removeUser: () => {},
  user: {},
};

export default Logout;
