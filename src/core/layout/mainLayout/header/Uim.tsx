import { useRef, useEffect } from "react";

import { useUserCTX } from "@hooks/UserContext";
import defaultProfileImageUrl from "@assets/user_icon.svg?url";
import { Button } from "@ui/shadCN/component/button";
import { DoorClosed, CircleUserRound, DoorOpen, Bell } from "lucide-react";
import { useNavigate } from "react-router";

export function Uim() {
  const { user, login, logout } = useUserCTX();
  const imageURL = useRef<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    imageURL.current = user?.picture ?? defaultProfileImageUrl;
  }, [user]);

  return (
    <div className="flex ml-auto px-3">
      {user ? (
        <>
          <Button
            onClick={() => console.log("Notificaciones")}
            variant="link"
            className="h-9 w-9 md:h-12 md:w-12"
            title="Notificaciones"
          >
            <span className="sr-only">Notificaciones</span>
            <Bell className="size-4 md:size-5" aria-hidden="true" />
          </Button>

          <Button
            onClick={() => void navigate("/Monitoreo/MiPerfil")}
            variant="link"
            className="h-9 w-9 md:h-12 md:w-12"
            title="Mi perfil"
          >
            <span className="sr-only">Mi perfil</span>
            <CircleUserRound className="size-4 md:size-5" aria-hidden="true" />
          </Button>

          <Button
            onClick={() => void logout()}
            variant="link"
            className="h-9 w-9 md:h-12 md:w-12"
            title="Cerrar sesión"
          >
            <span className="sr-only">Cerrar sesión</span>
            <DoorOpen className="size-4 md:size-5" aria-hidden="true" />
          </Button>
        </>
      ) : (
        <Button
          onClick={() => void login()}
          variant="link"
          className="h-9 w-9 md:h-12 md:w-12"
        >
          <span className="sr-only">
            {user ? "Ver mi perfil" : "Iniciar sesión"}
          </span>
          <DoorClosed className="size-6" />
        </Button>
      )}
    </div>
  );
}
