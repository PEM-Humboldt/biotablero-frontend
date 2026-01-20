import { AccountCircle } from "@mui/icons-material";
import { useAuth } from "core/context/AuthContext";

export function UserCard({ logout }: { logout: () => void }) {
  const { user, updateProfile } = useAuth();

  return (

    <>
      <AccountCircle
        className="userBo"
        style={{ fontSize: "20rem" }}
      />

      <div className="user_info">
        Usuario:
        <br />
        <b>{user?.firstName} {user?.lastName}</b>
        <br />
        Email registrado:
        <br />
        <b>{user?.email}</b>
        <br />
        <button
          className="logoutbtn"
          title="Salir"
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
      </div>

    </>
  );
}
