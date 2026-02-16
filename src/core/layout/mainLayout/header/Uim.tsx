import { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";

import { Login } from "core/layout/mainLayout/header/uim/Login";
import { UserCard } from "core/layout/mainLayout/header/uim/UserInfo";
import { ConfirmationModal } from "@composites/ConfirmationModal";
import { useUserCTX } from "@hooks/UserContext";
import { deleteTokensFromLS } from "@utils/JWTstorage";
import defaultProfileImageUrl from "@assets/user_icon.svg?url";
import { Button } from "@ui/shadCN/component/button";
import { DoorClosed, CircleUserRound, DoorOpen, Bell } from "lucide-react";

interface LogModalsTypes {
  loginModal: boolean;
  logoutModal: boolean;
  userModal: boolean;
}

const defaultModalsValues: LogModalsTypes = {
  loginModal: false,
  logoutModal: false,
  userModal: false,
};

export function Uim() {
  const [modals, setModals] = useState<LogModalsTypes>(defaultModalsValues);
  const { user, logout } = useUserCTX();
  const userCard = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userCard.current) {
      return;
    }
    const imageURL = user?.profileImg ?? defaultProfileImageUrl;
    userCard.current.style.setProperty("--profile-img", `url("${imageURL}")`);
  }, [user]);

  const showModal = (modal: string) => () => {
    setModals({ ...defaultModalsValues, [modal]: true });
  };

  const logoutUser = () => {
    logout();
    deleteTokensFromLS();
    hideModal("logoutModal")();
  };

  const hideModal = (modal: string) => () => {
    setModals({ ...modals, [modal]: false });
  };

  const whichModal = user
    ? { modal: "userModal", state: modals.userModal }
    : { modal: "loginModal", state: modals.loginModal };

  return (
    <>
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
              onClick={() => {
                console.log("Perfil");
                showModal(whichModal.modal)();
              }}
              variant="link"
              className="h-9 w-9 md:h-12 md:w-12"
              title="Mi perfil"
            >
              <span className="sr-only">Mi perfil</span>
              <CircleUserRound
                className="size-4 md:size-5"
                aria-hidden="true"
              />
            </Button>

            <Button
              onClick={() => console.log("Cerrar sesión")}
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
            onClick={showModal(whichModal.modal)}
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

      {/* NOTE: todo lo que sique se va apenas entre el nuevo sistema de usuarios */}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={whichModal.state}
        onClose={hideModal(whichModal.modal)}
        disableAutoFocus
        keepMounted
      >
        <div ref={userCard} className={`uim_modal ${whichModal.modal}`}>
          <button
            type="button"
            className="closebtn"
            onClick={hideModal(whichModal.modal)}
            title="Cerrar"
          >
            <CloseIcon />
          </button>
          {!user ? <Login /> : <UserCard logout={showModal("logoutModal")} />}
        </div>
      </Modal>

      <ConfirmationModal
        open={modals.logoutModal}
        styleCustom="newBiomeAlarm nBA2"
        onClose={hideModal("logoutModal")}
        message="¿Desea cerrar sesión?"
        onContinue={logoutUser}
        onCancel={hideModal("logoutModal")}
      />
    </>
  );
}
