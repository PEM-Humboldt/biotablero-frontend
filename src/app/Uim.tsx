import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import React, { useState, useContext, ReactNode } from "react";

import AppContext, { AppContextValue } from "app/AppContext";
import Login from "app/uim/Login";
import UserInfo from "app/uim/UserInfo";
import ConfirmationModal from "components/ConfirmationModal";

//import { UimProps } from "types/uimTypes";
interface UimProps {
  setUser: (res: null | Response  ) => React.ReactNode | void;
}

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



const Uim: React.FC<UimProps> = ({ setUser }) => {
  const [modals, setModals] = useState<LogModalsTypes>(defaultModalsValues);

  /**
   * Meant to be used by onClick handlers. Set the state for the corresponding
   * modal to true, and the others to false.
   *
   * @params {String} modal modal name to turn on
   *
   * @returns {function}
   */
  const showModal = (modal: string) => () => {
    setModals({ ...defaultModalsValues, [modal]: true });
  };

  /**
   * Meant to be used by onClick handlers. Set the state for the corresponding
   * modal to false
   *
   * @params {String} modal modal name to turn off
   *
   * @returns {function}{void}
   */
  const turnOffModal = (modal: string) => () => {
    setModals({ ...modals, [modal]: false });
  };

  const context = useContext(AppContext);
  const { user } = context as AppContextValue;
  const whichModal = user
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
        {user ? (
          <AccountCircle className="userBox" style={{ fontSize: "40px" }} />
        ) : (
          <AccountCircleOutlined
            className="userBox"
            style={{ fontSize: "40px" }}
          />
        )}
      </button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={whichModal.state}
        onClose={turnOffModal(whichModal.modal)}
        disableAutoFocus
      >
        <div className={`uim_modal ${whichModal.modal}`}>
          <button
            type="button"
            className="closebtn"
            onClick={turnOffModal(whichModal.modal)}
            title="Cerrar"
          >
            <CloseIcon />
          </button>
          {!user ? (
            <Login setUser={setUser} />
          ) : (
            <UserInfo logoutHandler={showModal("logoutModal")} />
          )}
        </div>
      </Modal>
      <ConfirmationModal
        open={modals.logoutModal}
        styleCustom="newBiomeAlarm nBA2"
        onClose={turnOffModal("logoutModal")}
        message="¿Desea cerrar sesión?"
        onContinue={() => {
          setUser(null);
          turnOffModal("logoutModal")();
        }}
        onCancel={turnOffModal("logoutModal")}
      />
    </div>
  );
};

export default Uim;
