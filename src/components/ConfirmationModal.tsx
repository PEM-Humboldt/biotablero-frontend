import React from "react";
import Modal from "@mui/material/Modal";

interface ConfirmationModalTypes {
  open?: boolean;
  onClose?: () => void;
  message: string;
  styleCustom?: string | null;
  onContinue: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalTypes> = ({
  open = false,
  onClose=()=>{},
  message,
  onContinue,
  onCancel,
  styleCustom = null,
}) => (
  console.log("que es",()=>{}),
  
  <Modal
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    open={open}
    onClose={onClose}
  >
    <div className={styleCustom || "newBiomeAlarm"}>
      <div>{message}</div>
      <button type="button" onClick={onContinue}>
        Si
      </button>
      <button type="button" onClick={onCancel}>
        No
      </button>
    </div>
  </Modal>
);

export default ConfirmationModal;
