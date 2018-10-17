/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Login from '../Login';

/* Uim: User Interface Manager */
const Uim = ({ userLogged }) => (
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
      onClick={() => <Login />}
    >
      <AccountCircle
        className="userBox"
        style={{ fontSize: '40px' }}
      />
    </button>
  </div>
);

Uim.propTypes = {
  userLogged: PropTypes.object,
};

Uim.defaultProps = {
  userLogged: null,
};

export default Uim;
