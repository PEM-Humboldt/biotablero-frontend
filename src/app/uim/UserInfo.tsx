import type { UserType } from "types/loginUimProps";

interface LogoutHandlerProps {
  logoutHandler: () => void;
  user: UserType;
}
export function UserInfo({ user, logoutHandler }: LogoutHandlerProps) {
  return (
    <div className="user_info">
      <b>Usuario</b>
      <br />
      {user.name}
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
