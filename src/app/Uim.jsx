import { PropTypes } from 'prop-types';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import React, { Component, useState, useContext } from 'react';

import AppContext from 'app/AppContext';
import Login from 'app/uim/Login';
import UserInfo from 'app/uim/UserInfo';
import ConfirmationModal from 'components/ConfirmationModal';

const logModals = {
    loginModal: false,
    logoutModal: false,
    userModal: false,
};

const Uim = ({ setUser }) => {

  const [loginModal, setLoginModal] = useState( false );
  const [logoutModal, setLogoutModal] = useState( false );
  const [userModal, setUserModal] = useState( false );

  const [modals, setModals] = useState( logModals)

    /**
   * Meant to be used by onClick handlers. Set the state for the corresponding
   * modal to true, and the others to false.
   *
   * @params {String} modal modal name to turn on
   *
   * @returns {function}
   */

    const showModal = (modal) => () => {
      setModals({ ...modals, [modal]: true });
    }

    // const showModal = (modal) => () => {
    //   console.log(modal)
    //   switch (modal) {
    //     case 'loginModal':
    //       setModals({ ...modals, [modal]: true });

    //       // setLoginModal(true);
    //       // setLogoutModal(false);
    //       // setUserModal(false);
    //       break;
    //     case 'logoutModal':
    //       setModals({ ...modals, [modal]: true });

    //       // setLoginModal(false);
    //       // setLogoutModal(true);
    //       // setUserModal(false);
    //       break;
    //     case 'userModal':
    //       setModals({ ...modals, [modal]: true });

    //       // setModals({ [modals.loginModal]: false, [modals.logoutModal]: false, [modals.userModal]: true });
    //       // setLoginModal(false);
    //       // setLogoutModal(false);
    //       // setUserModal(true);
    //       break;
    //     default:
    //       break;
    //   }
    // };

    /**
   * Meant to be used by onClick handlers. Set the state for the corresponding
   * modal to false
   *
   * @params {String} modal modal name to turn off
   *
   * @returns {function}{void}
   */
  const turnOffModal = (modal) => () => {
    setModals({ [modal]: false });
  }

  const { user } = useContext(AppContext);
  const whichModal = user  ? { modal: 'userModal', state: modals.userModal } : { modal: 'loginModal', state: modals.loginModal };

    return (
      <div className="loginBtnCont">
        <button
          type="button"
          className="loginBtn"
          onClick={showModal(whichModal.modal)}
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
          onClose={turnOffModal(whichModal.modal)}
          disableAutoFocus
        >
          <div className={`uim_modal ${whichModal.modal}`}>
            <button
              type="button"
              className="closebtn"
              onClick={turnOffModal(whichModal.modal)}
              title="Cerrar"
            >
              <CloseIcon />
            </button>
            { !user
              ? (<Login setUser={setUser} />)
              : (<UserInfo logoutHandler={showModal('logoutModal')} />)}
          </div>
        </Modal>
        <ConfirmationModal
          open={modals.logoutModal}
          styleCustom="newBiomeAlarm nBA2"
          onClose={turnOffModal('logoutModal')}
          message="¿Desea cerrar sesión?"
          onContinue={() => {
            setUser(null);
            turnOffModal('logoutModal')();
          }}
          onCancel={turnOffModal('logoutModal')}
        />
      </div>
    );
};

class Uim2 extends Component {
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
        console.log('loginModal');
        this.setState({ loginModal: true, logoutModal: false, userModal: false });
        console.log(this.state.loginModal);
        break;
      case 'logoutModal':
        console.log('logoutModal');
        this.setState({ loginModal: false, logoutModal: true, userModal: false });
        break;
      case 'userModal':
        console.log('userModal');
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

// Uim.contextType = AppContext;
Uim.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Uim;
