import { PropTypes } from 'prop-types';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import React, { Component } from 'react';

import AppContext from 'app/AppContext';
import Login from 'app/uim/Login';
import UserInfo from 'app/uim/UserInfo';
import ConfirmationModal from 'components/ConfirmationModal';

class Uim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
      logoutModal: false,
      userModal: false,
    };
  }

  /**
   * Meant to be used by onClick handlers. Set the state for the corresponding
   * modal to true, and the others to false.
   *
   * @params {String} modal modal name to turn on
   *
   * @returns {function}
   */
  showModal = (modal) => () => {
    switch (modal) {
      case 'loginModal':
        this.setState({ loginModal: true, logoutModal: false, userModal: false });
        break;
      case 'logoutModal':
        this.setState({ loginModal: false, logoutModal: true, userModal: false });
        break;
      case 'userModal':
        this.setState({ loginModal: false, logoutModal: false, userModal: true });
        break;
      default:
        break;
    }
  };

  /**
   * Meant to be used by onClick handlers. Set the state for the corresponding
   * modal to false
   *
   * @params {String} modal modal name to turn off
   *
   * @returns {function}{void}
   */
  turnOffModal = (modal) => () => {
    this.setState({ [modal]: false });
  }

  render() {
    const { loginModal, userModal, logoutModal } = this.state;
    const { setUser } = this.props;
    const { user } = this.context;
    const whichModal = user
      ? { modal: 'userModal', state: userModal }
      : { modal: 'loginModal', state: loginModal };
    return (
      <div className="loginBtnCont">
        <button
          type="button"
          className="loginBtn"
          onClick={this.showModal(whichModal.modal)}
          title="Iniciar sesión"
        >
          { user
            ? (<AccountCircle className="userBox" style={{ fontSize: '40px' }} />)
            : (<AccountCircleOutlined className="userBox" style={{ fontSize: '40px' }} />)}
        </button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={whichModal.state}
          onClose={this.turnOffModal(whichModal.modal)}
          disableAutoFocus
        >
          <div className={`uim_modal ${whichModal.modal}`}>
            <button
              type="button"
              className="closebtn"
              onClick={this.turnOffModal(whichModal.modal)}
              title="Cerrar"
            >
              <CloseIcon />
            </button>
            { !user
              ? (<Login setUser={setUser} />)
              : (<UserInfo logoutHandler={this.showModal('logoutModal')} />)}
          </div>
        </Modal>
        <ConfirmationModal
          open={logoutModal}
          styleCustom="newBiomeAlarm nBA2"
          onClose={this.turnOffModal('logoutModal')}
          message="¿Desea cerrar sesión?"
          onContinue={() => {
            setUser(null);
            this.turnOffModal('logoutModal')();
          }}
          onCancel={this.turnOffModal('logoutModal')}
        />
      </div>
    );
  }
}

Uim.contextType = AppContext;
Uim.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Uim;
