/** eslint verified */
import React, { Component } from 'react';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Modal from '@material-ui/core/Modal';
import Login from '../Login';
import Logout from '../Logout';

/* Uim: User Interface Manager */
class Uim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      user: null,
    };
  }

  handleCloseModal = () => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal });
  };

  setUser = (user) => {
    user.then((res) => {
      this.setState({ user: res });
      this.handleCloseModal();
      return true;
    });
    return false;
  };

  removeUser = (user) => {
    if (user) {
      this.setState({ user: null });
      this.handleCloseModal();
      return true;
    }
    return false;
  };

  render() {
    const { openModal, user } = this.state;
    return (
      <div>
        { user ? (
          <a
            href="https://www.grupoenergiabogota.com/"
            rel="noopener noreferrer"
            target="_blank"
            className="logoGEB"
          >
            <span />
          </a>
        )
          : '' }
        <button
          type="button"
          className="loginBtn"
          onClick={this.handleCloseModal}
        >
          <AccountCircle
            className="userBox"
            style={{ fontSize: '40px' }}
          />
        </button>
        {user
          ? (openModal && (
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openModal}
            onClose={this.handleCloseModal}
            disableAutoFocus
          >
            <Logout
              user={user}
              openModalControl={this.handleCloseModal}
              removeUser={this.removeUser}
            />
          </Modal>))
          : (openModal && (
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openModal}
            onClose={this.handleCloseModal}
            disableAutoFocus
          >
            <Login
              openModalControl={this.handleCloseModal}
              setUser={this.setUser}
            />
          </Modal>))
        }
      </div>
    );
  }
}

export default Uim;
