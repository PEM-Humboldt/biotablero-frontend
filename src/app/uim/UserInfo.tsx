import type { UserType } from "app/uim/types";

interface LogoutHandlerProps {
  user: UserType;
  logoutHandler: () => void;
}

export function UserInfo({ user, logoutHandler }: LogoutHandlerProps) {
  return (
    <div className="user_info">
      Usuario: {user.username}
      <br />
      Email registrado: {user.email}
      <br />
      <button
        className="logoutbtn"
        title="Salir"
        type="button"
        onClick={logoutHandler}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
