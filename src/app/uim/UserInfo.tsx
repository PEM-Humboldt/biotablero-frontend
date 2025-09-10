import React from "react";

import { AppContext } from "app/AppContext";

interface LogoutHandlerProps {
  logoutHandler: () => void;
}
export function UserInfo({ logoutHandler }: LogoutHandlerProps) {
  return (
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
}
