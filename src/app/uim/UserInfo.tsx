import React from "react";

import AppContext from "app/AppContext";

interface LogoutHandlerProps {
  logoutHandler: () => void;
}
const UserInfo: React.FC<LogoutHandlerProps> = ({ logoutHandler }) => (
  <AppContext.Consumer>
    {({ user }) => (
      <div className="user_info">
        <b>Usuario</b>
        <br />
        {user?.name}
        <button
          className="logoutbtn"
          title="Salir"
          type="button"
          onClick={logoutHandler}
        >
          Cerrar Sesión
        </button>
      </div>
    )}
  </AppContext.Consumer>
);

export default UserInfo;
