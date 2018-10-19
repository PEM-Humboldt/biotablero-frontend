/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Modal from '@material-ui/core/Modal';
import Login from '../Login';

/* Uim: User Interface Manager */
class Uim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  handleCloseModal = () => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal });
    console.log(this.state);
  };

  render() {
    const { userLogged } = this.props;
    const { openModal } = this.state;
    return (
      <div>
        { userLogged ? ( // TODO: Implementing user identification
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
        {openModal && (
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openModal}
            onClose={this.handleCloseModal}
            disableAutoFocus
          >
            <Login openModalControl={this.handleCloseModal} />
          </Modal>)
        }
      </div>
    );
  }
}

Uim.propTypes = {
  userLogged: PropTypes.object,
};

Uim.defaultProps = {
  userLogged: null,
};

export default Uim;
