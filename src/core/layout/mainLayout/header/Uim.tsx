import { useRef, useEffect } from "react";

import { useUserCTX } from "@hooks/UserCTX";
import defaultProfileImageUrl from "@assets/user_icon.svg?url";
import { Button } from "@ui/shadCN/component/button";
import { DoorClosed, CircleUserRound, DoorOpen, Bell } from "lucide-react";
import { useNavigate } from "react-router";

export function Uim() {
  const { user, login, logout, updateUser } = useUserCTX();
  const imageURL = useRef<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    imageURL.current = user?.picture ?? defaultProfileImageUrl;
  }, [user]);

  return (
    <div className="flex items-center ml-auto px-3">
      {user ? (
        <>
          <Button
            onClick={() => console.log("Notificaciones")}
            variant="link"
            title="Notificaciones"
            size="icon-lg"
            aria-label="Ver notificaciones"
          >
            <Bell className="size-4 md:size-5" aria-hidden="true" />
          </Button>

          <Button
            onClick={() => void updateUser()}
            variant="link"
            size="icon-lg"
            title="Editar mi usuario"
            aria-label="Ir al editor de usuario"
          >
            {user.picture ? (
              <img
                src={user.picture}
                alt=""
                className="size-5 md:size-6 aspect-square rounded-full object-cover border-2 border-foreground bg-foreground hover:border-accent hover:bg-accent"
              />
            ) : (
              <CircleUserRound
                className="size-4 md:size-5"
                aria-hidden="true"
              />
            )}
          </Button>

          <Button
            onClick={() => void logout()}
            variant="link"
            size="icon-lg"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <DoorOpen className="size-4 md:size-5" aria-hidden="true" />
          </Button>
        </>
      ) : (
        <Button
          onClick={() => void login()}
          variant="link"
          className="h-9 w-9 md:h-12 md:w-12"
          title="Iniciar sesión"
          aria-label="Iniciar sesión"
        >
          <DoorClosed className="size-6" />
        </Button>
      )}
    </div>
  );
}
