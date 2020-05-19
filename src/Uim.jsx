import React, { Component } from 'react';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Modal from '@material-ui/core/Modal';
import Login from './Login';
import ConfirmationModal from './ConfirmationModal';
import AppContext from './AppContext';

class Uim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutDialog: false,
      loginDialog: false,
    };
  }

  toggleModal = modal => () => {
    this.setState(state => ({ [modal]: !state[modal] }));
  };

  render() {
    const { logoutDialog, loginDialog } = this.state;
    const { user, setUser } = this.context;
    return (
      <div>
        { user ? (
          <div className="userBox">
            <div className="userInfo">
              <a
                href="https://www.grupoenergiabogota.com/"
                rel="noopener noreferrer"
                target="_blank"
                className="logoGEB"
              >
                <span />
              </a>
              <h6>
                {user.name}
              </h6>
            </div>
            <button
              type="button"
              className="iconUserLogged"
              onClick={() => this.toggleModal('logoutDialog')()}
              data-tooltip
              title="Cerrar sesión"
            />
          </div>
        )
          : (
            <button
              type="button"
              className="loginBtn"
              onClick={this.toggleModal('loginDialog')}
              data-tooltip
              title="Iniciar sesión"
            >
              <AccountCircle
                className="userBox"
                style={{ fontSize: '40px' }}
              />
            </button>
          )
        }
        <ConfirmationModal
          open={logoutDialog}
          styleCustom="newBiomeAlarm nBA2"
          onClose={this.toggleModal('logoutDialog')}
          message="¿Desea cerrar sesión?"
          onContinue={() => {
            setUser(null);
            this.setState({ loginDialog: false, logoutDialog: false });
          }}
          onCancel={this.toggleModal('logoutDialog')}
        />
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={!user && loginDialog}
          onClose={this.handleCloseModal}
          disableAutoFocus
        >
          <Login
            modalControl={this.toggleModal('loginDialog')}
          />
        </Modal>
      </div>
    );
  }
}

Uim.contextType = AppContext;

export default Uim;
