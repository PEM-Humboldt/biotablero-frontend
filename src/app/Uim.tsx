import { useEffect, useRef, useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";

import { Login } from "app/uim/Login";
import { UserInfo } from "app/uim/UserInfo";
import ConfirmationModal from "components/ConfirmationModal";
import type { UserType } from "app/uim/types";

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

export type LoginUimProps = {
  currentUser: UserType | null;
  setUser: (res: UserType | null) => void;
  logoutUser: () => void;
};

export function Uim({ setUser, currentUser, logoutUser }: LoginUimProps) {
  const [modals, setModals] = useState<LogModalsTypes>(defaultModalsValues);
  const userCard = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userCard.current) {
      return;
    }
    userCard.current.style.setProperty(
      "--profile-img",
      `url(${currentUser?.profileImg ? currentUser?.profileImg : "src/images/LogoGEB.png"})`,
    );
  }, [currentUser?.profileImg]);

  const showModal = (modal: string) => () => {
    setModals({ ...defaultModalsValues, [modal]: true });
  };

  const hideModal = (modal: string) => () => {
    setModals({ ...modals, [modal]: false });
  };

  const whichModal = currentUser
    ? { modal: "userModal", state: modals.userModal }
    : { modal: "loginModal", state: modals.loginModal };

  return (
    <div className="loginBtnCont">
      <button
        type="button"
        className="loginBtn"
        onClick={showModal(whichModal.modal)}
        title="Iniciar sesión"
      >
        {currentUser ? (
          <AccountCircle className="userBox" style={{ fontSize: "40px" }} />
        ) : (
          <AccountCircleOutlined
            className="userBox"
            style={{ fontSize: "35px" }}
          />
        )}
      </button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={whichModal.state}
        onClose={hideModal(whichModal.modal)}
        disableAutoFocus
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
          {!currentUser ? (
            <Login setUser={setUser} />
          ) : (
            <UserInfo
              user={currentUser}
              logoutHandler={showModal("logoutModal")}
            />
          )}
        </div>
      </Modal>
      <ConfirmationModal
        open={modals.logoutModal}
        styleCustom="newBiomeAlarm nBA2"
        onClose={hideModal("logoutModal")}
        message="¿Desea cerrar sesión?"
        onContinue={() => {
          logoutUser();
          hideModal("logoutModal")();
        }}
        onCancel={hideModal("logoutModal")}
      />
    </div>
  );
}
