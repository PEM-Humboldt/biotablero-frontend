import { useAuth } from "core/context/AuthContext";

interface ConfirmationModalTypes {
  logout: () => void;
}

export function UserCard({ logout }: ConfirmationModalTypes) {
  const { user, updateProfile, changePassword } = useAuth();

  return (

    <>
      <div className="user_info">
        <b>Usuario</b>
        <br />
        {user?.firstName} {user?.lastName}
        <br />
        <b>Email registrado</b>
        <br />
        {user?.email}
        <br />
        <button
          className="logoutbtn"
          title="Editar"
          type="button"
          onClick={updateProfile}
        >
          Editar Perfil
        </button>
        <br />
        <button
          className="logoutbtn"
          title="Salir"
          type="button"
          onClick={logout}
        >
          Cerrar Sesión
        </button>
        {/* <button
          className="logoutbtn"
          title="Cambiar contraseña"
          type="button"
          onClick={changePassword}
        >
          Cambiar contraseña
        </button> */}
      </div>

    </>
  );
}
