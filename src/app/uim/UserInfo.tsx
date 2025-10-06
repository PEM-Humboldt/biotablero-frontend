import { useUserCTX } from "app/UserContext";

export function UserInfo({ logout }: { logout: () => void }) {
  const { user } = useUserCTX();

  return (
    <div className="user_info">
      Usuario:
      <br />
      <b>{user!.username}</b>
      <br />
      email registrado:
      <br />
      <b>{user!.email}</b>
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
  );
}
