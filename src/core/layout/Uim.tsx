import { useState, useRef } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";

import { Login } from "core/layout/uim/Login";
import { UserCard } from "core/layout/uim/UserInfo";
import ConfirmationModal from "components/ConfirmationModal";
import { useUserCTX } from "core/hooks/UserContext";
import { deleteTokensFromLS } from "core/utils/JWTstorage";

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

  if (user && userCard.current) {
    userCard.current.style.setProperty(
      "--profile-img",
      `url(${user?.profileImg ? user.profileImg : `/images/user_icon.svg`})`,
    );
  }

  return (
    <div className="loginBtnCont">
      <button
        type="button"
        className="loginBtn"
        onClick={showModal(whichModal.modal)}
        title="Iniciar sesión"
      >
        {user ? (
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
    </div>
  );
}
