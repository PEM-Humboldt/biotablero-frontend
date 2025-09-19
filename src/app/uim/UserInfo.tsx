import type { UserType } from "app/uim/types";

interface LogoutHandlerProps {
  user: UserType;
  logoutHandler: () => void;
}

export function UserInfo({ user, logoutHandler }: LogoutHandlerProps) {
  return (
    <div className="user_info">
      Usuario:{user.username}
      <br />
      email registrado:{user.email}
      <br />
      tipo de usuario:{user.roles[0]}
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
